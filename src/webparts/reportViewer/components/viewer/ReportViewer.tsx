import * as React from "react";
import styles from "./ReportViewer.module.scss";
import { REPORT_VIEWER_PATH } from "../../state/IReportViewerState";
import { ConnectByPath } from "../../../../base";
import { ReportViewerContext } from "../../store/ReportViewerStore";
import { Toolbar } from "../toolbar/toolbar";
import { TableauReport } from "../tableauReport/TableauReport";
import { IReportViewer } from "../../state/IReportViewerState";
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

export interface IReportViewerProps {
  description: string;
  state: IReportViewer;
}

export interface IReportViewerState {
  height?: number;
  width?: number;
}

export class ReportViewer extends React.Component<IReportViewerProps, IReportViewerState> {
  private tableauReportRef: TableauReport;

  constructor(props) {
    super(props);

    this.state = {
      height: 704,
      width: 799
    };
  }

  public componentDidMount() {
    const viewerProps = this.props.state;
    viewerProps.actions.loadReportData();
  }

  public render(): React.ReactElement<IReportViewerProps> {
    return (
      <div className={styles.reportViewer}>
        <Toolbar 
          types={["sizing", "savecustom", "story", "favorite", "feedback", "fullscreen"]}
          height={this.state.height}
          width={this.state.width}
          onClick={this.handleToolbarClick}
        />

        {this.props.state.loading && <div>Loading....</div>}

        {!this.props.state.loading && 
          <TableauReport
            ref={t => this.tableauReportRef = t}
            reportURL={'https://viz.gallery/views/PHARMACEUTICALSALESPERFORMANCE/PharmaceuticalSalesPerformance?:embed=y'}   //{'https://viz.gallery/views/PROJECTMANAGEMENTPORTFOLIO/ProjectManagementPortfolio?:embed=y'}
            height={this.state.height}
            width={this.state.width}
          />
        }
      </div>
    );
  }

  @autobind
  private handleToolbarClick(type: string, args?: any) {
    console.info('handleToolbarClick', type, args);
    switch(type) {
      case "sizing":
        return this.handleSizingCommandClick(type, args);
      case "story":
        return;
      case "savecustom":
        return this.handleSaveCustomView();
      case "favorite":
        return;
      case "feedback":
        return;
      case "fullscreen":
        return;
    }
  }

  @autobind
  private async handleSaveCustomView() {
    if (this.tableauReportRef) {
      const viewInfo = await this.tableauReportRef.saveCustomView("test name 3");
      console.info('handleSaveCustomView', viewInfo);
    }
  }

  @autobind
  private handleSizingCommandClick(type: string, args: any) {
    const { height, width } = args;

    this.setState({
      height,
      width
    });
  }
}

const ReportViewerWithState = ConnectByPath(
  ReportViewerContext,
  ReportViewer,
  REPORT_VIEWER_PATH
);
export { ReportViewerWithState };
