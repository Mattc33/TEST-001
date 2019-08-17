import { IReportFavoriteItem } from '../../../../models/IReportItem';

export interface IReportMyFavProps {

   controlHeaderMessage: string;
   siteUrl: string;
   loggedInUserName: string;
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

}
