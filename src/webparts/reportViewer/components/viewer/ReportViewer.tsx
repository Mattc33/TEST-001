import * as React from "react";
import styles from "./ReportViewer.module.scss";
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import { REPORT_VIEWER_PATH } from "../../state/IReportViewerState";
import { ConnectByPath } from "../../../../base";
import { ReportViewerContext } from "../../store/ReportViewerStore";
import { Toolbar } from "../toolbar/Toolbar";
import { ViewNamePrompt } from "../toolbar/ViewNamePrompt";
import { TableauReport } from "../tableauReport/TableauReport";
import { IReportViewer } from "../../state/IReportViewerState";
import { FavoriteDialog, IFavoriteDialogProps, SaveStatus } from '../../../controls/Favorite/FavoriteDialog';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { Utils } from "../../../../utils/utils";

export interface IReportViewerProps {
  description: string;
  context: WebPartContext;
  state: IReportViewer;
}

export interface IReportViewerState {
  height?: number;
  width?: number;
  showSaveFavoriteDialog: boolean;
}

export class ReportViewer extends React.Component<IReportViewerProps, IReportViewerState> {
  private tableauReportRef: TableauReport;
  private customViewNameRef: HTMLInputElement;
  private initFavriteDialog: boolean;

  constructor(props: IReportViewerProps) {
    super(props);

    this.initFavriteDialog = false;

    this.state = {
      height: (props.state.report) ? props.state.report.SVPHeight || 704 : 704,
      width: (props.state.report) ? props.state.report.SVPWidth || 799 : 799,
      showSaveFavoriteDialog: false
    };
  }

  public componentDidMount() {
    const reportId = Utils.getParameterByName("reportId");
    const viewerProps = this.props.state;

    viewerProps.actions.loadReportData(reportId);
  }

  public render(): React.ReactElement<IReportViewerProps> {
    let saveState: SaveStatus = this.getSaveStatus();

    return (
      <div className={styles.reportViewer}>
        {this.props.state.loading && <div>Loading....</div>}

        {!this.props.state.loading && 
          <Toolbar 
            types={["sizing", "savecustom", "feedback", "profilefilter", "fullscreen"]}
            height={this.state.height}
            width={this.state.width}
            onClick={this.handleToolbarClick}
          />
        }

        {!this.props.state.loading && this.state.showSaveFavoriteDialog &&
          <FavoriteDialog
            saveState={saveState}
            title={this.props.state.report.Title}
            description={this.props.state.report.SVPVisualizationDescription}
            onSave={this.handleSaveFavorite}
            onCancel={this.handleCancelFavorite}
          />
        }

        {!this.props.state.loading && this.props.state.report &&
          <TableauReport
            ref={t => this.tableauReportRef = t}
            reportURL={this.props.state.report.SVPVisualizationAddress}  //'https://viz.gallery/views/PHARMACEUTICALSALESPERFORMANCE/PharmaceuticalSalesPerformance?:embed=y' //{'https://viz.gallery/views/PROJECTMANAGEMENTPORTFOLIO/ProjectManagementPortfolio?:embed=y'}
            height={this.state.height}
            width={this.state.width}
          />
        }

        {!this.props.state.loading && this.props.state.error &&
          <div>
            Error occured loading report: {this.props.state.error.errorMessage}
          </div>
        }
      </div>
    );
  }

  @autobind
  private getSaveStatus(): SaveStatus {
    let saveState: SaveStatus = SaveStatus.None;

    if (this.state.showSaveFavoriteDialog) {
      saveState = SaveStatus.None;
      if (this.initFavriteDialog) 
        this.initFavriteDialog = false;
      else if (this.props.state.savingAsFavorite)
        saveState = SaveStatus.SaveInProgress;
      else if (!this.props.state.savingAsFavorite && !this.props.state.error)
        saveState = SaveStatus.SaveSuccess;
      else if (!this.props.state.savingAsFavorite && this.props.state.error)
        saveState = SaveStatus.SaveError;
    }

    return saveState;
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
        this.initFavriteDialog = true;
        return this.setSaveFavoriteDialog(true);
      case "favorite":
        return;
      case "feedback":
        return;
      case "fullscreen":
        return;
    }
  }

  @autobind
  private async handleSaveFavorite(viewName: string, viewDescription: string) {
    if (viewName && viewName.length > 0 && this.tableauReportRef)  {
      const reportId = Utils.getParameterByName("reportId");

      const viewInfo = await this.tableauReportRef.saveCustomView(viewName);
      await this.props.state.actions.saveReportAsFavorite(Number.parseInt(reportId), viewName, viewDescription, viewInfo.url);
    }
  }

  @autobind
  private handleCancelFavorite() {
    this.setSaveFavoriteDialog(false);
  }

  @autobind
  private setSaveFavoriteDialog(state: boolean) {
    if (this.state.showSaveFavoriteDialog !== state) {
      this.setState({
        showSaveFavoriteDialog: state
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
