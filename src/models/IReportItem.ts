
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
    SVPVisualizationMetadata?: any;
    SVPVisualizationOwner: IUser;
    SVPVisualizationTechnology: string;
    SVPLastUpdated?: any;
    SVPVisualizationDescription: string;
    SVPVisualizationImage?: string;
    SVPBusinessUnit?: any;
    SVPIsFeatured: boolean;
    SVPCategory: string;
    SVPVisualizationParameters?: Array<IReportParameters>;
    SVPReportHeight?: number;
    SVPReportWidth?: number;
    SVPLikes?: string;
    SVPLikesCount?: number;
    Modified: Date;
    Created: Date;

    FileLeafRef?: string;
    UniqueId?: string;
    FileWebUrl?: string;
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
    SVPVisualizationLookupId?: string;
    SVPVisualizationLookupTitle?: string;
    SVPVisualizationImage?: string;
    SVPVisualizationParameters?: string;
    SVPVisualizationMetadata?:string;

}