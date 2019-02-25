
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
    SVPHeight: number;
    SVPWidth: number;
    Modified: Date;
    Created: Date;
}

 export interface IReportBasicItem {

     Id: string;
     Title: string;
     SVPVisualizationDescription:string;
     SVPVisualizationImage: string;
 }