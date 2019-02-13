import * as React from "react";
import styles from "./ReportViewer.module.scss";
import { IReportViewerProps } from "./IReportViewerProps";
import { REPORT_VIEWER_PATH } from "../../state/IReportViewerState";
import { ConnectByPath } from "../../../../base";
import { ReportViewerContext } from "../../store/ReportViewerStore";
import { Toolbar } from "../toolbar/toolbar";

export class ReportViewer extends React.Component<IReportViewerProps, {}> {
  public componentDidMount() {
    const viewerProps = this.props.state;
    viewerProps.actions.loadReportData();
  }

  public render(): React.ReactElement<IReportViewerProps> {
    return (
      <div className={styles.reportViewer}>
        <Toolbar 
          types={["sizing"]}
          onClick={this.handleToolbarClick}
        />

        {this.props.state.loading && <div>Loading....</div>}
        {!this.props.state.loading && <div>Completed loading!</div>}
      </div>
    );
  }

  private handleToolbarClick(type: string, args: any) {
    console.info('handleToolbarClick', type, args);
  }
}

const ReportViewerWithState = ConnectByPath(
  ReportViewerContext,
  ReportViewer,
  REPORT_VIEWER_PATH
);
export { ReportViewerWithState };
