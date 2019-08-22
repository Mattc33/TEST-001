import * as React from 'react';
import styles from './ReportMyFavList.module.scss';
import resultTileStyles from '../../../../extensions/dataMarketplaceRenderer/SearchResult/ResultTile.module.scss';

// Components
import { IsFavoriteIconElement, IsNotFavoriteIconElement, IsLikedIconElement, IsNotLikedIconElement, ShareIconElement } from '../../../controls/InteractableBtnDeck/InteractableBtnDeck.index';

// Third Party
import { truncate } from '@microsoft/sp-lodash-subset';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';

// Utils
import { ReportFavoriteType } from "../../../../helpers/UrlHelper";

// Services
import { ReportActionsService } from '../../../../services/ReportActionsService/ReportActionsService';

// Interface
import { IReportFavoriteItem } from '../../../../models/IReportItem'; 
import { IReportMyFavProps, IReportMyFavState, IReportMyFavPageProps, IReportMyFavPageState, IReportMyFavHomeProps, IReportMyFavHomeState } from './ReportMyFavList.interface';

/*
========================================================================================================================
=== Report View for My Favorite's Page
========================================================================================================================
*/
export class ReportMyFavPage extends React.Component<IReportMyFavPageProps, IReportMyFavPageState> {

   private busyElement: JSX.Element = <Spinner size={SpinnerSize.small} />;

   public state = {
      myFavReportItemsinState: [],
      isReportsLoaded: false,
      busyFavoriting: false,
      isFavorite: true,
      busyLiking: false,
      isLiked: false
   };

   public componentDidMount = (): void => {
      this.setFavoriteReportToState();
      console.log(this.props);
   }

   private setFavoriteReportToState = (): void => { 
      const { visualizationTitle, visualizationImage, reportCount } = this.props.props;
      this.props.props.myFavReportService
         .getMyFavoriteReports(visualizationTitle, visualizationImage, reportCount)
         .then((eaResult: Array<IReportFavoriteItem>) => {
            this.setState({ myFavReportItemsinState: eaResult, isReportsLoaded: true });
         });
   }

   private handleRemoveFavorites = (Id: string, SVPVisualizationLookupId: number) => {
      const newFavResults = this.state.myFavReportItemsinState.filter(eaResult => eaResult.Id !== Id);
      this.setState({ myFavReportItemsinState: newFavResults });

      this.props.handleRemoveFavorite(SVPVisualizationLookupId);
   }

   public render = () => (
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

               : this.state.myFavReportItemsinState.map((eaFavReport: IReportFavoriteItem): JSX.Element => {
                  const myFavReportItemTitle: string = truncate(eaFavReport.Title, { 'length': 30, 'separator': ' ' });
                  const myFavReportItemDescription: string = truncate(eaFavReport.SVPVisualizationDescription, { 'length': 100, 'separator': ' ' });
                  console.log(eaFavReport);

                  return (
                     <main className={styles['Report-Favorite-Item']}>
                        <section className={styles['Report-Favorite-Item-Header']}>
                           <div
                              className={styles['Report-Favorite-Item-Title']}
                              onClick={() => this.props.handleClickView(eaFavReport.Id)}
                           >
                              {myFavReportItemTitle}
                           </div>
                           <div className={styles['Report-Favorite-Item-Last-Updated']}>
                              Uploaded {'x'} hours ago
                                 </div>
                        </section>
                        <section className={styles['Report-Favorite-Content']}>

                           <div className={styles['Report-Favorite-Item-Image']}>
                              <img src={eaFavReport.SVPVisualizationImage} alt="VSP Visualization Image"
                                 onClick={() => this.props.handleClickView(eaFavReport.Id)}
                              />
                           </div>

                           <div className={styles['Report-Favorite-Item-Right-Container']}>

                              <aside className={styles['Report-Favorite-Item-Description']}>
                                 {myFavReportItemDescription}
                              </aside>

                              <aside className={styles['Tile-Interactable-Icons-Container']}>
                                 <div className={styles['Tile-Favorite-Icon']}>
                                    <span>
                                       {this.state.busyFavoriting && this.busyElement}
                                       {
                                          !this.state.busyFavoriting && this.state.isFavorite &&
                                          <IsFavoriteIconElement
                                             unfavorite={() => this.handleRemoveFavorites(eaFavReport.Id, eaFavReport.SVPVisualizationLookupId)}
                                             size={'small'}
                                             text={'Favorite'}
                                          />
                                       }
                                    </span>
                                 </div>
                                 <div className={styles['Tile-Share-Icon']}>
                                    <ShareIconElement shareReport={this.props.handleClickShare} />
                                 </div>
                                 <div className={resultTileStyles['Tile-Like-Icon']}>
                                    <div>
                                    {this.state.busyLiking && this.busyElement}
                                    {!this.state.busyLiking && this.state.isLiked &&
                                       <IsLikedIconElement 
                                          removeLike={() => this.props.removeLike(eaFavReport.Id)} 
                                       />
                                    }
                                    {!this.state.busyLiking && !this.state.isLiked &&
                                       <IsNotLikedIconElement 
                                          addLike={() => this.props.addLike(eaFavReport.Id)} 
                                       />
                                    }
                                    </div>
                                 </div>
                              </aside>

                           </div>
                        </section>
                     </main>
                  );
               })
            }
         </div>
      </React.Fragment>
   )
}

