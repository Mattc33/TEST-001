import * as React from 'react';
import { Dispatch } from 'react-redux';
import * as _ from 'lodash';

import { IAction, IMeetingBook, MeetingBookFilterType } from '../../../../models';

import { IRootState } from '../../reducer';

import * as actions from './MeetingBookListViewActions';

export default class MeetingBookListViewActionCreator {

    private _dispatch: Dispatch<IRootState>;

    constructor(dispatch: Dispatch<IRootState>) {

        this._dispatch = dispatch;

    }

    public initializeMeetingBookList() {
        this._dispatch({
            type:actions.EventTypes.INITIALIZE_MEETING_BOOK_LIST,
            nextAction: actions.EventTypes.MEETING_BOOK_LIST_INITIALIZED
        });
    }

    public sortMeetingBooks(sortField: string, sortAscending: boolean) {
        this._dispatch({
            type: actions.EventTypes.SORT_MEETING_BOOKS,
            nextAction: actions.EventTypes.MEETING_BOOKS_SORTED,
            sortField: sortField,
            sortAscending: sortAscending
        });
    }

    public filterMeetingBooks(filter: MeetingBookFilterType) {

        this._dispatch({
            type: actions.EventTypes.FILTER_MEETING_BOOKS,
            nextAction: actions.EventTypes.MEETING_BOOKS_FILTERED,
            filter
        });

    }

    public pageMeetingBooks(nextPage: string, pageNum: number) {
        this._dispatch({
            type: actions.EventTypes.PAGE_MEETING_BOOKS,
            nextAction: actions.EventTypes.MEETING_BOOKS_PAGEDONE,
            nextPage,
            pageNum
        });
    }

    public openNewMeetingBookForm() {

        this._dispatch({
            type: actions.EventTypes.OPEN_NEW_MEETING_BOOK_FORM
        });

    }

    public closeMeetingBookForm() {

        this._dispatch({
            type: actions.EventTypes.CLOSE_NEW_MEETING_BOOK_FORM
        });
        
    }

    public addMeetingBook(meetingBook: IMeetingBook) {

        this._dispatch({
            type: actions.EventTypes.ADD_MEETING_BOOK,
            nextAction: actions.EventTypes.MEETING_BOOK_ADDED,
            meetingBook
        });
        
    }

    public deleteMeetingBooks(meetingBookIds: Array<number>) {

        this._dispatch({
            type: actions.EventTypes.DELETE_MEETING_BOOKS,
            nextAction: actions.EventTypes.MEETING_BOOKS_DELETED,
            meetingBookIds
        });
        
    }

    public cloneMeetingBook(meetingBookId: number) {

        this._dispatch({
            type: actions.EventTypes.CLONE_MEETING_BOOKS,
            nextAction: actions.EventTypes.MEETING_BOOKS_CLONED,
            meetingBookId
        });
        
    }

}