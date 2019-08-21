import { IReportFavoriteItem } from '../../../../models/IReportItem';

export interface IReportMyFavProps {

   SVPVisualizationImage: string;

   controlHeaderMessage: string;
   siteUrl: string;
   loggedInUserName: string;
   loggedInUserId:number;
   viewName:string;
   myFavReportService: any;
   reportActionService:any;
   reportCount: number;
   visualizationTitle:string;
   visualizationImage:string;

}
 
export interface IReportMyFavState {

   myFavReportItemsinState: IReportFavoriteItem[];
   isReportsLoaded: boolean;
   busyFavoriting: boolean;
   isFavorite: boolean;
   busyLiking: boolean;
   isLiked: boolean;

}

export interface IReportMyFavPageProps {

   props: any;
   handleClickView: any;
   handleRemoveFavorite: any;
   handleClickShare: any;
   removeLike: any;
   addLike: any;

}

export interface IReportMyFavPageState {

   myFavReportItemsinState: IReportFavoriteItem[];
   isReportsLoaded: boolean;
   busyFavoriting: boolean;
   isFavorite: boolean;
   busyLiking: boolean;
   isLiked: boolean;

}

export interface IReportMyFavHomeProps {

   props: any;

}

export interface IReportMyFavHomeState {

   myFavReportItemsinState: IReportFavoriteItem[];
   isShowAll: boolean;
   isReportsLoaded: boolean;

}