/*
========================================================================================================================
=== Report View for Home Page
========================================================================================================================
*/
export class ReportMyFavHome extends React.Component<IReportMyFavHomeProps, IReportMyFavHomeState> {

   public state = {
      myFavReportItemsinState: [],
      isShowAll: false,
      isReportsLoaded: false
   };

   public componentDidMount = (): void => {
      this.setFavoriteReportToState();
      console.log(this.props);
   }

   private setFavoriteReportToState = (): void => {
      const { visualizationTitle, visualizationImage, reportCount } = this.props.props;
      this.props.props.myFavReportService
         .getMyFavoriteReports(visualizationTitle, visualizationImage, reportCount)
         .then((eaResult: Array<IReportFavoriteItem>) => {
            this.setState({ myFavReportItemsinState: eaResult, isReportsLoaded: true });
         });
   }

   public render = () => (
      <main className={styles['Report-Favorite-Home-Container']}>
         <header className={styles['Report-Favorite-Home-Header']}>
            <div className={styles['Report-Favorite-Home-Title']}>
               {'Quick Favorites'}
            </div>
            <div className={styles['Report-Favorite-Home-View-All']}>
               {'view all'}
            </div>
         </header>
         <section className={styles['Report-Favorite-Home-Content']}>
         </section>
      </main>
   )
}

export default class ReportMyFavList extends React.Component<IReportMyFavProps, IReportMyFavState> {

   private actionsService: ReportActionsService;
   
   constructor(props: IReportMyFavProps) {
      super(props);
      this.actionsService = new ReportActionsService();
   }

   private handleClickShare = (e: any) => {
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

   private handleRemoveFavorite = async (SVPVisualizationLookupId: number) => {
      let successItem: any = {};

      try {
         this.actionsService.UnfavoriteReport(this.props.siteUrl, SVPVisualizationLookupId);
         successItem = { isFavorite: false };
      } catch (ex) {
         console.log(`Couldn't unfavorite item ${SVPVisualizationLookupId}.`);
      }
      finally {
         const state = {
            ...this.state, ...successItem, busyFavoriting: false };
         this.setState(state);
      }
   }

   private handleClickView = (Id: string): null => {
      let reportURL = `${this.props.siteUrl}/SitePages/ViewReport.aspx?favReportId=${Id}`;
      window.location.replace(reportURL); 
      return null;
   }

   private addLike = async (Id: string) => {
      this.setState({ busyLiking: true });
      const itemId: number = parseInt(Id);
      const success: boolean = await this.actionsService.AddLike(
         this.props.siteUrl,
         itemId,
         this.props.loggedInUserId
      );

      const state = (success)
         ? { ...this.state, isLiked: true, busyLiking: false }
         : { ...this.state, busyLiking: false };

      this.setState(state);
   }

   private removeLike = async (Id: string) => {
      this.setState({ busyLiking: true });
      let itemId: number = parseInt(Id);
      const success: boolean = await this.actionsService.RemoveLike(
         this.props.siteUrl,
         itemId,
         this.props.loggedInUserId
      );

      const state = (success)
         ? { ...this.state, isLiked: false, busyLiking: false }
         : { ...this.state, busyLiking: false };

      this.setState(state);
   }

   private renderMyFavReports = () => {
      console.log('viewName', this.props.viewName);

      const viewType: string = this.props.viewName;
      let loadThisView;

      switch(viewType) {
         case 'MyFavAllWithImage':
            loadThisView = <ReportMyFavPage 
               props={this.props} 
               handleClickView={this.handleClickView}
               handleRemoveFavorite={(SVPVisualizationLookupId: number) => this.handleRemoveFavorite(SVPVisualizationLookupId)}
               handleClickShare={this.handleClickShare}
               addLike={this.addLike}
               removeLike={this.removeLike}
            />;
            break;
         case '':
            loadThisView = <div>Hi</div>;
            break;
      }

      return loadThisView;
   }

   public render = (): JSX.Element => ( this.renderMyFavReports() );
}



