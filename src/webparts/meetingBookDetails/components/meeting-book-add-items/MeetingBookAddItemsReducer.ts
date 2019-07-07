import * as _ from 'lodash';
import * as moment from 'moment';
import {
    IBreadcrumbItem
} from 'office-ui-fabric-react/lib/Breadcrumb';

import { 
    IAction, 
    IDocument, 
    IBreadcrumbKey, 
    initialDocument 
} from '../../../../models';

import * as actions from './MeetingBookAddItemsActions';
import { IMeetingBookAddItemsState, initialMeetingBookAddItemsState } from './meeting-book-add-items';


export const MeetingBookAddItemsReducer = 
     (state: IMeetingBookAddItemsState = initialMeetingBookAddItemsState, action: IAction): IMeetingBookAddItemsState => {
    
    switch (action.type) {
        case actions.EventTypes.CHANGE_TAB: {

            const changeTab = action as actions.ChangeTab;

            const changeTabState: IMeetingBookAddItemsState = {
                ...state,
                activeTab: changeTab.tabId
            };

            return changeTabState;

        }
        case actions.EventTypes.CLEAR_BREADCRUMB: {

            const clearBreadcrumbState: IMeetingBookAddItemsState = {
                ...state,
                breadcrumb: [],
                items: [],
                sortField: '',
                sortDesc: false
            };

            return clearBreadcrumbState;

        }
        case actions.EventTypes.MOVE_UP_FOLDER: {

            const moveUpFolder = action as actions.MoveFolder;

            const folderKey: IBreadcrumbKey = JSON.parse(moveUpFolder.folder.key);

            let breadcrumb = [];
            for(let i = 0; i < state.breadcrumb.length; i++) {
                
                const item = _.cloneDeep(state.breadcrumb[i]);
                item.isCurrentItem = item.key === moveUpFolder.folder.key;

                breadcrumb.push(item);

                if(item.key === moveUpFolder.folder.key)
                    break;

            }

            const moveUpFolderState: IMeetingBookAddItemsState = {
                ...state,
                browsingSite: folderKey.IsSite,
                browsingLibary: folderKey.IsLibrary,
                breadcrumb
            };

            return moveUpFolderState;
        }
        case actions.EventTypes.MOVE_DOWN_FOLDER: {

            const moveDownFolder = action as actions.MoveFolder;

            const newKey: IBreadcrumbKey = moveDownFolder.folder ? JSON.parse(moveDownFolder.folder.key): null;
            const currKey: IBreadcrumbKey = state.breadcrumb.length ? JSON.parse(state.breadcrumb[state.breadcrumb.length - 1].key) : {};

            let breadcrumb = [];

            if(newKey !== null) {

                breadcrumb = state.breadcrumb.map(i => {
                    const bc = {...i};
                    bc.isCurrentItem = false;
                    return bc;
                });
    
                breadcrumb.push(moveDownFolder.folder);

            }

            const moveDownFolderState: IMeetingBookAddItemsState = {
                ...state,
                browsingLibary: newKey.IsLibrary,
                browsingSite: newKey.IsSite,
                breadcrumb
            };
            
            return moveDownFolderState;

        }
        case actions.EventTypes.RETRIEVE_LIBRARY_ITEMS: {

            const retrieveLibItems = action as actions.RetrieveLibraryItems;

            const retrieveLibItemsState: IMeetingBookAddItemsState = {
                ...state,
                loading: true,
                items: [],
                breadcrumb: retrieveLibItems.folder,
                sortField: retrieveLibItems.sortField,
                sortDesc: retrieveLibItems.sortDesc,
                searchTerm: retrieveLibItems.searchTerm
            };

            return retrieveLibItemsState;

        }

        case actions.EventTypes.LIBRARY_ITEMS_RETRIEVED: {

            const libItemsRetrieved = action as actions.LibraryItemsRetrieved;

            const items = libItemsRetrieved.payload ? 
                libItemsRetrieved.payload.payload : null;

            const hypermedia = libItemsRetrieved.payload ?
                _.omit(libItemsRetrieved.payload, 'payload') : null;

            const libItemsRetrievedState: IMeetingBookAddItemsState = {
                ...state,
                loading: false,
                odataHypermedia: _.cloneDeep(hypermedia),
                items: _.cloneDeep(items),
                error: _.cloneDeep(libItemsRetrieved.error)
            };

            return libItemsRetrievedState;

        }
        case actions.EventTypes.SAVE_FILE: 
        case actions.EventTypes.DELETE_FILE: {
            const saveFileState: IMeetingBookAddItemsState = {
                ...state,
                loading: true
            };

            return saveFileState;
        }
        case actions.EventTypes.FILE_SAVED: 
        case actions.EventTypes.FILE_DELETED: {
            const fileSavedState: IMeetingBookAddItemsState = {
                ...state,
                loading: false
            };

            return fileSavedState;
        }
        case actions.EventTypes.TOGGLE_MODAL: {

            const toggleModal = action as actions.ToggleModal;

            const toggleModalState: IMeetingBookAddItemsState = {
                ...state,
                addItemModalOpen: toggleModal.show,
                activeTab: 'library',
                breadcrumb: (toggleModal.folder) ? [toggleModal.folder] : state.breadcrumb
            };

            return toggleModalState;
        }
        default: {
            return state;
        }
    }
};
