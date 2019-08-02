import { number } from "prop-types";

export interface IReportParameters {
    Id: number;
    SVPParameterName: string;
    SVPParameterValue: string;
}

export interface IUser {
    Id: number;
    Title: string;
    EMail: string;

    Name?: string;
    Department?: string;
    JobTitle?: string;
    FirstName?: string;
    LastName?: string;
    UserName?: string;
}

export interface IReportItem {
    Id?: number;
    Title?: string;
    SVPVisualizationAddress?: string;
    SVPVisualizationOwner?: IUser;
    SVPVisualizationTechnology?: string;
    SVPLastUpdated?: Date;
    SVPVisualizationDescription?: string;
    SVPVisualizationImage?: string;
    SVPMetadata1?: string;          //segment
    SVPMetadata2?: string;          //function
    SVPMetadata3?: string;          //frequency
    SVPReportHeight?: number;
    SVPReportWidth?: number;
    Modified?: Date;
    Created?: Date;

    FileLeafRef?: string;
    UniqueId?: string;
    FileWebUrl?: string;

    IconName?: string;
    ModifiedFormatted?: string;
    ModifiedNumber?: number;
    //SVPLikes?: string;
    //SVPLikesCount?: number;
    SVPIsFeatured?: boolean;
    SVPBusinessUnit?: string;
    SVPVisualizationParameters?: Array<IReportParameters>;
    SVPVisualizationMetadata?: any;

    ReportAnalytics?:IReportAnalytics;
}

 export interface IReportBasicItem {

     Id: string;
     Title: string;
     SVPVisualizationDescription:string;
     SVPVisualizationImage: string;
 }


 export interface IReportFavoriteItem {

    Id: string;
    Title:string;
    SVPVisualizationDescription:string;
    SVPFavoriteType:string;
    SVPVisualizationLookupId?: number;
    SVPVisualizationLookupTitle?: string;
    SVPVisualizationImage?: string;
    SVPVisualizationParameters?: string;
    SVPVisualizationMetadata?:string;

}

export interface IFavoriteReport {
    favoriteReportUrl: string;
    reportId: number;
}

export enum ReportFavoriteType {
    Custom = "Custom",
    Original = "Original",
    Parameterized = "Parameterized"
}
  
export interface IReportAnalytics{
    LikeCount:number;
    ViewCount:number;
}