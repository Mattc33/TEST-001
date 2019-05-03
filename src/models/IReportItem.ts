
export interface IReportParameters {
    Id: number;
    SVPParameterName: string;
    SVPParameterValue: string;
}

export interface IUser {
    Id: number;
    Title: string;
    EMail: string;
}

export interface IReportItem {
    Id: number;
    Title: string;
    SVPVisualizationAddress: string;
    SVPVisualizationOwner: IUser;
    SVPVisualizationTechnology: string;
    SVPLastUpdated?: any;
    SVPVisualizationDescription: string;
    SVPVisualizationImage?: string;
    SVPMetadata1?: string;          //segment
    SVPMetadata2?: string;          //function
    SVPMetadata3?: string;          //frequency
    SVPReportHeight?: number;
    SVPReportWidth?: number;
    Modified: Date;
    Created: Date;

    FileLeafRef?: string;
    UniqueId?: string;
    FileWebUrl?: string;

    //SVPLikes?: string;
    //SVPLikesCount?: number;
    SVPIsFeatured: boolean;
    SVPCategory: string;
    SVPVisualizationParameters?: Array<IReportParameters>;
    SVPVisualizationMetadata?: any;
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
  