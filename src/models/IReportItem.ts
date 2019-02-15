export interface IReportItem {
    Id: number;
    Title: string;
    SVPVisualizationAddress: string;
    SVPVisualizationMetadata?: any;
    SVPVisualizationOwnerId: number;
    SVPVisualizationOwnerStringId: string;
    SVPVisualizationTechnology: string;
    SVPLastUpdated?: any;
    SVPVisualizationDescription: string;
    SVPBusinessUnit?: any;
    SVPIsFeatured: boolean;
    SVPCategory: string;
    SVPVisualizationParametersId?: any;
    SVPHeight: number;
    SVPWidth: number;
    Modified: Date;
    Created: Date;
}