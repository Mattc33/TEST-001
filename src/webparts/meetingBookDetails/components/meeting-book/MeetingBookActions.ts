import { ICompletedAction, ITriggerAction, IAction } from '../../../../models';
import { IMeetingBook, IMeetingBookItem, MeetingBookType } from '../../../../models';

export const EventTypes = {

    INITIALIZE_MEETING_BOOK: 'Meeting_Book/INITIALIZE_MEETING_BOOK',
    MEETING_BOOK_INITIALIZED: 'Meeting_Book/MEETING_BOOK_INITIALIZED',
    GET_MEETING_BOOK: 'Meeting_Book/GET_MEETING_BOOK',
    GOT_MEETING_BOOK: 'Meeting_Book/GOT_MEETING_BOOK',
    GET_MEETING_BOOK_ITEMS: 'Meeting_Book/GET_MEETING_BOOK_ITEMS',
    GOT_MEETING_BOOK_ITEMS: 'Meeting_Book/GOT_MEETING_BOOK_',
    SELECT_ITEM: 'Meeting_Book/SELECT_ITEM',
    ITEM_SELECTED: 'Meeting_Book/ITEM_SELECTED'
    
};

export interface InitializeMeetingBook extends ITriggerAction {
    meetingBookId: number;
}

export interface MeetingBookInitialized extends ICompletedAction<IMeetingBook> {
    items: Array<IMeetingBookItem>;
    selectedItem: any;
}

export interface GetMeetingBook extends ITriggerAction {
    id: number;
}

export interface GotMeetingBook extends ICompletedAction<IMeetingBook> {
    
}

export interface GetMeetingBookItems extends ITriggerAction {
    meetingBookId: number;
}

export interface GotMeetingBookItems extends ICompletedAction<Array<IMeetingBookItem>> {
}

export interface ChangeView extends ITriggerAction {
    view: MeetingBookType;
}

export interface SelectItem extends ITriggerAction {
    item: IMeetingBookItem;
}

export interface ItemSelected extends ICompletedAction<IMeetingBookItem> {

}