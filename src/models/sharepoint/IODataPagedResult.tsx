export interface IODataPagedResult<TResult> {

    payload: Array<TResult>;
    nextHref?: string;
    prevHref?: string;
    firstRow: number;
    lastRow: number;
    filterLink?: string;
    rowLimit?: number;

}