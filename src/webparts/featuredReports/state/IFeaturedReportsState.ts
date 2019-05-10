import {
    WebPartContext
  } from '@microsoft/sp-webpart-base';
import { FeaturedReportsActions } from "../action/FeaturedReportsActions";
import { 
    IReportItem,
    IFilter,
    IFilterValues,
    ISort,
    IPaging, 
    IErrorResult
} from "../../../models";



export interface IFeaturedReportsState {
    clientLabel: string;
    webpartTitle: string;
    pageSizes: string;
    context: WebPartContext;

    loadingFilters?: boolean;
    loadingReports?: boolean;
    actions?: FeaturedReportsActions;
    error?: IErrorResult; 

    reports?: Array<IReportItem>;
    
    filter?: IFilter;
    sort?: ISort;
    paging?: IPaging;

    filterValues?: IFilterValues;
}