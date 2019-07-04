import * as React from 'react';
import { Dispatch } from 'react-redux';
import * as _ from 'lodash';

import { IAction, IMeetingBook, MeetingBookViewType } from '../../../../models';

import { IRootState } from '../../reducer';

import * as actions from './MeetingBookManagerActions';

export default class MeetingBookManagerActionCreator {

    private _dispatch: Dispatch<IRootState>;

    constructor(dispatch: Dispatch<IRootState>) {

        this._dispatch = dispatch;

    }

    public changeLayoutView(view: MeetingBookViewType) {
        this._dispatch({
            type: actions.EventTypes.CHANGE_LAYOUT_VIEW,
            view
        });
    }

    public getMeetingBook(id: number) {

        this._dispatch({
            type: actions.EventTypes.GET_MEETING_BOOK,
            id,
            nextAction: actions.EventTypes.GOT_MEETING_BOOK
        });

    }

    public toggleEdit(editMode: boolean) {

        this._dispatch({
            type: actions.EventTypes.TOGGLE_EDIT_FORM,
            editMode
        });

    }

    public saveMeetingBook(meetingBook: IMeetingBook) {

        this._dispatch({
            type: actions.EventTypes.SAVE_MEETING_BOOK,
            meetingBook
        });

    }

    public queryUsers(keyword: string) {

        this._dispatch({
            type: actions.EventTypes.QUERY_USERS,
            keyword
        });

    }

}