import { ICompletedAction, ITriggerAction, IAction, IDocument } from '../../../../models';
import {
    IBreadcrumbItem
} from 'office-ui-fabric-react/lib/Breadcrumb';
import { IODataPagedResult } from '../../../../models/sharepoint/IODataPagedResult';

export const EventTypes = {

    CHANGE_TAB: 'Meeting_Book_Add_Items/CHANGE_TAB',
    RETRIEVE_LIBRARY_ITEMS: 'Meeting_Book_Add_Items/RETRIEVE_LIBRARY_ITEMS',
    LIBRARY_ITEMS_RETRIEVED: 'Meeting_Book_Add_Items/LIBRARY_ITEMS_RETRIEVED',
    PAGE_ITEMS: 'Meeting_Book_Add_Items/PAGE_ITEMS',
    PAGE_RETRIEVED: 'Meeting_Book_Add_Items/PAGE_RETRIEVED',
    CLEAR_BREADCRUMB: 'Meeting_Book_Add_Items/CLEAR_BREADCRUMB',
    MOVE_UP_FOLDER: 'Meeting_Book_Add_Items/MOVE_UP_FOLDER',
    MOVE_DOWN_FOLDER: 'Meeting_Book_Add_Items/MOVE_DOWN_FOLDER',
    SELECTION_CHANGE: 'Meeting_Book_Add_Items/SELECTION_CHANGE',
    TOGGLE_MODAL: 'Meeting_Book_Add_Items/TOGGLE_MODAL',
    SAVE_FILE: 'Meeting_Book_Add_Items/SAVE_FILE',
    FILE_SAVED: 'Meeting_Book_Add_Items/FILE_SAVED',
    DELETE_FILE: 'Meeting_Book_Add_Items/DELETE_FILE',
    FILE_DELETED: 'Meeting_Book_Add_Items/FILE_DELETED'
};

export interface ChangeTab extends ITriggerAction {
    tabId: string;
}

export interface RetrieveLibraryItems extends ITriggerAction {
    folder?: Array<IBreadcrumbItem>;
    sortField?: string;
    sortDesc?: boolean;
    searchTerm?: string;
}

export interface SaveFile extends RetrieveLibraryItems {
    item: any;
    file: File;
}

export interface DeleteFile extends RetrieveLibraryItems {
    files: Array<string>;
}

export interface SaveFileFailed extends ITriggerAction {
    error: string;
}

export interface DeleteFileFailed extends ITriggerAction {
    error: string;
}

export interface LibraryItemsRetrieved extends ICompletedAction<IODataPagedResult<IDocument>> {

}

export interface PageItems extends ITriggerAction {

    folder?: Array<IBreadcrumbItem>;
    searchTerm?: string;
    href: string;

}

export interface PageRetrieved extends ICompletedAction<IODataPagedResult<IDocument>> {
    
}

export interface MoveFolder extends ITriggerAction {
    folder: IBreadcrumbItem;
}

export interface SelectionChange extends ITriggerAction {
    selection: any;
}

export interface ToggleModal extends ITriggerAction {
    show: boolean;
    folder?: IBreadcrumbItem;
}

export interface ClearBreadcrumb extends ITriggerAction {

}
