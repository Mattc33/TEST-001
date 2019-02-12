import * as React from 'react';

import { BaseStore } from "../../../components/_base";
import { IContextProps } from "../../../models";
import { IReportViewerState } from "../state/IReportViewerState";

import { ReportViewerActions } from "../components/viewer/ReportViewActions";

export const ReportViewerContext = React.createContext<IContextProps<IReportViewerState>>(undefined);

export class ReportViewerStore extends BaseStore<any, IReportViewerState> {

    constructor(props: any) {
        super(props);
    
        const viewerActions = new ReportViewerActions(this.getState, this.dispatcher, this.dispatcherByPath);

        this.state = { 
            reportViewer: { actions: viewerActions, loading: true }
        };
    }

    
}
