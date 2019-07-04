import * as _ from 'lodash';

import { 
    IAction
} from '../../../../models';

import { IMeetingBookListViewState, initialMeetingBookListViewState, PageLinks, NavLinks } from './meeting-book-list-view';
import * as actions from './MeetingBookListViewActions';

export const MeetingBookListViewReducer = 
    (state: IMeetingBookListViewState = initialMeetingBookListViewState, action: IAction): IMeetingBookListViewState => {
    
    switch (action.type) {
        case actions.EventTypes.INITIALIZE_MEETING_BOOK_LIST: {

            const initMeetingBookList = action as actions.InitializeMeetingBookList;

            const initMeetingBookListState: IMeetingBookListViewState = {
                ...state,
                initialized: false,
                loading: true,
                errors: null,
                items: []
            };

            return initMeetingBookListState;

        }
        case actions.EventTypes.MEETING_BOOK_LIST_INITIALIZED: {

            const meetingBookListInitialized = action as actions.MeetingBookInitialized;

            let prevs: NavLinks = {};
            prevs[0] = { prev: undefined, next: meetingBookListInitialized.payload.nextPage };

            const meetingBookListInitializedState: IMeetingBookListViewState = {
                ...state,
                initialized: true,
                loading: false,
                errors: _.cloneDeep(meetingBookListInitialized.error),
                items: _.cloneDeep(meetingBookListInitialized.payload.result),
                nextPage: meetingBookListInitialized.payload.nextPage,
                prevPage: undefined,
                pageNum: 0,
                prevPages: {...prevs}
            };

            return meetingBookListInitializedState;

        }
        case actions.EventTypes.FILTER_MEETING_BOOKS: {

            const filterMeetingBooks = action as actions.FilterMeetingBooks;

            const filterMeetingBooksState: IMeetingBookListViewState = {
                ...state,
                activeFilter: filterMeetingBooks.filter,
                loading: true,
                errors: null
            };

            return filterMeetingBooksState;

        }
        case actions.EventTypes.MEETING_BOOKS_FILTERED: {
            
            const meetingBooksFiltered = action as actions.MeetingBooksFiltered;

            let prevs: NavLinks = {};
            prevs[0] = { prev: undefined, next: meetingBooksFiltered.payload.nextPage };

            const meetingBooksFilteredState: IMeetingBookListViewState = {
                ...state,
                loading: false,
                errors: _.cloneDeep(meetingBooksFiltered.error),
                items: _.cloneDeep(meetingBooksFiltered.payload.result),
                nextPage: meetingBooksFiltered.payload.nextPage,
                prevPage: undefined,
                pageNum: 0,
                prevPages: {...prevs}
            };

            return meetingBooksFilteredState;
            
        }
        case actions.EventTypes.SORT_MEETING_BOOKS: {

            const sortMeetingBooks = action as actions.SortMeetingBooks;

            const sortMeetingBooksState: IMeetingBookListViewState = {
                ...state,
                sortField: sortMeetingBooks.sortField,
                sortAscending: sortMeetingBooks.sortAscending,
                loading: true,
                errors: null
            };

            return sortMeetingBooksState;

        }
        case actions.EventTypes.MEETING_BOOKS_SORTED: {
            
            const meetingBooksSorted = action as actions.MeetingBooksSorted;

            let prevs: NavLinks = {};
            prevs[0] = { prev: undefined, next: meetingBooksSorted.payload.nextPage };

            const meetingBooksSortedState: IMeetingBookListViewState = {
                ...state,
                loading: false,
                errors: _.cloneDeep(meetingBooksSorted.error),
                items: _.cloneDeep(meetingBooksSorted.payload.result),
                nextPage: meetingBooksSorted.payload.nextPage,
                prevPage: undefined,
                pageNum: 0,
                prevPages: {...prevs}
            };

            return meetingBooksSortedState;

        }
        case actions.EventTypes.PAGE_MEETING_BOOKS: {

            const pageMeetingBooks = action as actions.PageMeetingBooks;

            const sortMeetingBooksState: IMeetingBookListViewState = {
                ...state,
                loading: true,
                errors: null
            };

            return sortMeetingBooksState;

        }
        case actions.EventTypes.MEETING_BOOKS_PAGEDONE: {
            
            const pageMeetingBooks = action as actions.MeetingBooksPagingDone;

            const currLinks = state.prevPages;

            let pageLink: PageLinks = currLinks[pageMeetingBooks.pageNum];
            if (!pageLink) {
                if (pageMeetingBooks.pageNum === 1) {
                    pageLink = { prev: 'default', next: pageMeetingBooks.payload.nextPage };
                }
                else {
                    pageLink = { prev: currLinks[pageMeetingBooks.pageNum-2].next, next: pageMeetingBooks.payload.nextPage };
                }

                currLinks[pageMeetingBooks.pageNum] = pageLink;
            }

            const meetingBooksSortedState: IMeetingBookListViewState = {
                ...state,
                loading: false,
                errors: _.cloneDeep(pageMeetingBooks.error),
                items: _.cloneDeep(pageMeetingBooks.payload.result),
                nextPage: pageLink.next, 
                prevPage: pageLink.prev, 
                pageNum: pageMeetingBooks.pageNum,
                prevPages: {...currLinks}
            };

            return meetingBooksSortedState;
        }
        case actions.EventTypes.OPEN_NEW_MEETING_BOOK_FORM: {

            const openNewFormState: IMeetingBookListViewState = {
                ...state,
                showNewItemForm: true
            };

            return openNewFormState;

        }
        case actions.EventTypes.CLOSE_NEW_MEETING_BOOK_FORM: {

            const closeNewFormState: IMeetingBookListViewState = {
                ...state,
                showNewItemForm: false
            };

            return closeNewFormState;
            
        }
        case actions.EventTypes.ADD_MEETING_BOOK: {

            const addMb = action as actions.AddMeetingBook;

            const addMbState: IMeetingBookListViewState = {
                ...state,
                loading: true,
                errors: null
            };

            return addMbState;

        }
        case actions.EventTypes.MEETING_BOOK_ADDED: {

            const mbAdded = action as actions.MeetingBookAdded;

            const newItems = [ ...state.items ];
            newItems.push(mbAdded.payload);

            const mbAddedState: IMeetingBookListViewState = {
                ...state,
                loading: false,
                errors: _.cloneDeep(mbAdded.error),
                items: newItems
            };

            return mbAddedState;

        }
        case actions.EventTypes.DELETE_MEETING_BOOKS: {

            const deleteMeetingBooks = action as actions.DeleteMeetingBook;

            const items = _.differenceWith(
                state.items, 
                deleteMeetingBooks.meetingBookIds,
                (arrVal, othVal) => arrVal.Id === othVal
            );

            const deleteMeetingBooksState: IMeetingBookListViewState = {
                ...state,
                loading: true,
                items
            };

            return deleteMeetingBooksState;

        }
        case actions.EventTypes.MEETING_BOOKS_DELETED: {

            const meetingBooksDeleted = action as actions.MeetingBookAdded;

            const meetingBookDeletedState: IMeetingBookListViewState = {
                ...state,
                loading:false,
                errors: _.cloneDeep(meetingBooksDeleted.error)
            };

            return meetingBookDeletedState;
            
        }
        case actions.EventTypes.CLONE_MEETING_BOOKS: {

            const cloneMeetingBook = action as actions.CloneMeetingBook;
            
            const cloneMeetingBooksState: IMeetingBookListViewState = {
                ...state,
                loading: true
            };

            return cloneMeetingBooksState;

        }
        case actions.EventTypes.MEETING_BOOKS_CLONED: {

            const meetingBookCloned = action as actions.MeetintBookCloned;

            const newItems = [ _.cloneDeep(meetingBookCloned.payload), ...state.items ];

            const meetingBookDeletedState: IMeetingBookListViewState = {
                ...state,
                loading:false,
                errors: _.cloneDeep(meetingBookCloned.error),
                items: newItems
            };

            return meetingBookDeletedState;
            
        }

        default: {
            return state;
        }
    }
};
