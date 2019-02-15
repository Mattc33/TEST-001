import * as React from "react";
import styles from "./ReportViewer.module.scss";
import { REPORT_VIEWER_PATH } from "../../state/IReportViewerState";
import { ConnectByPath } from "../../../../base";
import { ReportViewerContext } from "../../store/ReportViewerStore";
import { Toolbar } from "../toolbar/toolbar";
import { ViewNamePrompt } from "../toolbar/viewNamePrompt";
import { TableauReport } from "../tableauReport/TableauReport";
import { IReportViewer } from "../../state/IReportViewerState";
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { Utils } from "../../../../utils/utils";

export interface IReportViewerProps {
  description: string;
  state: IReportViewer;
}

export interface IReportViewerState {
  height?: number;
  width?: number;
  showCustomViewNamePrompt: boolean;
}

export class ReportViewer extends React.Component<IReportViewerProps, IReportViewerState> {
  private tableauReportRef: TableauReport;
  private customViewNameRef: HTMLInputElement;

  constructor(props: IReportViewerProps) {
    super(props);

    this.state = {
      height: (props.state.report) ? props.state.report.SVPHeight || 704 : 704,
      width: (props.state.report) ? props.state.report.SVPWidth || 799 : 799,
      showCustomViewNamePrompt: false
    };
  }

  public componentDidMount() {
    const reportId = Utils.getParameterByName("reportId");
    const viewerProps = this.props.state;

    viewerProps.actions.loadReportData(parseInt(reportId));
  }

  public render(): React.ReactElement<IReportViewerProps> {
    return (
      <div className={styles.reportViewer}>
        {this.props.state.loading && <div>Loading....</div>}

        {!this.props.state.loading && 
          <Toolbar 
            types={["sizing", "savecustom", "story", "favorite", "feedback", "fullscreen"]}
            height={this.state.height}
            width={this.state.width}
            onClick={this.handleToolbarClick}
          />
        }

        {!this.props.state.loading && this.state.showCustomViewNamePrompt &&
          <ViewNamePrompt
            defaultViewName={(this.tableauReportRef) ? this.tableauReportRef.getActiveSheetName() : "Unkown"}
            onOk={this.saveCustomView}
            onCancel={this.setCustomViewNamePrompt}
          />
        }

        {!this.props.state.loading && this.props.state.report &&
          <TableauReport
            ref={t => this.tableauReportRef = t}
            reportURL={this.props.state.report.SVPVisualizationAddress}  //'https://viz.gallery/views/PHARMACEUTICALSALESPERFORMANCE/PharmaceuticalSalesPerformance?:embed=y' //{'https://viz.gallery/views/PROJECTMANAGEMENTPORTFOLIO/ProjectManagementPortfolio?:embed=y'}
            height={this.state.height}
            width={this.state.width}
          />

          //TODO: render error message (report not exists, "reportId" not in query string, any exception)
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
        return this.setCustomViewNamePrompt(true);
      case "favorite":
        return;
      case "feedback":
        return;
      case "fullscreen":
        return;
    }
  }

  @autobind
  private async saveCustomView(viewName: string) {
    this.setCustomViewNamePrompt(false);
    if (viewName && viewName.length > 0 && this.tableauReportRef)  {
      const viewInfo = await this.tableauReportRef.saveCustomView(viewName);
      console.info('handleSaveCustomView', viewName, viewInfo);
    }
  }

  @autobind
  private setCustomViewNamePrompt(state: boolean) {
    if (this.state.showCustomViewNamePrompt !== state) {
      this.setState({
        showCustomViewNamePrompt: state
      });
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
