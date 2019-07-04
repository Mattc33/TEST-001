import * as _ from 'lodash';
import * as moment from 'moment';

import { 
    IAction,
    IMeetingBook, 
    initialMeetingBook,
    IMeetingBookItem,
    initialMeetingBookItem
} from '../../../../models';

import { IMeetingBookItemsState, initialMeetingBookItemsState } from './meeting-book-items';
import * as actions from './MeetingBookItemsActions';

export const MeetingBookItemsReducer = 
    (state: IMeetingBookItemsState = initialMeetingBookItemsState, action: IAction): IMeetingBookItemsState => {
    
    switch (action.type) {
        case actions.EventTypes.GET_MEETING_BOOK_ITEMS: {

            const getMeetingBookItems = action as actions.GetMeetingBookItems;

            const getMeetingBookItemsState = {
                ...state,
               loading: true,
               error: null
            };

            return getMeetingBookItemsState;

        }
        case actions.EventTypes.GOT_MEETING_BOOK_ITEMS: {

            const gotMeetingBookItems = action as actions.GotMeetingBookItems;

            const gotMeetingBookState = {
                ...state,
                loading: false,
                error: gotMeetingBookItems.error,
                items: _.cloneDeep(gotMeetingBookItems.payload)
            };

            return gotMeetingBookState;
            
        }
        case actions.EventTypes.REORDER_MEETING_BOOK_ITEMS: {

            const reorderMeetingBookItems = action as actions.ReorderMeetingBookItems;

            const orderedItems = reorderMeetingBookItems.items.map( (item, idx) => {
                return {
                    ...item,
                    Sequence: idx
                };
            });

            const reorderMeetingBookItemsState = {
                ...state,
                loading: true,
                items: orderedItems
            };

            return reorderMeetingBookItemsState;

        }
        case actions.EventTypes.MEETING_BOOK_ITEMS_REORDERED: {

            const meetingBookItemsReordered = action as actions.MeetingBookItemsReordered;

            const saveMeetingBookState = {
                ...state,
                loading: false,
                items: _.cloneDeep(meetingBookItemsReordered.payload),
                error: meetingBookItemsReordered.error
            };

            return saveMeetingBookState;

        }
        case actions.EventTypes.DELETE_MEETING_BOOK_ITEM: {

            const deleteMeetingBookItem = action as actions.DeleteMeetingBookItem;

            const items = _.differenceWith(
                state.items, 
                deleteMeetingBookItem.meetingBookItemIds,
                (arrVal, othVal) => arrVal.Id === othVal
            );

            const selectedItems = _.difference(
                state.selectedItems,
                deleteMeetingBookItem.meetingBookItemIds
            );

            const deleteMeetingBookItemState = {
                ...state,
                items,
                selectedItems,
                loading: true
            };

            return deleteMeetingBookItemState;

        }
        case actions.EventTypes.MEETING_BOOK_ITEM_DELETED: {
            
            const meetingBookItemDeleted = action as actions.MeetingBookItemDeleted;

            const meetingBookItemDeletedState = {
                ...state,
                loading: false,
                error: meetingBookItemDeleted.error
            };

            return meetingBookItemDeletedState;

        }
        case actions.EventTypes.SELECT_MEETING_BOOK_ITEM: {
            
            const selectItem = action as actions.SelectMeetingBookItem;
            
            const selectedItems = _.union(state.selectedItems, [selectItem.id]);
            const selectItemState = {
                ...state,
                selectedItems
            };

            return selectItemState;
        }
        case actions.EventTypes.UNSELECT_MEETING_BOOK_ITEM: {

            const unselectItem = action as actions.UnselectMeetingBookItem;
            
            const selectedItems = 
                _.filter(
                    state.selectedItems, 
                    i => i !== unselectItem.id);
            const unselectItemState = {
                ...state,
                selectedItems
            };

            return unselectItemState;

        }
        case actions.EventTypes.OPEN_ADD_ITEM_FORM: {
            
            const openAddItemFormState = {
                ...state,
                addItemFormOpen: true
            };

            return openAddItemFormState;
            
        }
        case actions.EventTypes.CLOSE_ADD_ITEM_FORM: {

            const closeAddItemFormState = {
                ...state,
                addItemFormOpen: false
            };

            return closeAddItemFormState;

        }
        case actions.EventTypes.ADD_MEETING_BOOK_ITEM: {

            const addItemState = {
                ...state,
                loading: true
            };

            return addItemState;

        }
        case actions.EventTypes.MEETING_BOOK_ITEM_ADDED: {

            const itemAdded = action as actions.MeetingBookItemAdded;

            const newItems = 
                _.unionWith(
                    state.items, 
                    itemAdded.payload, 
                    (arrVal, othVal) => arrVal.Id === othVal.Id);

            const itemAddedState = {
                ...state,
                loading: false,
                error: itemAdded.error,
                addItemFormOpen: true,
                items: newItems   
            };

            return itemAddedState;

        }
        default: {
            return state;
        }
    }
};
