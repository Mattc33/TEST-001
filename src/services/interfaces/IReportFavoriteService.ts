import { IReportFavoriteItem } from "../../models/IReportItem";

export interface IReportFavoriteService {
    getMyFavoriteReports(visualizationTitle:string, visualizationImage:string,favReportCounts:number):Promise<Array<IReportFavoriteItem>>;

    //deleteMyFavoriteReport(myFavReport: IReportFavoriteItem):Promise<void>;

}