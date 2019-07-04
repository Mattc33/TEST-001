import { takeLatest, takeEvery, delay } from 'redux-saga';
import { fork, call, put, select, all, take } from 'redux-saga/effects';
import * as _ from 'lodash';

import {
    IMeetingBookItem,
    IDocument,
    IBreadcrumbKey
} from '../../../models';
import { IMeetingBookService } from '../../../services';
import { IRootState } from '../reducer';

import * as meetingBookManagerActions from '../components/meeting-book-manager/MeetingBookManagerActions';
import * as meetingBookItemsActions from '../components/meeting-book-items/MeetingBookItemsActions';
import * as meetingBookAddItemsActions from '../components/meeting-book-add-items/MeetingBookAddItemsActions';
import * as meetingBookActions from '../components/meeting-book/MeetingBookActions';

import { IMeetingBookAddItemsState } from '../components/meeting-book-add-items/meeting-book-add-items';
import { IBreadcrumbItem } from 'office-ui-fabric-react/lib/Breadcrumb';

var config: any = require('../config.json');
// import config from '../config.json';

export default function* meetingBookRootSaga(
    mbService: IMeetingBookService,
    siteAbsUrl: string,
    siteRelUrl: string,
    hubUrl: string
): IterableIterator<any> {

    yield [
        takeLatest(meetingBookManagerActions.EventTypes.GET_MEETING_BOOK, loadMeetingBook, mbService),
        takeLatest(meetingBookManagerActions.EventTypes.SAVE_MEETING_BOOK, saveMeetingBook, mbService),
        takeLatest(meetingBookItemsActions.EventTypes.GET_MEETING_BOOK_ITEMS, getMeetingBookItems, mbService),
        takeLatest(meetingBookItemsActions.EventTypes.REORDER_MEETING_BOOK_ITEMS, reorderMeetingBookItems, mbService),
        takeLatest(meetingBookItemsActions.EventTypes.DELETE_MEETING_BOOK_ITEM, deleteMeetingBookItems, mbService),
        takeLatest(meetingBookItemsActions.EventTypes.ADD_MEETING_BOOK_ITEM, addMeetingBookItems, mbService),
        takeLatest(meetingBookAddItemsActions.EventTypes.MOVE_UP_FOLDER, moveFolder, mbService),
        takeLatest(meetingBookAddItemsActions.EventTypes.MOVE_DOWN_FOLDER, moveFolder, mbService),
        takeLatest(meetingBookAddItemsActions.EventTypes.RETRIEVE_LIBRARY_ITEMS, retrieveLibraryItems, siteAbsUrl, siteRelUrl, hubUrl, mbService),
        takeLatest(meetingBookActions.EventTypes.INITIALIZE_MEETING_BOOK, initMeetingBookView, mbService),
        takeLatest(meetingBookActions.EventTypes.SELECT_ITEM, selectMeetingBookItem, mbService),
        takeLatest(meetingBookAddItemsActions.EventTypes.SAVE_FILE, saveFile, mbService),
        takeLatest(meetingBookAddItemsActions.EventTypes.DELETE_FILE, deleteFile, mbService)
    ];
}

function* initMeetingBookView(service: IMeetingBookService, action: meetingBookActions.InitializeMeetingBook) {

    try {

        const [meetingBook, meetingBookItems] = yield all([
            call(service.getMeetingBook, action.meetingBookId),
            call(service.getMeetingBookItems, action.meetingBookId)
        ]);

        const selectedItem = _.find(meetingBookItems, (i: IMeetingBookItem) => !i.OpenInNewTab);

        yield put({
            type: action.nextAction,
            payload: meetingBook,
            items: meetingBookItems,
            error: null,
            selectedItem: selectedItem || null
        });

    } catch (err) {

        let errorMessage = err.message;

        if (err.message.indexOf('404') > -1)
            errorMessage = 'Meeting book not found.';

        yield put({
            type: action.nextAction,
            payload: null,
            items: null,
            selectedItem: null,
            error: [errorMessage]
        });

    }

}

