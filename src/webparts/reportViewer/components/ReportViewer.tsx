import * as React from "react";
import styles from "./ReportViewer.module.scss";

// Third Party
import { WebPartContext } from '@microsoft/sp-webpart-base';

// Components
import { 
   TableauReport, 
   GenericReport,
   Toolbar, 
   IProfileFilter, 
   FavoriteDialog, 
   SaveStatus, 
   ReportDiscussionDialog,
   ReportHeader,
   ReportLearnPanel
 } from "../../controls";
 import { PowerBIReport } from "../../controls/ReportRenderers/PowerBIReport/PowerBIReport";

// Utils
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { Utils } from "../../../services";
import { ConnectByPath } from "../../../base";
import { ReportViewerContext } from "../store/ReportViewerStore";
import { REPORT_VIEWER_PATH } from "../state/IReportViewerState";

// Interface
import { IReportViewer } from "../state/IReportViewerState";
import { IReportItem, IReportParameters, ITableauReportViewerConfig } from "../../../models";


// require("./ReportViewer.SPFix.css");
// const FieldNameMapping = "{'metadata':[{'displayLabel':'Business Unit','internalName':'SVPBusinessUnit'},{'displayLabel':'Department','internalName':'SVPDepartment'},{'displayLabel':'Purpose','internalName':'SVPMetadata1'},{'displayLabel':'Process','internalName':'SVPMetadata2'},{'displayLabel':'Area','internalName':'SVPMetadata3'},{'displayLabel':'Role','internalName':'SVPMetadata4'}]}";

export interface IReportViewerProps {
  description: string;
  context: WebPartContext;
  state: IReportViewer;
}

export interface IReportViewerState {
  showSaveFavoriteDialog: boolean;
  showReportDiscussionDialog: boolean;
  showReportLearnDialog: boolean;
}

export interface IReportInfo {
  internalName: string;
  displayLabel: string;
  value: string;
}

export class ReportViewer extends React.Component<IReportViewerProps, IReportViewerState> {
  private tableauReportRef: TableauReport;
  private initFavriteDialog: boolean;
  private powerbiReport:PowerBIReport;

  constructor(props: IReportViewerProps) {
    super(props);

    this.initFavriteDialog = false;

    this.state = {  
      showSaveFavoriteDialog: false,
      showReportDiscussionDialog: false,
      showReportLearnDialog: false
    };
  }

  public componentDidMount() {
    const reportId = Utils.getParameterByName("reportId");
    const favReportId = Utils.getParameterByName("favReportId");

    const viewerProps = this.props.state;

    const viz = document.getElementById('VizContainer');
    const width = (viz) ? viz.clientWidth : 900;

    const pageTitleEl = document.querySelector("div[class^='pageTitle_']") as HTMLElement;
    if (pageTitleEl) {
      pageTitleEl.style.display = "none";
    }

    const controlZoneEl = document.querySelector(".ControlZone") as HTMLElement;
    if (controlZoneEl) {
      controlZoneEl.style.marginTop = "0";
    }

    viewerProps.actions.loadReportData(reportId, favReportId, 700, width);
  }

