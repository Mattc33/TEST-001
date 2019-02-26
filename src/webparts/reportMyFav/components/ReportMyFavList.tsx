import * as React from 'react';
import styles from './ReportMyFavList.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { IReportBasicItem } from "../../../models/IReportItem";
import { autobind } from '@uifabric/utilities/lib';
import MyFavHome from "./MyFavHome";

export interface IReportMyFavProps {
  controlHeaderMessage: string;
  myFavReportService: any;
}

export interface IReportMyFavState {
  myFavReportItemsinState: IReportBasicItem[];
  isReportsLoaded: Boolean;
}

export default class ReportMyFavList extends React.Component<IReportMyFavProps, IReportMyFavState> {

  constructor(props: IReportMyFavProps) {
    super(props);
    this.state = { myFavReportItemsinState: [], isReportsLoaded: false};


  }

  public componentDidMount(): void { 
    this.props.myFavReportService.getAllFeaturedReports().then((result: Array<IReportBasicItem>) => {

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
            { this.renderMyFavReports(this.state.myFavReportItemsinState) }
        </div>
      </div>
    );
  }


  @autobind
  private renderMyFavReports(favReports: Array<IReportBasicItem>): Array<JSX.Element> {
    if (favReports && favReports.length > 0) {
      return favReports.map((report: IReportBasicItem) => {
        return (
          <MyFavHome reportItem ={report} key={report.Id} onView={this.handleClickView}/>
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

  private handleClickView(favReportId:string) {
    console.log("Report ID: ", favReportId);

    const favReportViewUrl = "https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/SitePages/ViewReport.aspx?reportId=1";
    //return () => window.location.assign(favReportViewUrl);
    window.location.hash = favReportViewUrl;
  }

}
