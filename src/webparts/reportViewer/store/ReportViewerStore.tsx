import * as React from "react";
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';

import { BaseStore } from "../../../base";
import { IContextProps } from "../../../models";
import { IReportViewerState } from "../state/IReportViewerState";
import { IReportViewerStoreProps } from "../state/IReportViewerStoreProps";

import { ReportViewerActions } from "../action/ReportViewActions";
import { ReportDiscussionActions } from "../../controls/ReportDiscussion";

export const ReportViewerContext = React.createContext<IContextProps<IReportViewerState>>(undefined);

export class ReportViewerStore extends BaseStore<IReportViewerStoreProps, IReportViewerState> {
  constructor(props: IReportViewerStoreProps) {
    super(props);
    console.info('ReportViewerStore:ctor', props);

    const viewerActions = new ReportViewerActions(this, props.storeState.context);
    const discussionActions = new ReportDiscussionActions(this, props.storeState.context);

    this.state = {
      reportViewer: { ...{ 
        context: props.storeState.context, 
        tableauReportConfig: props.storeState.tableauReportConfig, 
        actions: viewerActions, 
        loading: false 
      } },
      reportDiscussion: { ...{ 
        report: null, 
        replies: [], 
        context: props.storeState.context, 
        actions: discussionActions, 
        loading: false 
      } }
    };
  }

  public static getDerivedStateFromProps(props: IReportViewerStoreProps, state: IReportViewerState) {
    if (props.storeState.tableauReportConfig !== state.reportViewer.tableauReportConfig) {
      state.reportViewer.tableauReportConfig = props.storeState.tableauReportConfig;
      return state;
    }

    return null;
  }

  public render() {
    const state = this.state;
    console.info('ReportViewerStore::render', state);

    return (
      <ReportViewerContext.Provider value={{ state }}>
        {this.props.children}
      </ReportViewerContext.Provider>
    );
  }
}