function* selectMeetingBookItem(service: IMeetingBookService, action: meetingBookActions.SelectItem) {

    try {

        yield put({
            type: action.nextAction,
            payload: action.item,
            error: null
        });

    } catch (err) {

        yield put({
            type: action.nextAction,
            payload: null,
            error: [err.message]
        });

    }
}

function* loadMeetingBook(
    service: IMeetingBookService,
    action: meetingBookManagerActions.GetMeetingBook | meetingBookActions.GetMeetingBook) {

    try {

        const meetingBook = yield call(service.getMeetingBook, action.id);

        yield put({
            type: action.nextAction,
            error: null,
            payload: meetingBook
        });

    } catch (err) {

        yield put({
            type: action.nextAction,
            error: [err.message],
            payload: null
        });

    }

}

function* saveMeetingBook(service: IMeetingBookService, action: meetingBookManagerActions.SaveMeetingBook) {

    try {

        const meetingBook = yield call(service.updatingMeetingBook, action.meetingBook);

        if (action.meetingBook && action.meetingBook.Id) {
            const updateResult = yield call(service.updateMeetingBookLastUpdateDate, action.meetingBook.Id);
        }

        yield put({
            type: meetingBookManagerActions.EventTypes.MEETING_BOOK_SAVED,
            payload: meetingBook,
            error: null
        });

        yield put({
            type: meetingBookManagerActions.EventTypes.TOGGLE_EDIT_FORM,
            editMode: false
        });


    } catch (err) {

        yield put({
            type: meetingBookManagerActions.EventTypes.MEETING_BOOK_SAVED,
            payload: action.meetingBook,
            error: [err.message]
        });

    }
}

function* reorderMeetingBookItems(service: IMeetingBookService, action: meetingBookItemsActions.ReorderMeetingBookItems) {

    try {

        const reorderedItems = yield call(service.updateMeetingBookItemsBatch, action.items);

        yield put({
            type: meetingBookItemsActions.EventTypes.MEETING_BOOK_ITEMS_REORDERED,
            error: null,
            payload: reorderedItems,
            meetingBookId: action.meetingBookId
        });

    } catch (err) {
        yield put({
            type: meetingBookItemsActions.EventTypes.MEETING_BOOK_ITEMS_REORDERED,
            error: [err.message],
            payload: action.items,
            meetingBookId: action.meetingBookId
        });
    }

}

function* getMeetingBookItems(
    service: IMeetingBookService,
    action: meetingBookItemsActions.GetMeetingBookItems | meetingBookActions.GetMeetingBookItems) {

    try {

        const items = yield call(service.getMeetingBookItems, action.meetingBookId);

        yield put({
            type: action.nextAction,
            error: null,
            payload: items
        });

    } catch (err) {
        yield put({
            type: action.nextAction,
            error: [err.message],
            payload: null
        });
    }

}

function* deleteMeetingBookItems(service: IMeetingBookService, action: meetingBookItemsActions.DeleteMeetingBookItem) {

    try {
        const state: IRootState = yield select();

        const deletedItemId = yield call(service.deleteMeetingBookItemsBatch, action.meetingBookItemIds);

        if (state.meetingBookState && state.meetingBookState.meetingBook && state.meetingBookState.meetingBook.Id) {
            const updateResult = yield call(service.updateMeetingBookLastUpdateDate, state.meetingBookState.meetingBook.Id);
        }

        yield put({
            type: meetingBookItemsActions.EventTypes.MEETING_BOOK_ITEM_DELETED,
            payload: deletedItemId,
            error: null
        });

        yield put({
            type: meetingBookItemsActions.EventTypes.REORDER_MEETING_BOOK_ITEMS,
            items: state.meetingBookItemsState.items
        });

        const reorderedItems = yield call(service.updateMeetingBookItemsBatch, state.meetingBookItemsState.items);

        yield put({
            type: meetingBookItemsActions.EventTypes.MEETING_BOOK_ITEMS_REORDERED,
            error: null,
            payload: reorderedItems
        });

    } catch (err) {
        yield put({
            type: meetingBookItemsActions.EventTypes.MEETING_BOOK_ITEM_DELETED,
            payload: action.meetingBookItemIds,
            error: [err.mesage]
        });
    }
}

