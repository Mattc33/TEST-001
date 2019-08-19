import * as React from 'react';
import styles from './ReportMyFavList.module.scss';

// Components
// import MyFavHome from "../MyFavHome";
// import MyFavAllWithImage from "../MyFavAllWithImage";

// Third Party
// import { escape } from '@microsoft/sp-lodash-subset';
import { truncate } from '@microsoft/sp-lodash-subset';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
// import { WebPartContext } from '@microsoft/sp-webpart-base';

// Utils
import { ReportFavoriteType } from "../../../../helpers/UrlHelper";

// Interface
import { IReportFavoriteItem } from '../../../../models/IReportItem'; 
import { IReportMyFavProps, IReportMyFavState } from './ReportMyFavList.interface';

/*
   My Favorites Page
*/

export default class ReportMyFavList extends React.Component<IReportMyFavProps, IReportMyFavState> {

   public state: IReportMyFavState = {
      myFavReportItemsinState: [],
      isReportsLoaded: false
   };

   public componentDidMount = (): void => {
      this.setFavoriteReportToState();
      console.log('log props', this.props);
   }

   private setFavoriteReportToState = (): void => { // fetch favorite reports and add to component state
      // we should check if the array is not empty up here rather than in the component
      const {visualizationTitle, visualizationImage, reportCount} = this.props;
      this.props.myFavReportService
         .getMyFavoriteReports(visualizationTitle, visualizationImage, reportCount)
            .then( (eaResult: Array<IReportFavoriteItem>) => {
               console.log(eaResult);
               this.setState({ myFavReportItemsinState: eaResult, isReportsLoaded: true});
            });
   }

   private handleCLickShare = (e: any) => {
      let reportTitle = e.SVPVisualizationLookupTitle;
      const reportURL = `Report URL: ${this.props.siteUrl}/SitePages/ViewReport.aspx?favReportId=${e.Id}`;

      if (e.SVPFavoriteType !== ReportFavoriteType.Original) {
         reportTitle = e.Title;
      }
   
      const personName = this.props.loggedInUserName;
      const subject = `${personName} shared a report: ${reportTitle}`;
      window.location.href = 
         `mailto:?subject="${subject}&body=%0d%0a%0d%0a${reportURL} %0d%0a%0d%0a${e.SVPVisualizationDescription}`;
   }

   private handleClickDelete = (e: any) => {
      let newFavResults = this.state.myFavReportItemsinState.filter(item => item !== e);
      this.setState({myFavReportItemsinState: newFavResults});

      //TODO : Call Real API to Remove the Item from List.
      this.props.reportActionService.UnfavoriteReport(this.props.siteUrl, e.SVPVisualizationLookupId);
   }

   private handleClickView = (e: any) => {
      let reportURL = `${this.props.siteUrl}/SitePages/ViewReport.aspx?favReportId=${e.Id}`;
      window.location.replace(reportURL); 
      return null;
   }

