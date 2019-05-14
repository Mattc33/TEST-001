import { Web, Items, PagedItemCollection } from '@pnp/sp';
import { IFeaturedReportsService } from ".";
import { IReportItem, IFilter, IPaging, ISort } from "../models";
import * as moment from 'moment';

const VizListTitle = "Visualizations";
const FavoriteListTitle = "Favorites";

const VizListFields = [
    "Id",
    "Title",
    "SVPVisualizationAddress",
    "SVPVisualizationMetadata",
    "SVPVisualizationTechnology",
    "SVPLastUpdated",
    "SVPVisualizationDescription",
    "SVPVisualizationImage",
    "SVPMetadata1",          //segment
    "SVPMetadata2",          //function
    "SVPMetadata3",          //frequency
    "SVPReportHeight",
    "SVPReportWidth",
    "Modified",
    "Created",
    "SVPVisualizationOwner/Id",
    "SVPVisualizationOwner/Title",
    "SVPVisualizationOwner/EMail"
];


export class FeaturedReportsService implements IFeaturedReportsService {

    constructor() {
        
    }
    
    public async loadFilter(webUrl: string, filterName: string): Promise<Array<string>> {
        const web: Web = new Web(webUrl);
        const field = await web
            .fields
                .getByInternalNameOrTitle(filterName)
                .select("Title", "Choices")
                .get();

        return (field && field.Choices) ? field.Choices : [];
    }

    public async loadReports(webUrl: string, filter: IFilter, paging: IPaging, sort: ISort): Promise<PagedItemCollection<IReportItem[]>> {
        const web: Web = new Web(webUrl);

        let items: Items = web.lists.getByTitle(VizListTitle)
            .items
                .top(paging.recordsPerPage);

        items = this._applyFilter(items, filter);
        items = this._applySort(items, sort);
        items = this._applyPaging(items, paging, sort);

        const result = await items
            .select(VizListFields.join(','))
            .expand("SVPVisualizationOwner")
            .getPaged<IReportItem[]>();

        return result;
    }

    private _applyFilter(items: Items, filter: IFilter) {
        if (!filter || (!filter.segment && !filter.function && !filter.frequency))
            return items;

        let where: string = '';
        if (filter.segment) 
            where = `SVPMetadata1 eq '${filter.segment}'`;
        
        if (filter.function)
            where = (where.length === 0)
                ? where = `SVPMetadata2 eq '${filter.function}'`
                : where += `and SVPMetadata2 eq '${filter.function}'`;
        
        if (filter.frequency)
            where = (where.length === 0)
                ? where = `SVPMetadata3 eq '${filter.frequency}'`
                : where += `and SVPMetadata3 eq '${filter.frequency}'`;

        return (where.length > 0)
            ? items.filter(where)
            : items;
    }

    private _applySort(items: Items, sort: ISort) {
        if (!sort || !sort.sortField)
            return items;

        return items
            .orderBy(sort.sortField, sort.isAsc)
            .orderBy("Id");
    }

    private _applyPaging(items: Items, paging: IPaging, sort: ISort) {
        if (!paging || !paging.prevToken || !paging.nextToken)
            return items;

        let token = (paging.direction === "prev")
            ? `Paged=TRUE&PagedPrev=TRUE&p_ID=${paging.prevToken.Id}`
            : `Paged=TRUE&p_ID=${paging.nextToken.Id}`;

        if (sort && sort.sortField) {
            let sortToken = '';

            const fieldValue = (paging.direction === "prev")
                ? paging.prevToken[sort.sortField]
                : paging.nextToken[sort.sortField];

            if (sort.sortField === 'SVPLastUpdated') {
                if (fieldValue && moment(fieldValue).isValid())
                    sortToken = moment(fieldValue).utc().format("YYYYMMDD HH:mm:ss");
            }
            else {
                sortToken = fieldValue;
            }

            token += `&p_${sort.sortField}=${sortToken}`;

            // token += (paging.direction === "prev")
            //     ? `&p_${sort.sortField}=${paging.prevToken[sort.sortField]}`
            //     : `&p_${sort.sortField}=${paging.nextToken[sort.sortField]}`;
        }

        items.query.set("$skiptoken", encodeURIComponent(token));

        return items;
    }
}
