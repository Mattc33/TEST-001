import {
    WebPartContext
} from '@microsoft/sp-webpart-base';
import {
    IFeaturedReportsState
} from "../state/IFeaturedReportsState";
import { autobind } from 'office-ui-fabric-react';
import {
    IFeaturedReportsService,
    FeaturedReportsService,
    withErrHandler
} from "../../../services";
import { BaseAction, IBaseStore } from "../../../base";
import {
    IErrorResult,
    IReportItem,
    IFilterValues
} from "../../../models";

export class FeaturedReportsActions extends BaseAction<IFeaturedReportsState, IBaseStore> {
    private context: WebPartContext;
    private featureReportsApi: IFeaturedReportsService;
    private defaultPageSizes: Array<string> = ['10','15','20','25'];

    constructor(store: IBaseStore, context: WebPartContext) {
        super(store);

        this.context = context;
        this.featureReportsApi = new FeaturedReportsService();
    }

    @autobind
    public async loadFilters() {
        await this.dispatch({ loadingFilters: true, error: null });
        const state: IFeaturedReportsState = this.getState();

        const webUrl: string = this.context.pageContext.web.absoluteUrl;
        const [values, err] = await withErrHandler<any>(Promise.all(
            [ this.featureReportsApi.loadFilter(webUrl, "SVPMetadata1"),
              this.featureReportsApi.loadFilter(webUrl, "SVPMetadata2"),
              this.featureReportsApi.loadFilter(webUrl, "SVPMetadata3") 
            ]
        ));

        if (err) 
            return this.dispatchError(`Error querying for filter values from Visualizations list.`,  err, { loadingFilters: false});

        const segments: Array<string> = values[0];
        const functions: Array<string> = values[1];
        const frequencies: Array<string> = values[2];
        const pageSizes = (state.pageSizes) 
            ? state.pageSizes.split(',')
            : this.defaultPageSizes;

        await this.dispatch({ 
            loadingFilters: false, 
            filterValues: {...state.filterValues, segments, functions, frequencies, pageSizes },
            error: null 
        });
    }

    @autobind
    public async loadReports() {
        await this.dispatch({ loadingReports: true, error: null });
        const state: IFeaturedReportsState = this.getState();

        const webUrl: string = this.context.pageContext.web.absoluteUrl;
        const currentPage: number = (!state.paging || !state.paging.currentPage) ? 1 : state.paging.currentPage;
        const recordsPerPage: number = (!state.paging || !state.paging.recordsPerPage) ? 10 : state.paging.recordsPerPage;
        const sortField: string = (!state.sort || !state.sort.sortField) ? "Title" : state.sort.sortField;
        const isAsc: boolean = (!state.sort || !state.sort.isAsc) ? true : state.sort.isAsc;

        const [reports, err] = await withErrHandler<IReportItem[]>(this.featureReportsApi.loadReports(webUrl, state.filter, currentPage, recordsPerPage, sortField, isAsc));
        if (err) 
            return this.dispatchError(`Error querying Visualizations list.`,  err, { loadingReports: false});

        await this.dispatch({
            loadingReports: false,
            paging: {...state.paging, currentPage, recordsPerPage },
            sort: {...state.sort, sortField, isAsc },
            reports
        });
    }

    @autobind
    public async updateFilter(name: string, value: string) {
        const state: IFeaturedReportsState = this.getState();
        await this.dispatch({
            filter: {...state.filter, [name]: value }
        });

        await this.loadReports();
    }

    @autobind
    public async updateSort(sortField: string, isAsc: boolean) {
        const state: IFeaturedReportsState = this.getState();
        await this.dispatch({
            sort: {...state.sort, sortField, isAsc }
        });

        await this.loadReports();
    }

    @autobind
    public async updatePageSize(recordsPerPage: number) {
        const state: IFeaturedReportsState = this.getState();
        await this.dispatch({
            paging: {...state.paging, recordsPerPage, currentPage: 1 }
        });

        await this.loadReports();
    }


    @autobind
    public async updatePaging(recordsPerPage: number, totalRecords: number, currentPage: number) {
        const state: IFeaturedReportsState = this.getState();
        await this.dispatch({
            paging: {...state.paging, recordsPerPage, totalRecords, currentPage }
        });

        await this.loadReports();
    }

    // @autobind
    // private async _loadReports() {
    //     const state: IFeaturedReportsState = this.getState();

    //     const webUrl: string = this.context.pageContext.web.absoluteUrl;
    //     const currentPage: number = (!state.paging || !state.paging.currentPage) ? 1 : state.paging.currentPage;
    //     const recordsPerPage: number = (!state.paging || !state.paging.recordsPerPage) ? 10 : state.paging.recordsPerPage;
    //     const sortField: string = (!state.sort || !state.sort.sortField) ? "Title" : state.sort.sortField;
    //     const isAsc: boolean = (!state.sort || !state.sort.isAsc) ? true : state.sort.isAsc;

    //     return await withErrHandler<IReportItem[]>(this.featureReportsApi.loadReports(webUrl, state.filter, currentPage, recordsPerPage, sortField, isAsc));
    // }

    @autobind
    private dispatchError(msg: string, err: any, status: any) {
        console.error(msg, err);

        const error: IErrorResult = {
            errorMessage: msg,
            error: err
        };

        this.dispatch({ ...status, error });
    }

    @autobind
    private async dispatch(incoming: any) {
        await this.dispatcher({
            ...this.getState(),
            ...incoming
        });
    }
}
