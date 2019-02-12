import * as React from 'react';
import * as dot from 'ts-dot-prop';

export class BaseStore<P, S> extends React.Component<P, S> {

    constructor(props: P) {
        super(props);
        
        this.dispatcher = this.dispatcher.bind(this);
        this.dispatcherByPath = this.dispatcherByPath.bind(this);
        this.getState = this.getState.bind(this);
    }

    public dispatcher(incomingState: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const newState = { ...this.state, ...incomingState };
            this.setState(newState, () => {
                resolve();
            });
        });
    }

    public dispatcherByPath<U>(path: string, update: U): Promise<void> {
        return new Promise((resolve, reject) => {
            this.setState((state) => {
                dot.set(state as any, path, update); //state.reportViewer.countryEntities[id] = update;
                return state;
            }, () => {
                resolve();
            });
        });
    }

    public getState(): S {
        return this.state; //return cloneDeep(this.state);
    }
}
