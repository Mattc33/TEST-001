import * as React from 'react';
import styles from './ReportMyFavList.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { IReportFavoriteItem } from "../../../models/IReportItem";
import { autobind } from '@uifabric/utilities/lib';
import MyFavHome from "./MyFavHome";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ReportFavoriteType } from "../../../helpers/UrlHelper";



export interface IReportMyFavProps {
  controlHeaderMessage: string;
  siteUrl: string;
  loggedInUserName: string;

  myFavReportService: any;
  reportActionService:any;

  reportCount: number;
  visualizationTitle:string;
  visualizationImage:string;

}

export interface IReportMyFavState {
  myFavReportItemsinState: IReportFavoriteItem[];
  isReportsLoaded: Boolean;
}

export default class ReportMyFavList extends React.Component<IReportMyFavProps, IReportMyFavState> {
  
  constructor(props: IReportMyFavProps) {
    super(props);
    this.state = { myFavReportItemsinState: [], isReportsLoaded: false};

  }

  public componentDidMount(): void { 
    
    this.props.myFavReportService.getMyFavoriteReports("Visualization_x0020_Lookup_x003A","Visualization_x0020_Lookup_x003A0",100).then((result: Array<IReportFavoriteItem>) => {

      this.setState({ myFavReportItemsinState: result, isReportsLoaded: true});
      
    });

}

  public render(): React.ReactElement<IReportMyFavProps> {

    return (
      <div className={styles.container}>
        <div className={styles.reportMyFavList}>
            <div className={"row " + styles.rowHeader}>
              <div className="col-md-6">
              {this.props.controlHeaderMessage}
              </div>
            </div>
            {this.state.isReportsLoaded
            ? this.renderMyFavReports(this.state.myFavReportItemsinState)
            :
             ( <div className="row">
                <div className="col-xs-12"><Spinner size={SpinnerSize.large} label="Wait, Pulling Reports..." ariaLive="assertive" /></div>
              </div>
             )
            }
            
        </div>
      </div>
    );
  }


  @autobind
  private renderMyFavReports(favReports: Array<IReportFavoriteItem>): Array<JSX.Element> {
    console.log("favReports: ", favReports);
    if (favReports && favReports.length > 0) {
      return favReports.map((report: IReportFavoriteItem) => {
        return (
          <MyFavHome reportItem ={report} key={report.Id} onView={this.handleClickView} 
          onShare={this.handleClickShare} onRemove={this.handleClickDelete}/>
        );
      });
    }
    else {
      return ([
        <div className={styles.label}>
          No favorite reports found.
        </div>
      ]);
    }
  }

  @autobind 
  private handleClickDelete(e:any) {
    console.log("Report: ", e);
    
    let newFavResults = this.state.myFavReportItemsinState.filter(item => item !== e);
    this.setState({myFavReportItemsinState: newFavResults});

    //TODO : Call Real API to Remvoe the Item from List.
    this.props.reportActionService.UnfavoriteReport(this.props.siteUrl, e.SVPVisualizationLookupId);

  }

  @autobind 
  private handleClickShare(e:any) {
    console.log("Report: ", e);
    //alert("Clicked Share. Report Name: " + e.Title);
    let reportTitle = e.SVPVisualizationLookupTitle;
    let reportURL = "Report URL: " + this.props.siteUrl + "/SitePages/ViewReport.aspx?reportId=" + e.SVPVisualizationLookupId;

    if(e.SVPFavoriteType != ReportFavoriteType.Original) {
      reportTitle = e.Title;
      reportURL = "Report URL: " + this.props.siteUrl + "/SitePages/FavReport.aspx?favReportId=" + e.Id;
    }

    const personName = this.props.loggedInUserName;
    const subject = personName + " shared a report: " + reportTitle;
    window.location.href = "mailto:?subject="+subject+"&body=%0d%0a%0d%0a" + reportURL + " %0d%0a%0d%0a" + e.SVPVisualizationDescription;

  }

  @autobind 
  private handleClickView(e:any) {
    let reportURL = "Report URL: " + this.props.siteUrl + "/SitePages/ViewReport.aspx?reportId=" + e.SVPVisualizationLookupId;

    if(e.SVPFavoriteType != ReportFavoriteType.Original) {
      reportURL = "Report URL: " + this.props.siteUrl + "/SitePages/FavReport.aspx?favReportId=" + e.Id;
    }
    window.location.replace(reportURL); 
    return null;

  }

}
