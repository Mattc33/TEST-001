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
    IReportItem
} from "../../../models";

export class FeaturedReportsActions extends BaseAction<IFeaturedReportsState, IBaseStore> {
    private context: WebPartContext;
    private featureReportsApi: IFeaturedReportsService;

    constructor(store: IBaseStore, context: WebPartContext) {
        super(store);

        this.context = context;
        this.featureReportsApi = new FeaturedReportsService();
    }

    @autobind
    public async loadReports() {
        await this.dispatch({ loading: true, error: null });
        const state: IFeaturedReportsState = this.getState();

        const currentPage: number = (!state.paging || !state.paging.currentPage) ? 1 : state.paging.currentPage;
        const recordsPerPage: number = (!state.paging || !state.paging.recordsPerPage) ? 10 : state.paging.recordsPerPage;
        const sortField: string = (!state.sort || !state.sort.sortField) ? "Title" : state.sort.sortField;
        const isAsc: boolean = (!state.sort || !state.sort.isAsc) ? true : state.sort.isAsc;

        const [reports, err] = await withErrHandler<IReportItem[]>(this.featureReportsApi.loadReports(state.filter, currentPage, recordsPerPage, sortField, isAsc));
        if (err) 
            return this.dispatchError(`Error querying Visualizations list.`,  err, { loading: false});

        await this.dispatch({
            loading: false,
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