function* addMeetingBookItems(service: IMeetingBookService, action: meetingBookItemsActions.AddMeetingBookItem) {

    try {

        const addedItems = yield call(service.addMeetingBookItemsBatch, action.items);

        if (action.items && action.items.length > 0 && action.items[0].MeetingBookId) {
            const updateResult = yield call(service.updateMeetingBookLastUpdateDate, action.items[0].MeetingBookId);
        }

        yield put({
            type: meetingBookItemsActions.EventTypes.MEETING_BOOK_ITEM_ADDED,
            payload: addedItems,
            error: null
        });

        yield put({
            type: meetingBookItemsActions.EventTypes.CLOSE_ADD_ITEM_FORM
        });

    } catch (err) {

        yield put({
            type: meetingBookItemsActions.EventTypes.MEETING_BOOK_ITEM_ADDED,
            payload: null,
            error: [err.message]
        });

    }
}

function* moveFolder(service: IMeetingBookService, action: meetingBookAddItemsActions.MoveFolder) {

    const state: IMeetingBookAddItemsState = yield select((s: IRootState) => s.meetingBookAddItemsState);

    const retrieveItemAction: meetingBookAddItemsActions.RetrieveLibraryItems = {
        type: meetingBookAddItemsActions.EventTypes.RETRIEVE_LIBRARY_ITEMS,
        folder: state.breadcrumb,
        sortField: state.sortField,
        sortDesc: state.sortDesc
    };

    yield put(retrieveItemAction);

}

function* saveFile(service: IMeetingBookService, action: meetingBookAddItemsActions.SaveFile) {
    try {
        const mbState: IMeetingBookAddItemsState = yield select((s: IRootState) => s.meetingBookAddItemsState);
        const { file, item } = action;
        let { Url, IsFolder } = item;

        if (!IsFolder) {
            Url = Url.substring(0, Url.lastIndexOf("/"));
        }

        const urlParser = document.createElement('a');
        urlParser.href = Url;
        Url = urlParser.pathname;
        if (Url[Url.length - 1] != '/') {
            Url += '/';
        }
        //IE 11 fix
        if (Url[0] != '/') {
            Url = '/' + Url;
        }

        //JA: find the web URL
        const webItem: IBreadcrumbItem = mbState.breadcrumb.find((bcItem: IBreadcrumbItem): boolean => {
            const key: IBreadcrumbKey = JSON.parse(bcItem.key);
            return (key.IsSite && key.IsFolder); //return web
        });

        if (!webItem) {
            yield put({
                type: meetingBookAddItemsActions.EventTypes.FILE_SAVED,
                error: "Web url not found"
            });
        }
        else {
            const webItemKey: IBreadcrumbKey = JSON.parse(webItem.key);

            const result = yield call(
                service.saveFile,
                file,
                Url,
                webItemKey.Url
            );

            yield delay(1000);

            yield put({
                type: meetingBookAddItemsActions.EventTypes.FILE_SAVED,
                error: undefined
            });

            yield delay(500);

            yield put({
                type: meetingBookAddItemsActions.EventTypes.RETRIEVE_LIBRARY_ITEMS,
                folder: action.folder,
                sortField: action.sortField,
                sortDesc: action.sortDesc
            });
        }

    } catch (err) {
        yield put({
            type: meetingBookAddItemsActions.EventTypes.FILE_SAVED,
            error: err.message
        });

    }
}

