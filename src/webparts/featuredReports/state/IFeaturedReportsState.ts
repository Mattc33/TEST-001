import {
    WebPartContext
  } from '@microsoft/sp-webpart-base';
import { FeaturedReportsActions } from "../action/FeaturedReportsActions";
import { 
    IReportItem,
    IFilter,
    ISort,
    IPaging, 
    IErrorResult
} from "../../../models";



export interface IFeaturedReportsState {
    clientLabel: string;
    webpartTitle: string;
    context: WebPartContext;

    loading?: boolean;
    actions?: FeaturedReportsActions;
    error?: IErrorResult; 

    reports?: Array<IReportItem>;
    
    filter?: IFilter;
    sort?: ISort;
    paging?: IPaging;
}