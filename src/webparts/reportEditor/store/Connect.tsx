import * as React from 'react';
import { ReportEditorContext } from './ReportEditorStore';

export const Connect = (Component: any) => {
    return ((props) => {
        return (
            <ReportEditorContext.Consumer>
                {({ state }) => (
                    <Component {...props} state={state} actions={state.reportEditor.actions} />
                )}
            </ReportEditorContext.Consumer>
        );
    });
};

export const ConnectBranch = (Component: any, branchName: string) => {
    return ((props) => {
        return (
            <ReportEditorContext.Consumer>
                {({ state }) => (
                    <Component {...props} state={state[branchName]} />
                )}
            </ReportEditorContext.Consumer>
        );
    });
};