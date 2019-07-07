import { 
    ICompletedAction, 
    ITriggerAction,
    IAction, 
    IMeetingBook, 
    IMeetingBookItem, 
    MeetingBookViewType 
} from '../../../../models';

export const EventTypes = {

    GET_MEETING_BOOK_ITEMS: 'Meeting_Book_Items/GET_MEETING_BOOK_ITEMS',
    GOT_MEETING_BOOK_ITEMS: 'Meeting_Book_Items/GOT_MEETING_BOOK_',
    REORDER_MEETING_BOOK_ITEMS: 'Meeting_Book_Items/REORDER_MEETING_BOOK_ITEMS',
    MEETING_BOOK_ITEMS_REORDERED: 'Meeting_Book_Items/MEETING_BOOK_ITEMS_REORDERED',
    DELETE_MEETING_BOOK_ITEM: 'Meeting_Book_Items/DELETE_MEETING_BOOK_ITEM',
    MEETING_BOOK_ITEM_DELETED: 'Meeting_Book_Items/MEETING_BOOK_ITEM_DELETED',
    SELECT_MEETING_BOOK_ITEM: 'Meeting_Book_Items/SELECT_MEETING_BOOK_ITEM',
    UNSELECT_MEETING_BOOK_ITEM: 'Meeting_Book_Items/UNSELECT_MEETING_BOOK_ITEM',
    OPEN_ADD_ITEM_FORM: 'Meeting_Book_Items/OPEN_ADD_ITEM_FORM',
    CLOSE_ADD_ITEM_FORM: 'Meeting_Book_Items/CLOSE_ADD_ITEM_FORM',
    ADD_MEETING_BOOK_ITEM: 'Meeting_Book_Items/ADD_MEETING_BOOK_ITEM',
    MEETING_BOOK_ITEM_ADDED: 'Meeting_Book_Items/MEETING_BOOK_ITEM_ADDED'

};

export interface GetMeetingBookItems extends ITriggerAction {
    meetingBookId: number;
}

export interface GotMeetingBookItems extends ICompletedAction<Array<IMeetingBookItem>> {
}

export interface ReorderMeetingBookItems extends ITriggerAction {
    meetingBookId: number;
    items: Array<IMeetingBookItem>;
}

export interface MeetingBookItemsReordered extends ICompletedAction<Array<IMeetingBookItem>> {

}

export interface DeleteMeetingBookItem extends ITriggerAction {
    meetingBookItemIds: Array<number>;
}

export interface MeetingBookItemDeleted extends ICompletedAction<Array<number>> {

}

export interface SelectMeetingBookItem extends ITriggerAction {
    id: number;
}

export interface UnselectMeetingBookItem extends ITriggerAction {
    id: number;
}

export interface OpenAddItemForm extends ITriggerAction {

}

export interface CloseAddItemForm extends ITriggerAction {
    
}

export interface AddMeetingBookItem extends ITriggerAction {
    items: Array<IMeetingBookItem>;
}

export interface MeetingBookItemAdded extends ICompletedAction<Array<IMeetingBookItem>> {

}

