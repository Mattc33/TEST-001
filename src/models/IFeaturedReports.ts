import { IReportItem } from ".";

export interface IFilter {
    segment?: string;
    function?: string;
    frequency?: string;
}

export interface IFilterValues {
    segments?: Array<string>;
    functions?: Array<string>;
    frequencies?: Array<string>;
    pageSizes?: Array<string>;
}

export interface ISort {
    sortField?: string;
    isAsc?: boolean;
}

export interface IPaging {
    recordsPerPage?: number;
    currentPage?: number;
    nextToken?: IReportItem;
    prevToken?: IReportItem;
    direction?: string; //next|prev
    hasNext?: boolean;
}