import * as React from 'react';
import { Dispatch } from 'react-redux';
import * as _ from 'lodash';

import { IAction } from '../../../../models';

import { IRootState } from '../../reducer';
import { IMeetingBookItem } from '../../../../models';

import * as actions from './MeetingBookActions';

export default class MeetingBookActionCreator {

    private _dispatch: Dispatch<IRootState>;

    constructor(dispatch: Dispatch<IRootState>) {

        this._dispatch = dispatch;

    }

    public initializeMeetingBook(meetingBookId: number) {

        this._dispatch({
            type:actions.EventTypes.INITIALIZE_MEETING_BOOK,
            nextAction: actions.EventTypes.MEETING_BOOK_INITIALIZED,
            meetingBookId
        });
        
    }

    public getMeetingBook(meetingBookId: number) {

        this._dispatch({
            type: actions.EventTypes.GET_MEETING_BOOK,
            id: meetingBookId,
            nextAction: actions.EventTypes.GOT_MEETING_BOOK
        });
        
    }

    public getMeetingBookItems(meetingBookId: number) {

        this._dispatch({
            type: actions.EventTypes.GET_MEETING_BOOK_ITEMS,
            meetingBookId,
            nextAction: actions.EventTypes.GOT_MEETING_BOOK_ITEMS
        });

    }

    public selectItem(item: IMeetingBookItem) {

        this._dispatch({
            type:actions.EventTypes.SELECT_ITEM,
            nextAction: actions.EventTypes.ITEM_SELECTED,
            item
        });
        
    }

}