   public render = (): JSX.Element => {

      const myFavReportItemsinState = this.state.myFavReportItemsinState;

      return (
         <React.Fragment>
         <header className={styles['Report-Favorite-Header']}>
            <div className={styles['Report-Favorite-Header-Title']}>
               My Favorites
            </div>
            <div className={styles['Report-Favorite-Header-Sub-Title']}>
               Click on the Favorite icon to remove an item from your saved favorites.
            </div>
         </header>
         <div className={styles['Report-Favorite-Container']}>
            {
               (!this.state.isReportsLoaded) // Handling loading of reports
                  ? <Spinner size={SpinnerSize.large} label="Wait, Pulling Reports..." ariaLive="assertive" />
                  : myFavReportItemsinState.map((eaFavReport: IReportFavoriteItem): JSX.Element => {
                     console.log(eaFavReport);
                     const myFavReportItemTitle: string = truncate(eaFavReport.Title, {'length': 45, 'separator': ' '});
                     return (
                        <main className={styles['Report-Favorite-Item']}>
                           <section className={styles['Report-Favorite-Item-Title']}>
                              {myFavReportItemTitle}
                           </section>
                           <section className={styles['Report-Favorite-Content']}>
                              <div className={styles['Report-Favorite-Item-Image']}>
                                 <img src={eaFavReport.SVPVisualizationImage} alt="VSP Visualization Image"/>
                              </div>
                              <div className={styles['Report-Favorite-Item-Right-Container']}>
                                 <div className={styles['Report-Favorite-Item-Last-Updated']}>
                                    Uploaded {'x'} hours ago 
                                 </div>
                                 <div className={styles['Report-Favorite-Item-Description']}>
                                    {eaFavReport.SVPVisualizationDescription}
                                 </div>
                                 <div className={styles['Report-Favorite-Item-Interactables']}>
                                    {
                                       // import Interactable Deck here
                                    }
                                 </div>
                              </div>
                           </section>
                        </main>
                     );
                  })
            }
         </div>
         </React.Fragment>
      );
   }




//   public render(): React.ReactElement<IReportMyFavProps> {
//     const style = (this.props.viewName !== "MyFavAllWithImage")
//       ? `${styles.reportMyFavList} ${styles.homePage}`
//       : `${styles.reportMyFavList}`;

//     return (
//       <div className={styles.container}>
//         <div className={style}>
//             <div className={"row " + styles.rowHeader}>
//               <div className="col-md-12">
//                 <div dangerouslySetInnerHTML={{ __html: this.props.controlHeaderMessage }} />
//               </div>
//             </div>
//             {this.state.isReportsLoaded
//             ? this.renderMyFavReports(this.state.myFavReportItemsinState)
//             :
//              ( <div className="row">
//                 <div className="col-md-12"><Spinner size={SpinnerSize.large} label="Wait, Pulling Reports..." ariaLive="assertive" /></div>
//               </div>
//              )
//             }
            
//         </div>
//       </div>
//     );
//   }


//   @autobind
//   private renderMyFavReports(favReports: Array<IReportFavoriteItem>): Array<JSX.Element> {
//     console.log("favReports: ", favReports);
//     console.log("ViewName: ",this.props.viewName);
//     if (favReports && favReports.length > 0) {
//       if(this.props.viewName == "MyFavAllWithImage") {
//         return favReports.map((report: IReportFavoriteItem) => {
//           return (
//             <MyFavAllWithImage reportItem ={report} key={report.Id} siteURL = {this.props.siteUrl} onView={this.handleClickView} 
//             onShare={this.handleClickShare} onRemove={this.handleClickDelete}/>
//           );
//         });
//       }
//       else
//       {
//         return favReports.map((report: IReportFavoriteItem) => {
//           return (
//             <MyFavHome reportItem ={report} key={report.Id} siteURL = {this.props.siteUrl} onView={this.handleClickView} 
//             onShare={this.handleClickShare} onRemove={this.handleClickDelete}/>
//           );
//         });
//       }
//     }
//     else {
//       return ([
//         <div className={styles.label}>
//           No favorite reports found.
//         </div>
//       ]);
//     }
//   }

//   @autobind 
//   private handleClickDelete(e:any) {
//     console.log("Report: ", e);
    
//     let newFavResults = this.state.myFavReportItemsinState.filter(item => item !== e);
//     this.setState({myFavReportItemsinState: newFavResults});

//     //TODO : Call Real API to Remvoe the Item from List.
//     this.props.reportActionService.UnfavoriteReport(this.props.siteUrl, e.SVPVisualizationLookupId);

//   }

//   @autobind 
//   private handleClickShare(e:any) {
//     //alert("Clicked Share. Report Name: " + e.Title);
//     let reportTitle = e.SVPVisualizationLookupTitle;
//     //let reportURL = "Report URL: " + this.props.siteUrl + "/SitePages/ViewReport.aspx?reportId=" + e.SVPVisualizationLookupId;
//     const reportURL = "Report URL: " + this.props.siteUrl + "/SitePages/ViewReport.aspx?favReportId=" + e.Id;

//     if(e.SVPFavoriteType != ReportFavoriteType.Original) {
//       reportTitle = e.Title;
//       //reportURL = "Report URL: " + this.props.siteUrl + "/SitePages/ViewReport.aspx?favReportId=" + e.Id;
//     }

//     const personName = this.props.loggedInUserName;
//     const subject = personName + " shared a report: " + reportTitle;
//     window.location.href = "mailto:?subject="+subject+"&body=%0d%0a%0d%0a" + reportURL + " %0d%0a%0d%0a" + e.SVPVisualizationDescription;

//   }

//   @autobind 
//   private handleClickView(e:any) {
//     let reportURL = this.props.siteUrl + "/SitePages/ViewReport.aspx?favReportId=" + e.Id;

//     window.location.replace(reportURL); 
//     return null;

//   }

}
