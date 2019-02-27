import * as React from 'react';
import styles from './ReportMyFavList.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { IReportBasicItem } from "../../../models/IReportItem";
import { autobind } from '@uifabric/utilities/lib';
import MyFavHome from "./MyFavHome";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';


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
  private renderMyFavReports(favReports: Array<IReportBasicItem>): Array<JSX.Element> {
    if (favReports && favReports.length > 0) {
      return favReports.map((report: IReportBasicItem) => {
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
  }

  @autobind 
  private handleClickShare(e:any) {
    console.log("Report: ", e);
    alert("Shared Clicked !!!");
  }

  @autobind 
  private handleClickView(favReportId:string) {
    
    window.location.replace("https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/SitePages/ViewReport.aspx?reportId=" + favReportId); 
    return null;

  }

}
