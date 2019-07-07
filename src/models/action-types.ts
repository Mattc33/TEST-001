/**
 * @interface
 * Defines a generic action by providing
 * the action type property.
 */
export interface IAction {
    type: string;
}

/**
 * @interface
 * Defines a generic completed action
 * for asynchronous events by providing 
 * the payload property for passing response
 * data.
 */
export interface ICompletedAction<T> extends IAction {
    error?: Array<string>;
    payload?: T;
}

/**
 * @interface
 * Defines an action that will trigger another action
 * i.e., asychronous actions
 */
export interface ITriggerAction extends IAction {

    nextAction?: string;

}