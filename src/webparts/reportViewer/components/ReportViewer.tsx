import * as React from "react";
import styles from "./ReportViewer.module.scss";
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import { REPORT_VIEWER_PATH } from "../state/IReportViewerState";
import { ConnectByPath } from "../../../base";
import { ReportViewerContext } from "../store/ReportViewerStore";
import { 
  TableauReport, 
  GenericReport,
  Toolbar, 
  IProfileFilter, 
  FavoriteDialog, 
  SaveStatus, 
  ReportDiscussionDialog,
  ReportHeader
} from "../../controls";
import { IReportViewer } from "../state/IReportViewerState";
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { Utils } from "../../../services";
import { IReportItem, IReportParameters, ITableauReportViewerConfig } from "../../../models";

require("./ReportViewer.SPFix.css");

export interface IReportViewerProps {
  description: string;
  context: WebPartContext;
  state: IReportViewer;
}

export interface IReportViewerState {
  // height?: number;
  // width?: number;
  showSaveFavoriteDialog: boolean;
  showReportDiscussionDialog: boolean;
}

export class ReportViewer extends React.Component<IReportViewerProps, IReportViewerState> {
  private tableauReportRef: TableauReport;
  private initFavriteDialog: boolean;

  constructor(props: IReportViewerProps) {
    super(props);

    this.initFavriteDialog = false;

    this.state = {  
      showSaveFavoriteDialog: false,
      showReportDiscussionDialog: false
    };
  }

  // public static getDerivedStateFromProps(props: IReportViewerProps, state: IReportViewerState) {
  //   if  (props.state.report &&
  //         (props.state.report.SVPReportHeight !== state.height || 
  //          props.state.report.SVPReportWidth !== state.width)
  //       )
  //   {
  //     state.height = props.state.report.SVPReportHeight;
  //     state.width = props.state.report.SVPReportWidth;
  //     return state;
  //   }
    
  //   return null;
  // }

  public componentDidMount() {
    const reportId = Utils.getParameterByName("reportId");
    const favReportId = Utils.getParameterByName("favReportId");

    const viewerProps = this.props.state;

    const viz = document.getElementById('VizContainer');
    const width = (viz) ? viz.clientWidth : 900;

    viewerProps.actions.loadReportData(reportId, favReportId, 700, width);
  }

  public render(): React.ReactElement<IReportViewerProps> {
    const saveState: SaveStatus = this.getSaveStatus();

    return (
      <div className={styles.reportViewer}>
        <div id="VizContainer" className={styles.container}>
          {this.props.state.loading && <div>Loading....</div>}

          {!this.props.state.loading && this.props.state.report &&
            <ReportHeader 
              title={this.props.state.report.Title}
              lastModified={this.props.state.report.ModifiedFormatted}
              segment={this.props.state.report.SVPMetadata1} 
              function={this.props.state.report.SVPMetadata2}
              frequency={this.props.state.report.SVPMetadata3}/>
          }

          {!this.props.state.loading && this.props.state.report &&
            <Toolbar 
              context={this.props.state.context}
              report={this.props.state.report}
              reportType={this.props.state.report.SVPVisualizationTechnology}
              types={Utils.getToolbar(this.props.state)}
              height={this.props.state.reportHeight}
              width={this.props.state.reportWidth}
              profileFilters={this.getProfileFilter()}
              isFavorite={this.props.state.isFavorite}
              onClick={this.handleToolbarClick}
            />
          }

          {!this.props.state.loading && this.state.showSaveFavoriteDialog &&
            <FavoriteDialog
              saveState={saveState}
              title={this.props.state.report.Title}
              description={this.props.state.report.SVPVisualizationDescription}
              onSave={this.handleSaveFavorite}
              onCancel={() => this.setSaveFavoriteDialog(false)}
            />
          }

          {!this.props.state.loading && this.props.state.discussionInitialized && this.state.showReportDiscussionDialog &&
            <ReportDiscussionDialog
              discussion={this.props.state.discussion}
              action={this.props.state.actions}
              onCancel={() => this.setReportDiscussionDialog(false)}
            />
          }

          {!this.props.state.loading && this.props.state.report &&
            this.getReportComponent()
          }

          {!this.props.state.loading && this.props.state.error &&
            <div>
              Error occured loading report: {this.props.state.error.errorMessage}
            </div>
          }
        </div>
      </div>
    );
  }

