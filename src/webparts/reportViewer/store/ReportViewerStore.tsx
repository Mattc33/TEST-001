import * as React from "react";
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';

import { BaseStore } from "../../../base";
import { IContextProps } from "../../../models";
import { IReportViewerState } from "../state/IReportViewerState";

import { ReportViewerActions } from "../components/viewer/ReportViewActions";

export const ReportViewerContext = React.createContext<IContextProps<IReportViewerState>>(undefined);
export interface IReportViewerStoreProps {
  context: WebPartContext;
}

export class ReportViewerStore extends BaseStore<IReportViewerStoreProps, IReportViewerState> {
  constructor(props: IReportViewerStoreProps) {
    super(props);
    console.info('ReportViewerStore:ctor', props);

    const viewerActions = new ReportViewerActions(this, props.context);

    this.state = {
      reportViewer: { actions: viewerActions, loading: false, context: props.context }
    };
  }

  public render() {
    const state = this.state;

    return (
      <ReportViewerContext.Provider value={{ state }}>
        {this.props.children}
      </ReportViewerContext.Provider>
    );
  }
}
