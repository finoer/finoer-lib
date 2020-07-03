import IOper from './IOper';
import Queue from './Queue';
import EventDispatcher from '../event/core/EventDispatcher';
import IEvent from '../event/core/interfaces/IEvent';

/**
 * @description example class
 * @author xxx
 * @since 2020.01.01
 */


export default class Oper implements IOper {

    private _event = new EventDispatcher<Oper,string>();

    constructor() {
    }


    /**
     * Execute right now
     * 
     */		
    public execute():void
    {

    }
    
    /**
     * Succeed Function
     * 
     */		
    public result(event:any):void
    {
      console.log(event)
    }
    
    /**
     * Fault Function
     * 
     */		
    public fault(event:any):void
    {
      console.log(event)
    }
    
    /**
     * Push to queue
     * 
     * @param queue	used queue, if null, use the default one.
     * 
     */
    commit(queue:Queue|null):void
    {
      console.log(queue)
    }
    
    /**
     * Halt queue
     * 
     */
    public halt():void{

    }

    public get onEvent(): IEvent<Oper, string>
	{
		return this._event.asEvent();
	}

	public signal(message: string)
	{
		if(message) {
			this._event.dispatch(this, message);	
		}
	}
  }
  