  public render(): React.ReactElement<IReportViewerProps> {
    const saveState: SaveStatus = this.getSaveStatus();

    let getReportMetaDataAsString: string;

    if(this.props.state.report!=null){
      const reportObj = this.props.state.report;
      const SVPMetadata = this.props.state.SVPMetadata;

      if (SVPMetadata !== undefined && typeof SVPMetadata === 'string') {
         getReportMetaDataAsString = this.getReportMetaDataAsString(this.props.state.SVPMetadata, reportObj);
         console.log(getReportMetaDataAsString);
      }
    }

    return (
      <div className={styles.reportViewer}>
        <div id="VizContainer" className={styles.container}>
          {this.props.state.loading && <div>Loading....</div>}

          {!this.props.state.loading && this.props.state.report &&
            <ReportHeader 
              title={this.props.state.report.Title}
              lastModified={this.props.state.report.ModifiedFormatted}
              metadata={getReportMetaDataAsString}
              //segment={this.props.state.report.SVPMetadata1} 
              //function={this.props.state.report.SVPMetadata2}
              //frequency={this.props.state.report.SVPMetadata3}
              likeCount={this.props.state.report.ReportAnalytics.LikeCount.toString()}
              viewCount={this.props.state.report.ReportAnalytics.ViewCount.toString()}
              />
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
              score = {this.props.state.sentimentScore}
            />
          }

          { // ReportCommentDialog Component and controlling state
            !this.props.state.loading && this.state.showReportLearnDialog &&
            <ReportLearnPanel
               richTextReport={this.props.state.report.SVPVisualizationLearning}
               onCancel={() => this.setReportLearnDialog(false)}
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

    console.log("SVPVisualizationTechnology: ", report.SVPVisualizationTechnology);
    switch(report.SVPVisualizationTechnology) {
      case "Tableau":
        reportComponent = <TableauReport
                            ref={t => this.tableauReportRef = t}
                            reportURL={report.SVPVisualizationAddress}  //'https://viz.gallery/views/PHARMACEUTICALSALESPERFORMANCE/PharmaceuticalSalesPerformance?:embed=y' //{'https://viz.gallery/views/PROJECTMANAGEMENTPORTFOLIO/ProjectManagementPortfolio?:embed=y'}
                            height={this.props.state.reportHeight}
                            width={this.props.state.reportWidth}
                          />;
        break;               

      case "Power BI":
        reportComponent = <PowerBIReport
                            ref={t=> this.powerbiReport = t}
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
      case "learn":
        this.handleReportLearn();
        break;
    }
  }

  @autobind
  private handleReportDiscussion() { // method that handles comment drawer
    const report = this.props.state.report;
    console.log('handleReportDiscussion()');
    if (report) {
      this.props.state.actions.loadReportDiscussion(report.Id, report.Title, this.props.state.useSentimentService, this.props.state.sentimentServiceAPIKey, this.props.state.sentimentServiceAPIUrl);
      this.setReportDiscussionDialog(true);
    }
  }

  private handleReportLearn = (): void => { // method that handles learn button drawer
    const report = this.props.state.report;
    console.log('handleReportLearn() is firing');
    if (report) {
      console.log(report.SVPVisualizationLearning);
      //this.props.state.actions.loadReportDiscussion(report.Id, report.Title, this.props.state.useSentimentService, this.props.state.sentimentServiceAPIKey, this.props.state.sentimentServiceAPIUrl);
      this.setReportLearnDialog(true);
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
        undefined // (no need to create view in Tableau) (report.SVPVisualizationTechnology === "Tableau") ? this.tableauReportRef : undefined
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
  private setReportDiscussionDialog(state: boolean) { // sets the state of comment drawer on/off
    if (this.state.showReportDiscussionDialog !== state) {
      this.setState({
        showReportDiscussionDialog: state
      });
    }
  }

   private setReportLearnDialog = (state: boolean): void => { // sets the state of learn drawer on/off
      if(this.state.showReportLearnDialog !== state) { // if opposite of current state do...
         this.setState({showReportLearnDialog: state})
      }
   }

  @autobind
  private getReportMetadata(reportInfo: IReportItem, sortProp: string|string[]): Array<IReportInfo> {
    //const isSortPropArray = _.isArray(sortProp);

    const isSortPropArray=null;
    return Object.keys(this.props.state.report).filter((propName: string) => {
      return (reportInfo[propName] && reportInfo[propName].displayLabel) 
        ? propName
        : null;
      }).map((propName: string): IReportInfo => {
        return reportInfo[propName];
      }).sort((a: IReportInfo, b: IReportInfo): number => {
        if (isSortPropArray) {
          const sortFlds = sortProp as string[];
          return sortFlds.indexOf(a.internalName) - sortFlds.indexOf(b.internalName);
        }
        else {
          const sortFld = sortProp as string;
          return ((a[sortFld] > b[sortFld]) ? 1 : ((b[sortFld] > a[sortFld]) ? -1 : 0));
        }
      });
  }

  // @autobind 
   private getReportMetaDataAsString = (fieldNameMapping: string, reportObj: IReportItem): string => {
      /* 
         As an alternative to @autobind decorator
         you can correct the context of `this` in javascript class methods with an es6 arrow function
      */
      const fieldNameMappingObj = JSON.parse(fieldNameMapping); // remap incoming string as json

      const remapObj = fieldNameMappingObj.metadata
         .map( eaMetaData => {
            const temp = {...eaMetaData};

            if (reportObj[eaMetaData.internalName] !== undefined) {
               temp.displayValue = reportObj[eaMetaData.internalName];
               return temp;
            } else {
               // warn if a internal name does not have a mapping to the data obj
               console.log(`${eaMetaData.internalName} does not map to anything in`);
               console.log(JSON.stringify(reportObj));
            }
         })
         .filter(eaMetaData => eaMetaData !== undefined);
   
      const constructAsString = remapObj
         .map( (eaMetaData, index: number) => {
            if(index === 0) {
               return ` ${eaMetaData.displayLabel}: ${eaMetaData.displayValue} | `;
            }
            else if (index === remapObj.length - 1) {
               return `${eaMetaData.displayLabel}: ${eaMetaData.displayValue}`;
            }
            return `${eaMetaData.displayLabel}: ${eaMetaData.displayValue} |`;
         })
         .join(' ');
   
      return constructAsString;

      //return '';
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
