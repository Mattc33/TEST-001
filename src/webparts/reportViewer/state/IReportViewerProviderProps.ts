import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ITableauReportViewerConfig } from "../../../models";


export interface IReportViewerProviderProps {
    SVPClientLabel: string;
    tableauReportConfig: ITableauReportViewerConfig;
    context: WebPartContext;
    SVPUseSentimentService:boolean;
    SVPSentimentServiceAPI:string;
    SVPSentimentServiceKey:string;
}
  