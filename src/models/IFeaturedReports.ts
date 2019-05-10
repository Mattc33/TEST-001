export interface IFilter {
    segment?: string;
    function?: string;
    frequency?: string;
}

export interface ISort {
    sortField?: string;
    isAsc?: boolean;
}

export interface IPaging {
    recordsPerPage?: number;
    totalRecords?: number;
    currentPage?: number;
}