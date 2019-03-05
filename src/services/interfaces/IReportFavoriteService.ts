import { IReportFavoriteItem } from "../../models/IReportItem";

export interface IReportFavoriteService {
    getMyFavoriteReports():Promise<Array<IReportFavoriteItem>>;

    //deleteMyFavoriteReport(myFavReport: IReportFavoriteItem):Promise<void>;

}