  @autobind
  private getReportComponent() {
    const report = this.props.state.report;
    let reportComponent: JSX.Element = null;

    switch(report.SVPVisualizationTechnology) {
      case "Tableau":
        reportComponent = <TableauReport
                            ref={t => this.tableauReportRef = t}
                            reportURL={report.SVPVisualizationAddress}  //'https://viz.gallery/views/PHARMACEUTICALSALESPERFORMANCE/PharmaceuticalSalesPerformance?:embed=y' //{'https://viz.gallery/views/PROJECTMANAGEMENTPORTFOLIO/ProjectManagementPortfolio?:embed=y'}
                            height={this.props.state.reportHeight}
                            width={this.props.state.reportWidth}
                          />;
        break;               

      default:
        reportComponent = <GenericReport
                            report={report}  
                            height={this.props.state.reportHeight}
                            width={this.props.state.reportWidth}
                          />;
        break;
    }

    return reportComponent;
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
  private getProfileFilter(): Array<IProfileFilter> {
    let profileFilters: Array<IProfileFilter> = [];

    if (this.props.state.loading || 
        !this.props.state.report || 
        !this.props.state.userProfile ||
        !this.props.state.report.SVPVisualizationParameters ||
        this.props.state.report.SVPVisualizationParameters.length === 0) 
    {
      return profileFilters;
    }

    return this.props.state.report.SVPVisualizationParameters.map((p: IReportParameters): IProfileFilter => {
      const value = this.props.state.userProfile[p.SVPParameterValue];

      return {
        filterName: p.SVPParameterName,
        filterValue: value,
        disabled: (value) ? false : true,
        selected: false
      };
    });
  }

  @autobind
  private handleToolbarClick(type: string, args?: any) {
    switch(type) {
      case "sizing":
        const { height, width } = args;
        this.props.state.actions.resizeComponent(height, width);
        break;
      case "story":
        break;
      case "savecustom":
        this.initFavriteDialog = true;
        this.setSaveFavoriteDialog(true);
        break;
      case "favorite":
        break;
      case "fullscreen":
        break;
      case "comment":
        this.handleReportDiscussion();
        break;
    }
  }

  @autobind
  private handleReportDiscussion() {
    const report = this.props.state.report;
    if (report) {
      this.props.state.actions.loadReportDiscussion(report.Id, report.Title);
      this.setReportDiscussionDialog(true);
    }
  }

  @autobind
  private async handleSaveFavorite(viewName: string, viewDescription: string) {
    const reportIdStr = Utils.getParameterByName("reportId");
    const report = this.props.state.report;

    if (viewName && viewName.length > 0) {
      let title = viewName;
      let desc = viewDescription;
      let url = report.SVPVisualizationAddress;
      
      // if (report.SVPVisualizationTechnology === "Tableau" && this.tableauReportRef) {
      //   const viewInfo = await this.tableauReportRef.saveCustomView(viewName);
      //   url = viewInfo.url;
      // }

      //in case of favorite report, reportIdStr would be null
      const reportId = (reportIdStr) ? Number.parseInt(reportIdStr) : report.Id;

      await this.props.state.actions.saveReportAsFavorite(
        reportId,
        title,
        desc,
        url,
        (report.SVPVisualizationTechnology === "Tableau") ? this.tableauReportRef : undefined
      );
    }
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
  private setReportDiscussionDialog(state: boolean) {
    if (this.state.showReportDiscussionDialog !== state) {
      this.setState({
        showReportDiscussionDialog: state
      });
    }
  }

  // @autobind
  // private imageTest() {

  //   var image = this.imageRef;
  //   var downloadingImage = new Image();
  //   downloadingImage.onload = function(){
  //     image.src = (this as any).src;   
  //   };
  //   downloadingImage.src = "https://viz.gallery/views/PHARMACEUTICALSALESPERFORMANCE/PharmaceuticalSalesPerformance/javeda@slalom.com/PharmaceuticalSalesPerformance10015M.png";
  // }
}

const ReportViewerWithState = ConnectByPath(
  ReportViewerContext,
  ReportViewer,
  REPORT_VIEWER_PATH
);
export { ReportViewerWithState };
