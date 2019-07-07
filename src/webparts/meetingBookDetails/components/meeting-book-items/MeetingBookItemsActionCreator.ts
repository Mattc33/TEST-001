import * as React from 'react';
import { Dispatch } from 'react-redux';
import * as _ from 'lodash';

import { 
    IAction, 
    IMeetingBook, 
    IMeetingBookItem, 
    MeetingBookViewType 
} from '../../../../models';

import { IRootState } from '../../reducer';

import * as actions from './MeetingBookItemsActions';

export default class MeetingBookItemsActionCreator {

    private _dispatch: Dispatch<IRootState>;

    constructor(dispatch: Dispatch<IRootState>) {

        this._dispatch = dispatch;

    }

    public getMeetingBookItems(meetingBookId: number) {

        this._dispatch({
            type: actions.EventTypes.GET_MEETING_BOOK_ITEMS,
            meetingBookId,
            nextAction: actions.EventTypes.GOT_MEETING_BOOK_ITEMS
        });
    }

    public reorderMeetingBookItems(meetingBookId: number, items: Array<IMeetingBookItem>) {
        this._dispatch({
            type: actions.EventTypes.REORDER_MEETING_BOOK_ITEMS,
            meetingBookId,
            items
        });
    }

    public deleteMeetingBookItems(meetingBookItemIds: Array<number>) {

        this._dispatch({
            type: actions.EventTypes.DELETE_MEETING_BOOK_ITEM,
            meetingBookItemIds
        });
        
    }

    public selectMeetingBookItem(id: number) {
        this._dispatch({
            type: actions.EventTypes.SELECT_MEETING_BOOK_ITEM,
            id
        });
    }

    public unselectMeetingBookItem(id: number) {
        this._dispatch({
            type: actions.EventTypes.UNSELECT_MEETING_BOOK_ITEM,
            id
        });
    }

    public openAddItemForm() {
        this._dispatch({
            type: actions.EventTypes.OPEN_ADD_ITEM_FORM
        });
    }

    public closeAddItemForm() {
        this._dispatch({
            type: actions.EventTypes.CLOSE_ADD_ITEM_FORM
        });
    }

    public addMeetingBookItem(item: Array<IMeetingBookItem>) {
        this._dispatch({
            type: actions.EventTypes.ADD_MEETING_BOOK_ITEM,
            items: [...item]
        });
    }

}