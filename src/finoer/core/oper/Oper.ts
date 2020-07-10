import IOper from './IOper'
import Queue from './Queue'
import EventDispatcher from '../event/core/EventDispatcher'
import OperEvent from './OperEvent'

/**
 * @description Oper
 * @author xxx
 * @since 2020.01.01
 */

export default abstract class Oper extends EventDispatcher<Oper, OperEvent>
    implements IOper {
    static NONE: number = 0
    static WAIT: number = 1
    static RUN: number = 2
    static END: number = 3

    constructor() {
        super()
    }

    /**
     * ID
     */
    public id: string | undefined

    /**
     * Current Queue
     */

    public queue: Queue | undefined

    /**
     * Current Step
     */

    public step: number = Oper.NONE

    /**
     * Last Result
     */
    public lastResult: any

    /**
     * Immediately
     *
     * Don't wait  wait, run next Oper immediately.
     */
    public immediately: boolean = false

    /**
     * Countinue when fail
     */
    public continueWhenFail: boolean = true

    /**
     * Execute right now
     *
     */

    public execute(): void {
        var event: OperEvent = new OperEvent(OperEvent.OPERATION_START, this)
        this.dispatch(this, event)
        if (this.queue) {
            // this.queue
            // queue dispatch or this dispatch
            this.queue.dispatch(
                this,
                new OperEvent(OperEvent.CHILD_OPERATION_START, this.queue, this)
            )
        }

        this.step = Oper.RUN

        if (this.immediately) {
            event = new OperEvent(OperEvent.OPERATION_COMPLETE, this)
            this.dispatch(this, event)

            if (this.queue) {
                this.dispatch(
                    this,
                    new OperEvent(
                        OperEvent.CHILD_OPERATION_COMPLETE,
                        this.queue,
                        this
                    )
                )
            }
        }
    }

    /**
     * Succeed Function
     *
     */

    public result(result?: any): void {
        this.lastResult = result

        this.end(result)
        var event: OperEvent = new OperEvent(OperEvent.OPERATION_COMPLETE, this)
        event.result = result
        this.dispatch(this, event)

        if (this.queue) {
            event = new OperEvent(
                OperEvent.CHILD_OPERATION_COMPLETE,
                this.queue,
                this
            )
            event.result = result
            this.dispatch(this, event)

            this.queue = undefined
        }

        this.step = Oper.END
    }

    /**
     * Fault Function
     *
     */

    public fault(result?: any): void {
        this.lastResult = result
        this.end(result)

        var event: OperEvent = new OperEvent(OperEvent.OPERATION_ERROR, this)
        event.result = result
        this.dispatch(this, event)

        if (this.queue) {
            event = new OperEvent(
                OperEvent.CHILD_OPERATION_ERROR,
                this.queue,
                this
            )
            event.result = result
            this.dispatch(this, event)

            this.queue = undefined
        }

        this.step = Oper.END
    }

    /**
     * Push to queue
     *
     * @param queue	used queue, if null, use the default one.
     *
     */
    commit(queue?: Queue): void {
        if (!this.queue) this.queue = Queue.defaultQueue

        this.queue.commitChild(this)
    }

    /**
     * End function
     * @param event
     *
     */
    end(event?: any): void {}

    /**
     * Halt queue
     *
     */
    public halt(): void {
        this.end()
        if (this.queue) this.queue.haltChild(this)
    }
}
