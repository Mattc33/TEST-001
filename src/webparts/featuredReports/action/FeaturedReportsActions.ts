import {
    WebPartContext
} from '@microsoft/sp-webpart-base';
import {
    IFeaturedReportsState
} from "../state/IFeaturedReportsState";
import { autobind } from 'office-ui-fabric-react';
import {
    IFeaturedReportsService,
    FeaturedReportsService
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
    public async loadReports(pageNbr: number, pageSize: number, sortField: string): Promise<Array<IReportItem>> {
        this.dispatch({ loading: true, error: null });

        return null;

        this.dispatch({
            loading: false
        });
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
