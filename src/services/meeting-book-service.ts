import {
    SPHttpClient,
    SPHttpClientResponse,
    HttpClient,
    ISPHttpClientOptions
} from "@microsoft/sp-http";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import {
    sp,
    ItemUpdateResult,
    CamlQuery,
    Web,
    RenderListDataParameters,
} from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as moment from "moment";
import * as _ from "lodash";
import * as queryString from "query-string";
const getVideoId: Function = require("get-video-id");

import {
    IUser,
    IPeoplePickerUser,
    IServiceConfiguration,
    IMeetingBook,
    IMeetingBookResponse,
    IMeetingBookItem,
    IDocument,
    MeetingBookFilterType,
    IVideoItem,
    IDocumentItem,
    IMediaItem,
    ICalendarItem,
    ILinkItem,
    initialDocument
} from "../models";

// import { IMeetingBookService, IDepartmentService, DepartmentService } from '.';
import { IMeetingBookService } from ".";
import { IODataPagedResult } from "../models/sharepoint/IODataPagedResult";


/**
 * @interface
 * 
 */
export interface IMeetingBookSharePointItem {

    Id?: number;
    Title?: string;
    SVPBookStatus?: any;
    SVPSharedWith?: Array<IUser>;
    Author?: IUser;
    Modified?: Date;
    Created?: Date;
    SVPShareWithAll?: boolean;
    SVPLastUpdated?: Date;
}

/** 
 * @interface
 * Defines the shape of the expected
 * object when updating a meeting book
 * in SharePoint.
*/
export interface IMeetingBookSharePointUpdateItem {
    Id?: number;
    id?: number;
    Title?: string;
    SVPBookStatus?: any;
    SVPSharedWithId?: { results: Array<number> };
    SVPShareWithAll?: boolean;
}

/** 
 * @interface 
 * Defines the shape of a Meeting Book Item
 * stored in a SharePoint list.
*/
export interface IMeetingBookItemSharePointItem {

    Id?: number;
    Title: string;
    SVPBookId: number;
    SVPOrder: number;
    SVPMediaLink: string;
    SVPDocumentLink: string;
    Created: string;

}

const MEETING_BOOK_LIST = "Meeting Books";
const MEETING_BOOK_ITEMS_LIST = "Meeting Book Items";
const MEETING_BOOK_PAGE_SIZE = 20;

/**
 * @class
 * Implements the {@link IArtistCalendarService} to provide
 * CRUD operations to/from SharePoint.
 */
export class MeetingBookService implements IMeetingBookService {

    private _httpClient: SPHttpClient;
    private _rootUrl: string;
    private _context: WebPartContext;
    // private _deptService: IDepartmentService;

    private SITE_FIELD_ALIAS = {
        "LinkFilename": "Name",
        "": "Name",
        null: "Name",
        undefined: "Name"
    };

    private LIBRARY_FIELD_ALIAS = this.SITE_FIELD_ALIAS;

    constructor(private config: IServiceConfiguration) {

        this._rootUrl = config.siteAbsoluteUrl;
        this._context = config.context;
        this._httpClient = config.spHttpClient;
        // this._deptService = new DepartmentService(config.context);

    }

    @autobind
    public async getMeetingBooks(
        filter?: MeetingBookFilterType,
        sortField?: string,
        sortAscending?: boolean): Promise<IMeetingBookResponse> {

        const currentUserEmail = this._context.pageContext.user.email;

        let filterString = `(SVPSharedWith/EMail eq '${currentUserEmail}' or Author/EMail eq '${currentUserEmail}' or SVPShareWithAll eq 1)`;

        if (filter && filter.length > 0)
            filterString += ` and SVPBookStatus eq '${filter}'`;

        let sortBy = (sortField && sortField.length > 0)
            ? sortField
            : "SVPLastUpdated";
        let sortAsc = (sortAscending) ? sortAscending : false;

        const value = await sp
            .site
            .rootWeb
            .lists
            .getByTitle(MEETING_BOOK_LIST)
            .items
            .top(MEETING_BOOK_PAGE_SIZE)
            .select(...this.selectFields_MeetingBook())
            .expand("SVPSharedWith", "Author")
            .filter(filterString)
            .orderBy(sortBy, sortAsc)
            .getPaged();

        const nextUrl = (value as any).nextUrl;
        const books = (value && value.results)
            ? value.results.map(b => this.getMeetingBookFromSP(b))
            : [];
        const response: IMeetingBookResponse = { result: books, nextPage: nextUrl };

        return response;

    }

