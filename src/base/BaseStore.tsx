import * as React from "react";
import * as dot from "ts-dot-prop";

export interface IBaseStore {
  dispatcher(incomingState: any): Promise<void>;
  dispatcherByPath(path: string, update: any): Promise<void>;
  getState(): any;
}

export abstract class BaseStore<P = {}, S = {}> extends React.Component<P, S>
  implements IBaseStore {
  constructor(props: P) {
    super(props);
  }

  public dispatcher(incomingState: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const newState = { ...(this.state as any), ...incomingState };
      this.setState(newState, () => {
        resolve();
      });
    });
  }

  public dispatcherByPath(path: string, update: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.setState(
        state => {
          dot.set(state as any, path, update);
          return state;
        },
        () => {
          resolve();
        }
      );
    });
  }

  public getState(): S {
    return this.state;
  }
}
