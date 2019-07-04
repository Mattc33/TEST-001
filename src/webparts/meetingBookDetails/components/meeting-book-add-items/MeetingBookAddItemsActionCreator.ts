import * as React from 'react';
import { Dispatch } from 'react-redux';
import * as _ from 'lodash';
import {
    IBreadcrumbItem
} from 'office-ui-fabric-react/lib/Breadcrumb';

import { IAction, IDocument } from '../../../../models';
import { IRootState } from '../../reducer';

import * as actions from './MeetingBookAddItemsActions';

export default class MeetingBookAddItemsActionCreator {

    private _dispatch: Dispatch<IRootState>;

    constructor(dispatch: Dispatch<IRootState>) {

        this._dispatch = dispatch;

    }

    public changeTab(tabId: string) {

        const changeTabAction: actions.ChangeTab = {
            type: actions.EventTypes.CHANGE_TAB,
            tabId
        };

        this._dispatch(changeTabAction);

    }

    public retrieveLibraryItems(
        folder?: Array<IBreadcrumbItem>, 
        sortField?: string,
        sortDesc?: boolean,
        searchTerm?: string
    ) {

        const retreiveItemsActions: actions.RetrieveLibraryItems = {
            type: actions.EventTypes.RETRIEVE_LIBRARY_ITEMS,
            folder,
            sortField,
            sortDesc,
            searchTerm
        };

        this._dispatch(retreiveItemsActions);

    }

    public saveFile(
        item: any,
        file: File,
        folder?: Array<IBreadcrumbItem>, 
        sortField?: string,
        sortDesc?: boolean
    ) {

        const saveFileAction: actions.SaveFile = {
            type: actions.EventTypes.SAVE_FILE,
            item: item,
            file: file,
            folder,
            sortField,
            sortDesc
        };

        this._dispatch(saveFileAction);

    }

    public deleteFile(
        files: Array<string>,
        folder?: Array<IBreadcrumbItem>, 
        sortField?: string,
        sortDesc?: boolean
    ) {

        const delFileAction: actions.DeleteFile = {
            type: actions.EventTypes.DELETE_FILE,
            files: files,
            folder,
            sortField,
            sortDesc
        };

        this._dispatch(delFileAction);
    }

    public saveFileFailed(error: string) {
        const saveFileFailedAction: actions.SaveFileFailed = {
            type: actions.EventTypes.FILE_SAVED,
            error: error
        };

        this._dispatch(saveFileFailedAction);
    }

    public deleteFileFailed(error: string) {
        const delFileFailedAction: actions.DeleteFileFailed = {
            type: actions.EventTypes.FILE_DELETED,
            error: error
        };

        this._dispatch(delFileFailedAction);
    }

    public moveUpIntoFolder(folder: IBreadcrumbItem) {

        const moveUpFolderAction: actions.MoveFolder = {
            type: actions.EventTypes.MOVE_UP_FOLDER,
            folder
        };

        this._dispatch(moveUpFolderAction);

    }

    public moveDownIntoFolder(folder: IBreadcrumbItem) {

        const moveDownFolderAction: actions.MoveFolder = {
            type: actions.EventTypes.MOVE_DOWN_FOLDER,
            folder
        };

        this._dispatch(moveDownFolderAction);

    }

    public selectionChange(selection: any) {

        const selectAction: actions.SelectionChange = {
            type: actions.EventTypes.SELECTION_CHANGE,
            selection
        };

        this._dispatch(selectAction);
        
    }

    public toggleModal(show: boolean, folder?: IBreadcrumbItem) {

        const toggleAction: actions.ToggleModal = {
            type: actions.EventTypes.TOGGLE_MODAL,
            show,
            folder
        };

        this._dispatch(toggleAction);

    }

    public clearBreadcrumb() {

        const clearBreadcrumb: actions.ClearBreadcrumb = {
            type:actions.EventTypes.CLEAR_BREADCRUMB
        };

        this._dispatch(clearBreadcrumb);
        
    }

    public loadPage(
        folder: Array<IBreadcrumbItem>, 
        searchTerm?: string,
        href?: string) {

            const pageChange: actions.PageItems = {
                type: actions.EventTypes.RETRIEVE_LIBRARY_ITEMS,
                folder,
                searchTerm,
                href
            };
    
            this._dispatch(pageChange);

    }

}