    @autobind
    public getPagedMeetingBooks(query: string): Promise<IMeetingBookResponse> {

        const opt: ISPHttpClientOptions = { headers: { "Accept": "application/json;odata=nometadata" } };
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(query, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse) => response.json())
                .then((data: any) => {

                    const nextUrl = (data as any)["@odata.nextLink"];
                    const books = (data && data.value)
                        ? data.value.map(b => this.getMeetingBookFromSP(b))
                        : [];
                    const response: IMeetingBookResponse = { result: books, nextPage: nextUrl };

                    resolve(response);
                })
                .catch((reason: any) => reject(reason));
        });

    }

    @autobind
    public async addMeetingBook(meetingBook: IMeetingBook): Promise<IMeetingBook> {

        const spItem = this.getSharePointItem_MeetingBook(meetingBook);

        const response = await sp
            .site
            .rootWeb
            .lists
            .getByTitle(MEETING_BOOK_LIST)
            .items
            .add(spItem);

        const newMeetingBook: IMeetingBook = {
            ...meetingBook,
            Id: response.data.Id
        };

        return newMeetingBook;

    }

    @autobind
    public async getMeetingBook(id: number): Promise<IMeetingBook> {

        const value = await sp
            .site
            .rootWeb
            .lists
            .getByTitle(MEETING_BOOK_LIST)
            .items
            .getById(id)
            .select(...this.selectFields_MeetingBook())
            .expand("SVPSharedWith", "Author")
            .get();

        return this.getMeetingBookFromSP(value);
    }

    @autobind
    public async deleteMeetingBooks(deleteItems: Array<number>): Promise<void> {

        let batch = sp.createBatch();
        for (let i = 0; i < deleteItems.length; i++) {

            sp
                .site
                .rootWeb
                .lists
                .getByTitle(MEETING_BOOK_LIST)
                .items
                .getById(deleteItems[i])
                .inBatch(batch)
                .delete().then(r => {

                });

        }

        await batch.execute();

        await this.deleteMeetingBookItems(deleteItems);

    }

    @autobind
    public async deleteMeetingBookItems(deleteItems: Array<number>): Promise<void> {

        for (let i = 0; i < deleteItems.length; i++) {

            const items = await this.getMeetingBookItemIds(deleteItems[i]);

            for (let j = 0; j < items.length; j++) {

                let batch = sp.createBatch();
                sp
                    .site
                    .rootWeb
                    .lists
                    .getByTitle(MEETING_BOOK_ITEMS_LIST)
                    .items
                    .getById(items[j])
                    .inBatch(batch)
                    .delete().then(r => {

                    });

                await batch.execute();
            }
        }
    }

    @autobind
    public async updatingMeetingBook(meetingBook: IMeetingBook): Promise<any> {

        const spItem = this.getSharePointItem_MeetingBook(meetingBook);

        const list = sp.site.rootWeb.lists.getByTitle(MEETING_BOOK_LIST);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();

        const response: ItemUpdateResult = await list
            .items
            .getById(meetingBook.Id)
            .update({
                ...spItem,
            }, "*", entityTypeFullName);

        return meetingBook;

    }

    @autobind
    public async updateMeetingBookLastUpdateDate(meetingBookId: number): Promise<any> {
        const list = sp.site.rootWeb.lists.getByTitle(MEETING_BOOK_LIST);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();

        await list
            .items
            .getById(meetingBookId)
            .update({
                "SVPLastUpdated": moment().toISOString()
            }, "*", entityTypeFullName);
    }

    @autobind
    public async getMeetingBookItems(meetingBookId: number): Promise<Array<IMeetingBookItem>> {

        const result = await
            sp
                .site
                .rootWeb
                .lists
                .getByTitle(MEETING_BOOK_ITEMS_LIST)
                .items
                .filter(`SVPBookId eq ${meetingBookId}`)
                .orderBy("SVPOrder", true)
                .get();

        return await this.processMeetingBookItems(result);

    }

    @autobind
    public async getMeetingBookItemIds(meetingBookId: number): Promise<Array<number>> {

        const result = await
            sp
                .site
                .rootWeb
                .lists
                .getByTitle(MEETING_BOOK_ITEMS_LIST)
                .items
                .filter(`SVPBookId eq ${meetingBookId}`)
                .orderBy("SVPOrder", true)
                .get();


        return result.map((r: IMeetingBookItemSharePointItem): number => {
            return r.Id;
        });
    }

    @autobind
    public async processMeetingBookItems(result: any[]): Promise<Array<IMeetingBookItem>> {
        const items: Array<IMeetingBookItem> = [];
        const promises = [];
        for (let i = 0; i < result.length; i++) {

            let item: IMeetingBookItem = this.getMeetingBookItemFromSP(result[i]);

            promises.push(this.processLink(item)
                .then((mediaItem: IMediaItem) => {

                    item.Url = mediaItem.item.url;
                    item.DefaultThumbnailUrl = mediaItem.defaultThumbnail;
                    item.ThumbnailUrl = mediaItem.item.thumbnail;
                    item.Type = mediaItem.service;
                    item.OpenInNewTab = mediaItem.openInNewTab;

                    if (mediaItem.type === "documentItem") {
                        const d = mediaItem.item as IDocumentItem;
                        item.Filename = d.filename;
                        item.FileExtension = d.extension;
                        item.ModifiedDate = d.modifiedDate;
                    }

                    if (mediaItem.type === "videoItem") {
                        const v = mediaItem.item as IVideoItem;
                        item.EmbedHtml = v.html;
                        item.FileExtension = v.extension;
                    }

                    if (mediaItem.type === "calendarItem") {
                        const c = mediaItem.item as ICalendarItem;
                        item.FileExtension = c.extension;
                    }

                    if (mediaItem.type === "linkItem") {
                        const l = mediaItem.item as ILinkItem;
                        item.FileExtension = l.extension;
                        item.Filename = l.filename;
                    }

                    items.push(item);
                })
            );

        }

        if (promises.length)
            await Promise.all(promises);

        return items.sort((a: IMeetingBookItem, b: IMeetingBookItem) => {
            return a.Sequence - b.Sequence;
        });
    }

    @autobind
    public async addMeetingBookItemsBatch(
        items: Array<IMeetingBookItem>
    ): Promise<Array<IMeetingBookItem>> {

        let rawItems = [];

        let batch = sp.site.createBatch();

        for (let i = 0; i < items.length; i++) {

            const item = items[i];
            const spItem = this.getSharePointItem_MeetingBookItem(item);

            const p =
                sp
                    .site
                        .rootWeb
                        .lists
                            .getByTitle(MEETING_BOOK_ITEMS_LIST)
                        .items
                        .inBatch(batch)
                        .add(spItem)
                        .then(b => {
                            rawItems.push(b.data);
                        });

        }
        
        const d = await batch.execute();

        return await this.processMeetingBookItems(rawItems);

    }

    @autobind
    public async updateMeetingBookItemsBatch(
        items: Array<IMeetingBookItem>): Promise<Array<IMeetingBookItem>> {

        const updatedItems = _.cloneDeep(items);

        const list = sp.site.rootWeb.lists.getByTitle(MEETING_BOOK_ITEMS_LIST);

        const entityTypeFullName = await list.getListItemEntityTypeFullName();

        let batch = sp.site.createBatch();

        for (let i = 0; i < updatedItems.length; i++) {

            let item = updatedItems[i];

            const spItem = {
                ...this.getSharePointItem_MeetingBookItem(item),
                SVPOrder: i
            };

            const p = list
                .items
                .getById(item.Id)
                .inBatch(batch)
                .update(spItem, "*", entityTypeFullName)
                .then(b => {
                    // No op
                });
        }

        const d = await batch.execute();

        return updatedItems;

    }

    @autobind
    public async deleteMeetingBookItemsBatch(deleteItems: Array<number>): Promise<void> {

        let batch = sp.createBatch();
        for (let i = 0; i < deleteItems.length; i++) {

            sp
                .site
                .rootWeb
                .lists
                .getByTitle(MEETING_BOOK_ITEMS_LIST)
                .items
                .getById(deleteItems[i])
                .inBatch(batch)
                .delete().then(r => {

                });

        }

        await batch.execute();

    }

    @autobind
    public async saveFile(file: File, url: string, webUrl: string, fileName?: string, overwrite?: boolean): Promise<any> {

        const fName = fileName || file.name;
        const web = new Web(webUrl);

        await web.getFolderByServerRelativeUrl(url).files.addChunked(fName, file, data => {
            // progress code here
        }, true);

    }

    @autobind
    public async deleteFile(files: string[], webUrl: string): Promise<any> {

        const urlParser = document.createElement("a");
        const web = new Web(webUrl);
        const batch = web.createBatch();

        //files.forEach((file: string) => {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            urlParser.href = file;
            let url = urlParser.pathname;

            //IE 11 fix
            if (url[0] != "/") {
                url = "/" + url;
            }

            // Batch stops at first item with new Web(...) changes
            // web.inBatch(batch).getFileByServerRelativeUrl(url).delete();
            await web.getFileByServerRelativeUrl(url).delete();
        }

        await batch.execute();

    }

    @autobind
    public async cloneMeetingBook(meetingBookId: number): Promise<IMeetingBook> {

        const meetingBook = await this.getMeetingBook(meetingBookId);
        const meetingBookItems = await this.getMeetingBookItems(meetingBookId);

        const clonedMeetingBookPayload: IMeetingBook = {
            Id: 0,
            Title: `${meetingBook.Title} (Copy)`,
            SharedWith: [],
            ShareWithAll: false,
            Status: "In Progress"
        };
        const clonedMeetingBook = await this.addMeetingBook(clonedMeetingBookPayload);

        const clonedMeetingBookItemsPayload = meetingBookItems.map((m: IMeetingBookItem): IMeetingBookItem => {
            return {
                Id: 0,
                MeetingBookId: clonedMeetingBook.Id,
                Sequence: m.Sequence,
                Filename: m.Filename,
                Url: m.Url,
                DocumentODataId: m.DocumentODataId
            } as IMeetingBookItem;
        });

        const clonedMeetingBookItems = await this.addMeetingBookItemsBatch(clonedMeetingBookItemsPayload);

        const newMeetingBook = await this.getMeetingBook(clonedMeetingBook.Id);

        return newMeetingBook;

    }

    @autobind
    public async pageLibraryItems(
        siteUrl: string,
        libraryName: string,
        folderName: string,
        searchTerm?: string,
        href?: string
    ): Promise<IODataPagedResult<IDocument>> {

        const result = await this.getLibraryItemsPaged(
            siteUrl,
            libraryName, 
            folderName,
            searchTerm,
            href
        );

        return this.getDocumentStreamResult(result);

    }

    @autobind
    public async getLibraryItems(
        siteUrl: string, 
        libraryName: string, 
        folderName: string,
        sortField: string = "Name", 
        sortDesc: boolean = false, 
        searchTerm: string = ""
    ): Promise<IODataPagedResult<IDocument>> {

        const result = await this.getLibraryItemsPaged(
            siteUrl, 
            libraryName, 
            folderName,
            searchTerm,
            sortField ? `?SortField=${sortField}&SortDir=${!!sortDesc ? "Desc" : "Asc"}` : "");
        return this.getDocumentStreamResult(result);

    }

    @autobind
    public async getDocumentItem(odataId: string): Promise<IDocument> {

        const response = await this._context.spHttpClient.get(
            `${odataId}?$expand=ListItemAllFields&`
            + `$select=Name,ListItemAllFields/EncodedAbsUrl,ListItemAllFields/FileRef,ListItemAllFields/FileLeafRef,ListItemAllFields/ServerRedirectedEmbedUrl,ListItemAllFields/FileSystemObjectType,ListItemAllFields/Modified,ListItemAllFields/Id`,
            SPHttpClient.configurations.v1, {
                headers: { "accept": "application/json" }
            });

        const file = await response.json();
        
        if(!response.ok) {
            const errorMsg = file.error.message;
            throw new Error("File has been removed or you do not have permission to view.");
        }

        const url = file.ListItemAllFields.ServerRedirectedEmbedUrl ?
            file.ListItemAllFields.ServerRedirectedEmbedUrl :
            `${file.ListItemAllFields.EncodedAbsUrl}?web=1`;

        const wopiEnabled = url.indexOf("WopiFrame.aspx") > -1;

        const extension = this.getFilePathExtension(file.ListItemAllFields.FileLeafRef);

        const thumbnailUrl = `${this._context.pageContext.site.absoluteUrl}/_layouts/15/getpreview.ashx?resolution=0&path=${file.ListItemAllFields.EncodedAbsUrl}`;

        const meetingBookDoc: IDocument = {
            Id: file.ListItemAllFields.Id,
            ODataId: odataId,
            Name: file.Name,
            DateModified: moment(file.ListItemAllFields.Modified),
            IsSite: false,
            IsLibrary: false,
            IsFolder: file.ListItemAllFields.FileSystemObjectType === 1,
            Url: url,
            SourceUrl: file.ListItemAllFields.EncodedAbsUrl,
            Filename: file.ListItemAllFields.FileLeafRef,
            Extension: extension,
            ThumbnailUrl: thumbnailUrl,
            DefaultThumbnail: this.getDefaultDocumentThumbnail()
        };

        return meetingBookDoc;
    }

    @autobind
    public async getWebsInSite(
        hubSite: string,
        sortBy: string = "Name", 
        sortDir: string = "asc", 
        searchTerm: string = ""): Promise<IODataPagedResult<IDocument>> {

        // 8/3/2018 - Need to avoiding showing subsite
        // for the 8/4 Production Deployment and Migration
        // ---------------------------------------------
        // const websPromise = sp
        //     .site
        //     .rootWeb
        //     .getSubwebsFilteredForCurrentUser()
        //     .filter("WebTemplate ne 'APP' and WebTemplate ne 'SRCHCEN'")
        //     .get();

        //const [rootWeb, w] = await Promise.all([rootWebPromise, websPromise]);

        //JA: const [rootWeb, departmentSites] = await Promise.all([
        //     sp
        //         .site
        //         .rootWeb
        //         .select("Id, Title, Url, LastItemModifiedDate")
        //         .get(),

        //         this._deptService.getDepartmentSitesByHubSiteUrl(hubSite)
        // ]);

        const rootWeb: any = await sp
                .site
                .rootWeb
                .select("Id, Title, Url, LastItemModifiedDate")
                .get();


        const w = [];

        const webs = w.reduce((acc, subsite, currIdx, arr) => {
            const url = this.getAbsoluteUrlFromRelative(subsite.ServerRelativeUrl);

            if (subsite.Title.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0) {

                acc.push({
                    ...initialDocument,
                    IsLibrary: false,
                    IsSite: true,
                    IsFolder: true,
                    Url: url,
                    Filename: subsite.Title,
                    Name: subsite.Title,
                    DateModified: moment(subsite.LastItemModifiedDate)
                });
            }

            return acc;
        }, [
                (searchTerm ? [] : {
                    ...initialDocument,
                    IsLibrary: false,
                    IsSite: true,
                    IsFolder: true,
                    Url: rootWeb.Url,
                    Filename: rootWeb.Title,
                    Name: rootWeb.Title
                })
            ]
        );

        //JA: const websAndDepartments = departmentSites.reduce( (acc: any, dept: IDepartmentSite) => {
        //     acc.push({
        //         ...initialDocument,
        //         IsLibrary: false,
        //         IsSite: true,
        //         IsFolder: true,
        //         Url: dept.url,
        //         Filename: dept.title,
        //         Name: dept.title,
        //         DateModified: moment()
        //     });

        //     return acc;
        // }, webs);

        const sortField = this.SITE_FIELD_ALIAS[sortBy] as string || sortBy;

        //JA: const sortedWebs = _.orderBy(websAndDepartments, [sortField], [sortDir]);
        const sortedWebs: any = _.orderBy(webs, [sortField], [sortDir] as any);

        const result: IODataPagedResult<IDocument> = {
            payload: sortedWebs,
            nextHref: "",
            prevHref: "",
            firstRow: 1,
            lastRow: 1,
            filterLink: "",
            rowLimit: 0
        };

        return result;

    }

    @autobind
    public async getLibrariesInWeb(
        absWebUrl: string, 
        sortBy: string = "Name", 
        sortDir: string = "asc", 
        searchTerm: string = "",
        filteredItems: string[] = []
    ): Promise<IODataPagedResult<IDocument>> {

        const result = await sp.site.getDocumentLibraries(absWebUrl);

        const filteredResult = _.filter(result, (item: any): boolean => {
            return !(_.includes(filteredItems, item.Title) ||
                item.Title.toUpperCase().indexOf(searchTerm.toUpperCase()) < 0);
        });

        const sortField = this.LIBRARY_FIELD_ALIAS[sortBy] as string || sortBy;

        const sortedLibraries = _.orderBy(filteredResult.map(i => {
            return {
                ...initialDocument,
                IsLibrary: true,
                IsSite: false,
                IsFolder: true,
                Url: i.AbsoluteUrl,
                Name: i.Title,
                Filename: i.Title
            };
        }), [sortField], [sortDir] as any);

        const r: IODataPagedResult<IDocument> = {
            payload: sortedLibraries,
            nextHref: "",
            prevHref: "",
            firstRow: 1,
            lastRow: 1,
            filterLink: "",
            rowLimit: 0
        };

        return r;

    }

    /*********************
     * PRIVATE FUNCTIONS *
     *********************/

    @autobind 
    private async getLibraryItemsPaged(
        siteUrl: string,
        libraryName: string,
        folderName: string,
        searchText?: string,
        query?:string

    ) {

        /* EXAMPLE REQUEST:

            https://wmg.sharepoint.com/sites/US.Atlantic.Publicity/_api
                /web
                /lists
                /getByTitle('Documents')
                /RenderListDataAsStream
                ?Paged=TRUE&SortField=LinkFilename&SortDir=Desc


            {
                "parameters":{
                    "__metadata":{
                        "type":"SP.RenderListDataParameters"
                    },
                    "RenderOptions":2,
                    "ViewXml":"<View><Query><Where><Contains><FieldRef Name=\"FileLeafRef\" /><Value Type=\"File\">Match</Value></Contains></Where></Query><RowLimit Paged=\"TRUE\">400</RowLimit></View>",
                    "AllowMultipleValueFilterForTaxonomyFields":true,
                    "AddRequiredFields":true,
                    "FolderServerRelativeUrl": "/sites/US.Atlantic.Publicity/Shared Documents/Publicity Multimedia/MP3s"
            }
}
        */

        const xmlBuilder = [`<View>`];

        if(searchText) {
            xmlBuilder.push(
                `<Query><Where>`,
                    `<Contains><FieldRef Name="FileLeafRef" /><Value Type="File">${searchText}</Value></Contains>`,
                `</Where></Query>`
            );
        }

        xmlBuilder.push(`<RowLimit Paged=\"TRUE\">400</RowLimit>`);
        xmlBuilder.push(`</View>`);

        const body = {
            parameters: {
                RenderOptions: 4103,
                ViewXml: xmlBuilder.join(""),
                FolderServerRelativeUrl: folderName
            }
        };

        const url = `${siteUrl}/_api/web/lists/getByTitle('${libraryName}')/RenderListDataAsStream${query || ""}`;

        const response = await this._context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
            body: JSON.stringify(body)
        });

        return await response.json();

    }


    @autobind
    private getFilePathExtension(filename) {
        const lastIndex = filename.lastIndexOf(".");
        if (lastIndex < 1)
            return "";
        return filename.substr(lastIndex + 1);

    }

    @autobind
    private getDefaultDocumentThumbnail() {
        return `${this._context.pageContext.site.absoluteUrl}/PublishingImages/Document.svg`;
    }

    @autobind
    private getDefaultCalendarThumbnail() {
        return `${this._context.pageContext.site.absoluteUrl}/PublishingImages/Calendar.svg`;
    }

    @autobind
    private getSharePointItem_MeetingBook(meetingBook: IMeetingBook): IMeetingBookSharePointUpdateItem {

        let sharedWithIds = [];
        if (!meetingBook.ShareWithAll)
            sharedWithIds = (meetingBook.SharedWith || []).map(s => s.id || s.Id);

        const item: IMeetingBookSharePointUpdateItem = {
            Id: meetingBook.Id || 0,
            Title: meetingBook.Title,
            SVPBookStatus: meetingBook.Status,
            SVPSharedWithId: { results: sharedWithIds },
            SVPShareWithAll: meetingBook.ShareWithAll
        };

        return item;

    }

    @autobind
    private getSharePointItem_MeetingBookItem(item: IMeetingBookItem): IMeetingBookItemSharePointItem {
        return {
            Id: item.Id || 0,
            SVPBookId: item.MeetingBookId,
            SVPOrder: item.Sequence,
            Title: item.Filename,
            SVPMediaLink: item.Url,
            SVPDocumentLink: item.DocumentODataId || ""
        } as IMeetingBookItemSharePointItem;
    }

    @autobind
    private selectFields_MeetingBook() {
        return [
            "Id",
            "Title",
            "Modified",
            "Created",
            "AuthorId",
            "SVPBookStatus",
            "SVPSharedWith/Id",
            "SVPSharedWith/Name",
            "SVPSharedWith/EMail",
            //'SVPSharedWith/Department',
            //"SVPSharedWith/JobTitle",
            "SVPSharedWith/FirstName",
            "SVPSharedWith/LastName",
            "SVPSharedWith/UserName",
            "SVPShareWithAll",
            "Author/Id",
            "Author/Name",
            "Author/EMail",
            "Author/Department",
            "Author/JobTitle",
            "Author/FirstName",
            "Author/LastName",
            "Author/UserName",
            "SVPLastUpdated"
        ];
    }

    @autobind
    private getMeetingBookFromSP(book: IMeetingBookSharePointItem): IMeetingBook {

        const sharedWith = (book.SVPSharedWith || [] as Array<IUser>)
            .map((p: IUser) => this.getUserFromSharePointItem(p));

        const author = this.getUserFromSharePointItem(book.Author);

        return {
            Id: book.Id,
            Title: book.Title,
            SharedWith: sharedWith || [],
            ShareWithAll: book.SVPShareWithAll || false,
            Status: book.SVPBookStatus,
            CreatedBy: author,
            Created: moment(book.Created),
            Modified: moment(book.Modified),
            LastUpdate: (book.SVPLastUpdated) ? moment(book.SVPLastUpdated) : undefined
        } as IMeetingBook;

    }

    @autobind
    private getMeetingBookItemFromSP(item: IMeetingBookItemSharePointItem): IMeetingBookItem {

        const value: IMeetingBookItem = {
            Id: item.Id,
            MeetingBookId: item.SVPBookId,
            Filename: item.Title,
            Url: item.SVPMediaLink,
            Sequence: item.SVPOrder,
            Title: item.Title,
            ThumbnailUrl: "",
            DefaultThumbnailUrl: "",
            DocumentODataId: item.SVPDocumentLink,
            Type: "link",
            FileExtension: "",
            CreatedDate: moment(item.Created)
        };

        return value;
    }

    @autobind
    private getDocumentStreamResult(stream: any): IODataPagedResult<IDocument> {

        const siteCollUrl = stream.HttpRoot;
        const listGuid = (stream.listName || "")
            .replace("{", "")
            .replace("}", "");
        const listData = stream.ListData;

        const nextHref = listData.NextHref || "";
        const prevHref = listData.PrevHref || "";
        const firstRow = listData.FirstRow || 0;
        const lastRow = listData.LastRow || 0;
        const rowLimit = listData.RowLimit;

        const payload: Array<IDocument> = listData.Row.map(r => {

            const odataId = `${siteCollUrl}/_api/Web/Lists(guid'${listGuid}')/Items(${r.ID})/File`;

            return {
                Id: r.ID,
                ODataId: odataId,
                Name: r.LinkFilename,
                DateModified: moment(r.Modified),
                IsSite: false,
                IsLibrary: false,
                IsFolder: r.FSObjType === "1",
                Url: `${r.EncodedAbsUrl}${r.FSObjType === "0" ? "?web=1" : ""}`,
                ThumbnailUrl: "",
                Filename: "",
                Extension: "",
                SourceUrl: "",
                DefaultThumbnail: this.getDefaultDocumentThumbnail()
            };

        });

        const result: IODataPagedResult<IDocument> = {
            payload,
            nextHref,
            prevHref,
            firstRow,
            lastRow,
            filterLink: "",
            rowLimit
        };

        return result;
    }

    @autobind
    private getAbsoluteUrlFromRelative(serverRelativeUrl): string {

        const tenantUrl =
            this._context
                .pageContext
                .site
                .absoluteUrl
                .replace(this._context.pageContext.site.serverRelativeUrl, "");

        return `${tenantUrl}${serverRelativeUrl || ""}`;

    }

    @autobind
    private getUserFromSharePointItem(personField: IUser) {

        if (!personField)
            return null;

        const pictureUrl = `${this._rootUrl}` +
            `/_layouts/15/userphoto.aspx?size=L&accountname=${personField.EMail}`;

        const firstName = personField.FirstName || "";
        const lastName = personField.LastName || "";

        const user: IPeoplePickerUser = {
            ...personField,
            imageUrl: pictureUrl,
            imageInitials: `${firstName.toUpperCase().charAt(0)}${lastName.toUpperCase().charAt(0)}`,
            primaryText: `${personField.FirstName} ${personField.LastName}`
        };
        return user;
    }

    @autobind
    private processLink(item: IMeetingBookItem): Promise<IMediaItem> {


        // Office supported document
        if (item.DocumentODataId) {
            return this.handleOfficeDocument(item.DocumentODataId);
        }

        if (!item.Url)
            return Promise.resolve(null);

        // Artist Calendar
        if (item.Url.indexOf("ArtistCalendar.aspx") > -1) {
            return this.handleCalendar(item.Url);
        }

        // Supported video services
        const { id, service } = getVideoId(item.Url);

        if (id) {
            switch (service) {
                case "youtube":
                    return this.handleYouTube(id);
                case "vimeo":
                    return this.handleVimeo(item.Url);
                default:
                    break;
            }
        }

        return this.handleGenericLink(item);
    }

    @autobind
    private handleGenericLink(linkItem: IMeetingBookItem) {

        const parser = document.createElement("a");
        parser.href = linkItem.Url;

        const url = [parser.protocol, "//", parser.host, parser.pathname].join("");

        const thumbUrl = `${this._context.pageContext.site.absoluteUrl}/_layouts/15/getpreview.ashx?resolution=0&path=${url}`;

        const item: ILinkItem = {
            thumbnail: thumbUrl,
            url: linkItem.Url,
            filename: linkItem.Title || "",
            extension: ""
        };

        const mediaItem: IMediaItem = {
            type: "linkItem",
            service: "link",
            defaultThumbnail: this.getDefaultDocumentThumbnail(),
            openInNewTab: true,
            item
        };

        return Promise.resolve(mediaItem);
    }

    @autobind
    private handleYouTube(id: string): Promise<IMediaItem> {

        const item: IVideoItem = {
            thumbnail: `https://i1.ytimg.com/vi/${id}/hqdefault.jpg`,
            url: `https://www.youtube.com/embed/${id}`,
            html: "",
            extension: "youtube"
        };

        const mediaItem: IMediaItem = {
            type: "videoItem",
            service: "youtube",
            defaultThumbnail: this.getDefaultDocumentThumbnail(),
            openInNewTab: false,
            item
        };

        return Promise.resolve(mediaItem);

    }

    @autobind
    private handleVimeo(url: string): Promise<IMediaItem> {

        const oembedUrl = `https://vimeo.com/api/oembed.json?url=${url}`;

        return this._context.httpClient
            .get(oembedUrl, HttpClient.configurations.v1)
            .then(r => r.json())
            .then(j => {

                const item: IVideoItem = {
                    thumbnail: j.thumbnail_url,
                    url: url,
                    html: j.html,
                    extension: "vimeo"
                };

                const mediaItem: IMediaItem = {
                    type: "videoItem",
                    service: "vimeo",
                    defaultThumbnail: this.getDefaultDocumentThumbnail(),
                    openInNewTab: false,
                    item
                };

                return mediaItem;

            })
            .catch(err => {

                const item: IVideoItem = {
                    thumbnail: "",
                    url: url,
                    html: "",
                    extension: "vimeo"
                };

                const mediaItem: IMediaItem = {
                    type: "videoItem",
                    service: "vimeo",
                    defaultThumbnail: this.getDefaultDocumentThumbnail(),
                    openInNewTab: true,
                    item
                };

                return mediaItem;

            });
    }

    @autobind
    private handleOfficeDocument(odataUrl: string): Promise<IMediaItem> {

        return this.getDocumentItem(odataUrl)
            .then(d => {

                return this.enhanceMeetingBookItem(d);

            })
            .catch(err => {

                const item: IDocumentItem = {
                    url: "ERROR",
                    thumbnail: "",
                    filename: "",
                    extension: ""
                };

                const mediaItem: IMediaItem = {
                    type: "documentItem",
                    service: "office",
                    defaultThumbnail: this.getDefaultDocumentThumbnail(),
                    openInNewTab: false,
                    item
                };

                return mediaItem;

            });
    }

    @autobind
    private enhanceMeetingBookItem(d: IDocument): IMediaItem {
        const parser = document.createElement("a");
        parser.href = d.Url;

        let qs = queryString.parse(parser.search);

        qs["action"] = "view";
        qs["wdAllowInteractivity"] = "true";

        const previewUrlBase = d.Url.split("?")[0];
        const url = d.Extension === "pdf" ?
            `${d.SourceUrl}?web=1` :
            `${previewUrlBase}?${queryString.stringify(qs)}`;

        const item: IDocumentItem = {
            url: url,
            thumbnail: d.ThumbnailUrl,
            filename: d.Filename,
            extension: d.Extension,
            modifiedDate: d.DateModified
        };

        const mediaItem: IMediaItem = {
            type: "documentItem",
            service: "office",
            defaultThumbnail: this.getDefaultDocumentThumbnail(),
            openInNewTab: false,
            item
        };

        return mediaItem;
    }

    @autobind
    private handleCalendar(url: string): Promise<IMediaItem> {

        const thumbnail = this.getDefaultCalendarThumbnail();
        const item: ICalendarItem = {
            thumbnail: thumbnail,
            url: url,
            extension: "calendar"
        };

        const mediaItem: IMediaItem = {
            type: "calendarItem",
            service: "calendar",
            defaultThumbnail: thumbnail,
            openInNewTab: false,
            item
        };

        return Promise.resolve(mediaItem);

    }

}