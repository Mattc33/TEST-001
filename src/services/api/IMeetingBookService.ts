import { 
    IMeetingBook,
    IMeetingBookResponse, 
    IMeetingBookItem, 
    IDocument, 
    MeetingBookFilterType
} from '../../models';
import { IODataPagedResult } from '../../models/sharepoint/IODataPagedResult';

export interface IMeetingBookService {

    getMeetingBooks(filter?: MeetingBookFilterType): Promise<IMeetingBookResponse>;

    getPagedMeetingBooks(query: string): Promise<IMeetingBookResponse>;

    getMeetingBook(id: number): Promise<IMeetingBook>;

    addMeetingBook(meetingBook: IMeetingBook): Promise<IMeetingBook>;

    updatingMeetingBook(meetingBook: IMeetingBook): Promise<any>;

    deleteMeetingBooks(deleteItems: Array<number>): Promise<void>;

    deleteMeetingBookItems(deleteItems: Array<number>): Promise<void>;


    getMeetingBookItems(meetingBookId: number): Promise<Array<IMeetingBookItem>>;

    addMeetingBookItemsBatch(items: Array<IMeetingBookItem>): Promise<Array<IMeetingBookItem>>;

    updateMeetingBookItemsBatch(items: Array<IMeetingBookItem>): Promise<Array<IMeetingBookItem>>;

    deleteMeetingBookItemsBatch(deleteItems: Array<number>): Promise<void>;

    updateMeetingBookLastUpdateDate(meetingBookId: number): Promise<any>;


    getWebsInSite(
        hubUrl: string, 
        sortBy: string, 
        sortDir: string): Promise<IODataPagedResult<IDocument>>;

    getLibrariesInWeb(
        absWebUrl: string, 
        sortBy: string, 
        sortDir: string, 
        searchTerm: string, 
        filteredItems: string[]): Promise<IODataPagedResult<IDocument>>;

    getLibraryItems(
        siteLeaf: string, 
        libraryName: string, 
        folderName: string, 
        sortField?: string, 
        sortDesc?: boolean, 
        searchTerm?: string): Promise<IODataPagedResult<IDocument>>;

    pageLibraryItems(
        siteUrl: string,
        libraryName: string,
        folderName: string,
        searchTerm?: string,
        href?: string
    ): Promise<IODataPagedResult<IDocument>>;

    getDocumentItem(odataId: string): Promise<IDocument>;


    saveFile(file: File, url: string, webUrl: string, fileName?: string, overwrite?: boolean): Promise<any>;

    deleteFile(files: Array<string>, webUrl: string): Promise<any>;

    cloneMeetingBook(meetingBookId: number): Promise<any>;
}