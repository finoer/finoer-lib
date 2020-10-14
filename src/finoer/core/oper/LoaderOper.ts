import IEventHandler from '../event/core/IEventHandler'
import IEventManagement from '../event/core/IEventManagement'
import OperEvent from '../event/OperEvent'
import Oper from './Oper'
import RetryOper from './RetryOper'

/**
 * Load  Oper
 * Load content use xmlrequest or script tag
 * @author
 *
 */

interface ActiveXObject {
    new (s: string): any
}

declare var ActiveXObject: ActiveXObject

export default class LoadOper extends RetryOper {
    public static AUTO: string = 'auto'
    public static AJAX: string = 'ajax'
    public static SCRIPT: string = 'script'

    /**i快8，·16
     * URL postfix
     */
    public static postfix: string = ''

    /**
     * Loader Type for content
     */
    public static LOADER_TYPE: Array<string> = [
        'js',
        'json',
        'gif',
        'png',
        'jpg'
    ]
    /**
     * Path
     */

    // public xhrrequest?: XMLHttpRequest | ActiveXObject =  (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
    public xhrrequest: XMLHttpRequest = new XMLHttpRequest()

    public scriptloader: HTMLScriptElement = document.createElement('script')

    private _name: string = ''

    /**
     * Used for disply in progress bar
     */
    get name(): string {
        return this._name ? this._name : this.id
    }

    set name(value: string) {
        this._name = value
    }

    /**
     * Load type
     */
    public type: string = LoadOper.AUTO

    /**
     * Load conent format
     */

    public dataFormat: string = ''

    /**
     * Window Document
     */

    public parentDom: Document = document

    /**
     * Stop animation when start loading
     */
    public stopAtInit: boolean = false

    /**
     * URL for loader
     */
    private url: string = ''

    /**
     *
     * @param url	path
     *
     *
     */

    constructor(
        url: string = '',
        rhandler?: IEventHandler<Oper, OperEvent> | undefined,
        fhandler?: IEventHandler<Oper, OperEvent> | undefined,
        loadtype: string = 'script'
    ) {
        super()
        this.url = url + LoadOper.postfix
        this.type = loadtype
        if (this.type == 'script') {
            this.scriptloader.type = 'text/javascript'
        } else if (this.type == 'ajax') {
            this.xhrrequest = new XMLHttpRequest()
        }

        if (rhandler != undefined)
            this.subscribe(
                (s: Oper, event: OperEvent, ev: IEventManagement) => {
                    if (event.type == OperEvent.OPERATION_COMPLETE) {
                        rhandler(s, event, ev)
                    }
                }
            ).bind(this)

        if (fhandler != undefined)
            this.subscribe(
                (s: Oper, event: OperEvent, ev: IEventManagement) => {
                    if (event.type == OperEvent.OPERATION_ERROR) {
                        fhandler(s, event, ev)
                    }
                }
            ).bind(this)
    }

    /**
     * Load right now.
     *
     */

    execute(): void {
        //this.xhrrequest.onreadystatechange
        console.log('start')
        debugger
        if (this.type == 'ajax') {
            if (this.xhrrequest) {
                this.xhrrequest.open('GET', this.url)
                this.xhrrequest.onreadystatechange = this.changeHandler.bind(
                    this
                )
                this.xhrrequest.send()
            } else {
                console.error('url is not set or browser is not support')
            }
        } else if (this.type == 'script') {
            this.scriptloader.src = this.url
            this.scriptloader.addEventListener('error', this.fault.bind(this))
            this.scriptloader.addEventListener('load', () => {
              this.alawaySuccess = true
            })

            document.body.appendChild(this.scriptloader)

        }

        super.execute()
    }

    changeHandler(event: Event): any {
        if (this.xhrrequest) {
            console.log('xhr' + JSON.stringify(this.xhrrequest))
        }

        if (
            this.xhrrequest &&
            this.xhrrequest.readyState == 4 &&
            this.xhrrequest.status == 200
        ) {
            console.log('成功')
            //console.log(this.xhrrequest.response)
            this.result(this.xhrrequest.response)
        } else {
            // this.fault()
        }
    }

    result(result?: any): void {
        super.result(event)
    }

    fault(result?: any): void {
        super.fault(event)
    }

    protected loadEmbedClass(): void {}

    protected initHandler(event: Event): void {}

    progressHandler(event: ProgressEvent): void {}

    /**
     *  Halt download progress, remove form queue.
     */
    halt(): void {
        super.halt()
    }

    /**
     * Data
     */

    get data(): any {
        return this.xhrrequest.response
        console.log(this.data())
    }
}
