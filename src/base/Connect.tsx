import * as React from 'react';

export const Connect = (Context: React.Context<any>, Component: any) => {
    return ((props) => {
        return (
            <Context.Consumer>
                {({ state }) => (
                    <Component {...props} state={state} />
                )}
            </Context.Consumer>
        );
    });
};

export const ConnectByPath = (Context: React.Context<any>, Component: any, branchName: string) => {
    return ((props) => {
        return (
            <Context.Consumer>
                {({ state }) => (
                    <Component {...props} state={state[branchName]} />
                )}
            </Context.Consumer>
        );
    });
};