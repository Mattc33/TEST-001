import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ITableauReportViewerConfig } from "../../../models";


export interface IReportViewerProviderProps {
    tableauReportConfig: ITableauReportViewerConfig;
    context: WebPartContext;
}
  