function* deleteFile(service: IMeetingBookService, action: meetingBookAddItemsActions.DeleteFile) {

    try {
        const mbState: IMeetingBookAddItemsState = yield select((s: IRootState) => s.meetingBookAddItemsState);

        //JA: find the web URL
        const webItem: IBreadcrumbItem = mbState.breadcrumb.find((bcItem: IBreadcrumbItem): boolean => {
            const key: IBreadcrumbKey = JSON.parse(bcItem.key);
            return (key.IsSite && key.IsFolder); //return web
        });

        if (!webItem) {
            yield put({
                type: meetingBookAddItemsActions.EventTypes.FILE_DELETED,
                error: "Web url not found"
            });
        }
        else {
            const webItemKey: IBreadcrumbKey = JSON.parse(webItem.key);

            const result = yield call(
                service.deleteFile,
                action.files,
                webItemKey.Url
            );

            yield delay(1500);

            yield put({
                type: meetingBookAddItemsActions.EventTypes.RETRIEVE_LIBRARY_ITEMS,
                folder: action.folder,
                sortField: action.sortField,
                sortDesc: action.sortDesc
            });
        }
    } catch (err) {
        yield put({
            type: meetingBookAddItemsActions.EventTypes.FILE_DELETED,
            error: err.message
        });
    }
}

function* retrieveLibraryItems(siteAbsUrl: string, siteRelUrl: string, hubUrl: string, service: IMeetingBookService, action: meetingBookAddItemsActions.RetrieveLibraryItems) {
    try {

        const folderPath: string = action.folder ? action.folder.reduce((result, value, idx, arr) => {

            const key: IBreadcrumbKey = JSON.parse(value.key);

            if (key.IsSite)
                return result;

            if (key.IsLibrary) {

                const relUrl = key.Url.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '/');
                return `${relUrl}`;
            }

            result += `/${value.text}`;

            return result;

        }, '') : '';

        let items = [];

        if (action.folder.length === 1) { // this is home
            items = yield call(
                service.getWebsInSite,
                hubUrl,
                action.sortField,
                action.sortDesc ? 'desc' : 'asc',
                action.searchTerm
            );
        } else if (action.folder.length === 2) { // this a (sub)site
            const key: IBreadcrumbKey = JSON.parse(action.folder[1].key);

            items = yield call(
                service.getLibrariesInWeb,
                key.Url, // name of the library
                action.sortField,
                action.sortDesc ? 'desc' : 'asc',
                action.searchTerm,
                config.excludedFolderNames
            );
        } else if (action.folder.length > 2) { // this is a library and folders

            const libKey: IBreadcrumbKey = JSON.parse(action.folder[2].key);
            const siteKey: IBreadcrumbKey = JSON.parse(action.folder[1].key);

            items = yield call(
                service.getLibraryItems,
                siteKey.Url,
                libKey.Title,
                folderPath,
                action.sortField,
                action.sortDesc,
                action.searchTerm
            );

        }

        yield put({
            type: meetingBookAddItemsActions.EventTypes.LIBRARY_ITEMS_RETRIEVED,
            payload: items,
            error: null
        });

    } catch (err) {

        yield put({
            type: meetingBookAddItemsActions.EventTypes.LIBRARY_ITEMS_RETRIEVED,
            payload: [],
            error: [err.message]
        });

    }
}

// TODO
function* nextPage(service: IMeetingBookService, action: any) {

    try {

        const { href } = action;

        const folderPath: string = action.folder ? action.folder.reduce((result, value, idx, arr) => {

            const key: IBreadcrumbKey = JSON.parse(value.key);

            if (key.IsSite)
                return result;

            if (key.IsLibrary) {

                const relUrl = key.Url.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '/');
                return `${relUrl}`;
            }

            result += `/${value.text}`;

            return result;

        }, '') : '';

        if (action.folder.length <= 2) { 
            throw new Error('Only document libraries support paging.');
        }

        const libKey: IBreadcrumbKey = JSON.parse(action.folder[2].key);
        const siteKey: IBreadcrumbKey = JSON.parse(action.folder[1].key);

        const items = yield call(
            service.pageLibraryItems,
            siteKey.Url,
            libKey.Title,
            folderPath,
            action.searchTerm,
            href
        );


    } catch (err) {

    }
}