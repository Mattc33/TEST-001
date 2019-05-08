import {
    WebPartContext
  } from '@microsoft/sp-webpart-base';
import { FeaturedReportsActions } from "../action/FeaturedReportsActions";
import { 
    IReportItem, 
    IErrorResult 
} from "../../../models";

export interface IFilter {
    segment?: string;
    function?: string;
    frequency?: string;
}

export interface ISort {
    sortField?: string;
    asc?: boolean;
}

export interface IPaging {
    recordsPerPage?: number;
    totalRecords?: number;
    currentPage?: number;
}

export interface IFeaturedReportsState {
    clientLabel: string;
    context: WebPartContext;

    loading?: boolean;
    actions?: FeaturedReportsActions;
    error?: IErrorResult; 

    reports?: Array<IReportItem>;
    
    filter?: IFilter;
    sort?: ISort;
    paging?: IPaging;
}