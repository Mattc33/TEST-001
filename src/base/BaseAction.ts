import { IBaseStore } from "./BaseStore";

export abstract class BaseAction<U, T extends IBaseStore> {
  public getState: () => U;
  public dispatcher: (state: any) => void;
  public dispatcherByPath: (path: string, update: any) => void;

  constructor(store: T) {
    this.getState = store.getState.bind(store);
    this.dispatcher = store.dispatcher.bind(store);
    this.dispatcherByPath = store.dispatcherByPath.bind(store);
  }
}
