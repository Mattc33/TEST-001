import * as React from "react";

import { BaseStore } from "../../../base";
import { IContextProps } from "../../../models";
import { IReportViewerState } from "../state/IReportViewerState";

import { ReportViewerActions } from "../components/viewer/ReportViewActions";

export const ReportViewerContext = React.createContext<IContextProps<IReportViewerState>>(undefined);

export class ReportViewerStore extends BaseStore<{}, IReportViewerState> {
  constructor(props: any) {
    super(props);

    const viewerActions = new ReportViewerActions(this);

    this.state = {
      reportViewer: { actions: viewerActions, loading: false }
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
