import { takeLatest, takeEvery } from 'redux-saga';
import { fork, call, put, select, all, take } from 'redux-saga/effects';

import { IMeetingBookItem, IDocument } from '../../../models';
import { IMeetingBookService } from '../../../services';
import { IRootState } from '../reducer';

import * as meetingBookListViewActions from '../components/meeting-book-list-view/MeetingBookListViewActions'; 


export default function* meetingBookListViewRootSaga(
    mbService: IMeetingBookService,
    rootUrl: string
): IterableIterator<any> {

    yield [
        takeLatest(meetingBookListViewActions.EventTypes.INITIALIZE_MEETING_BOOK_LIST, initiliazeMeetingBookList, mbService),
        takeLatest(meetingBookListViewActions.EventTypes.FILTER_MEETING_BOOKS, filterMeetingBooks, mbService),
        takeLatest(meetingBookListViewActions.EventTypes.SORT_MEETING_BOOKS, sortMeetingBooks, mbService),
        takeLatest(meetingBookListViewActions.EventTypes.PAGE_MEETING_BOOKS, pageMeetingBooks, mbService),
        takeLatest(meetingBookListViewActions.EventTypes.ADD_MEETING_BOOK, addMeetingBook, mbService, rootUrl),
        takeLatest(meetingBookListViewActions.EventTypes.DELETE_MEETING_BOOKS, deleteMeetingBooks, mbService),
        takeLatest(meetingBookListViewActions.EventTypes.CLONE_MEETING_BOOKS, cloneMeetingBook, mbService)
    ];
}

function* initiliazeMeetingBookList(service: IMeetingBookService, action: meetingBookListViewActions.InitializeMeetingBookList) {

    try {

        const items = yield call(service.getMeetingBooks);

        yield put({
            type: action.nextAction,
            payload: items,
            error: null
        });

    } catch( err ) {

        yield put({
            type: action.nextAction,
            error: [ err.message ],
            payload: []
        });

    }
}

function* filterMeetingBooks(service: IMeetingBookService, action: meetingBookListViewActions.FilterMeetingBooks) {

    try {
        const state: IRootState = yield select();

        const items = yield call(
            service.getMeetingBooks, 
            action.filter, 
            state.meetingBookListViewState.sortField,
            state.meetingBookListViewState.sortAscending
        );

        yield put({
            type: action.nextAction,
            filter: action.filter,
            payload: items,
            error: null
        });

    } catch ( err) {
        yield put({
            type: action.nextAction,
            filter: action.filter,
            payload: [],
            error: [ err.message ]
        });
    }

}

function* sortMeetingBooks(service: IMeetingBookService, action: meetingBookListViewActions.SortMeetingBooks) {

    try {
        const state: IRootState = yield select();

        const items = yield call(
            service.getMeetingBooks, 
            state.meetingBookListViewState.activeFilter,
            action.sortField,
            action.sortAscending
        );

        yield put({
            type: action.nextAction,
            sortField: action.sortField,
            sortAscending: action.sortAscending,
            payload: items,
            error: null
        });

    } catch ( err) {
        yield put({
            type: action.nextAction,
            sortField: action.sortField,
            sortAscending: action.sortAscending,
            payload: [],
            error: [ err.message ]
        });
    }

}

function* pageMeetingBooks(service: IMeetingBookService, action: meetingBookListViewActions.PageMeetingBooks) {

    try {
        const state: IRootState = yield select();

        const items = (action.pageNum === 0 || action.nextPage === 'default') 
        ? yield call(
            service.getMeetingBooks, 
            state.meetingBookListViewState.activeFilter,
            state.meetingBookListViewState.sortField,
            state.meetingBookListViewState.sortAscending)
        : yield call(
            service.getPagedMeetingBooks, 
            action.nextPage
        );

        yield put({
            type: action.nextAction,
            payload: items,
            pageNum: action.pageNum,
            error: null
        });

    } catch ( err) {
        yield put({
            type: action.nextAction,
            payload: [],
            error: [ err.message ]
        });
    }

}

function* addMeetingBook(service: IMeetingBookService, rootUrl: string, action: meetingBookListViewActions.AddMeetingBook) {

    try {

        const state: IRootState = yield select();

        const meetingBook = yield call(service.addMeetingBook, action.meetingBook);

        yield put({
            type: action.nextAction,
            payload: meetingBook,
            error: null
        });

        window.location.href = `${rootUrl}/SitePages/MeetingBook.aspx?wmg_mbid=${meetingBook.Id}&wmg_view=compile`;

    } catch ( err ) {

        yield put({
            type: action.nextAction,
            payload: null,
            error: [ err.message ]
        });

    }

    yield put({
        type: meetingBookListViewActions.EventTypes.CLOSE_NEW_MEETING_BOOK_FORM
    });

}

function* deleteMeetingBooks(service: IMeetingBookService, action: meetingBookListViewActions.DeleteMeetingBook) {

    try {

        yield call(service.deleteMeetingBooks, action.meetingBookIds);

        yield put({
            type: action.nextAction,
            error: null
        });

    } catch ( err ) {

        yield put({
            type: action.nextAction,
            error: [ err.message ]
        });

    }

}

function* cloneMeetingBook(service: IMeetingBookService, action: meetingBookListViewActions.CloneMeetingBook) {

    try {

        const meetingBook = yield call(service.cloneMeetingBook, action.meetingBookId);

        yield put({
            type: action.nextAction,
            payload: meetingBook,
            error: null
        });

    } catch ( err ) {

        yield put({
            type: action.nextAction,
            error: [ err.message ]
        });

    }

}