import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import * as _ from 'lodash';
import { DropResult } from 'react-beautiful-dnd';
import {
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

import { IRootState } from '../../reducer';
import { 
    IMeetingBookItem, 
    MeetingBookViewType 
} from '../../../../models';
import MeetingBookAddItems from '../meeting-book-add-items/meeting-book-add-items';

import MeetingBookItemsActionCreator from './MeetingBookItemsActionCreator';

require("../meeting-book/meetingbookreg.css");

import { MeetingBookItemsDnd } from './controls';


export interface IMeetingBookItemsState {

    loading?: boolean;
    error?: Array<any>;

    items?: Array<any>;
    selectedItems?: Array<number>;

    addItemFormOpen?: boolean;
    view?: MeetingBookViewType;

}

export const initialMeetingBookItemsState: IMeetingBookItemsState = {

    loading: false,
    error: null,

    items: [],
    selectedItems: [],

    addItemFormOpen: false,
    view: 'list'

};



export interface IMeetingBookItemsProps extends IMeetingBookItemsState {

    meetingBookId: number;
    view: MeetingBookViewType;
    baseUrl: string;

    dispatch?: Dispatch<IRootState>;

}

class MeetingBookItems extends React.Component<IMeetingBookItemsProps, IMeetingBookItemsState> {

    private actions: MeetingBookItemsActionCreator;

    constructor(props: IMeetingBookItemsProps) {

        super(props);

        this.actions = new MeetingBookItemsActionCreator(props.dispatch);

    }

    public componentDidMount() {

        // Get meeting book items
        if(this.props.meetingBookId > 0)
            this.actions.getMeetingBookItems(this.props.meetingBookId);

    }

    public componentWillReceiveProps(newProps: IMeetingBookItemsProps) {

        if(newProps.meetingBookId < 1)
            return;

        if(newProps.meetingBookId === this.props.meetingBookId)
            return;

        this.actions.getMeetingBookItems(newProps.meetingBookId);

    }

    public render(): React.ReactElement<IMeetingBookItemsProps> {

        const emptyBook = !(!!this.props.items && !!this.props.items.length);

        return (
            <div className="meeting-book editable">
                <div className="btn-toolbar">

                    { !emptyBook &&

                        <button
                            type="button"
                            className="general__button general__button--small general__button--brand-secondary"
                            onClick={this.openAddItemsModal}
                        >
                            Add Item
                        </button>

                    }

                    { !!this.props.selectedItems.length &&

                        <button type="button" className="btn btn-neutral-light" onClick={this.removeSelectedItems}>
                            <i className="ms-Icon ms-Icon--Delete" aria-hidden="true"></i>
                        </button>

                    }

                    { !!this.props.loading &&

                        <Spinner size={ SpinnerSize.xSmall } />

                    }

                </div>

                { !this.props.loading && !!emptyBook &&

                    <span 
                        className="meeting-book__empty-message">
                        Meeting book is empty.  Click &nbsp;
                        <button 
                            type="button" 
                            className="general__button general__button--small general__button--brand-secondary"
                            onClick={this.openAddItemsModal}>Add Item</button> 
                        &nbsp; to add items.
                    </span>

                }   

                { !emptyBook && !!this.props.meetingBookId &&

                    <MeetingBookItemsDnd
                        items={this.props.items}
                        selectedItems={this.props.selectedItems}
                        view={this.props.view}
                        onItemSelectionChange={this.onItemSelectionChange}
                        onDragEnd={this.onOrderChanged}
                        onItemDelete={this.onItemDelete}
                        onRemoveSelected={this.removeSelectedItems} />
                        
                }

                <MeetingBookAddItems
                    show={!!this.props.addItemFormOpen}
                    baseUrl={this.props.baseUrl}
                    onClose={this.closeAddItemsModal}
                    onAddItem={this.addMeetingBookItem}
                    meetingBookId={this.props.meetingBookId}
                    nextSequence={this.props.items.length} />
                    
            </div>
        );

    }

    @autobind
    private addMeetingBookItem(item: Array<IMeetingBookItem>) {
        this.actions.addMeetingBookItem(item);
    }

    @autobind
    private openAddItemsModal() {
        this.actions.openAddItemForm();
    }

    @autobind
    private closeAddItemsModal() {
        this.actions.closeAddItemForm();
    }

    @autobind
    private removeSelectedItems() {
        this.actions.deleteMeetingBookItems(this.props.selectedItems);
    }

    @autobind
    private onItemSelectionChange(e: any) {

        const checked = e.target.checked;
        const id = e.target.id ? parseInt(e.target.id) : null;

        let checkedItems = [...this.props.selectedItems];

        if(!id)
            return;

        if(checked && !_.includes(checkedItems, id))
            this.actions.selectMeetingBookItem(id);

        if(!checked)
            this.actions.unselectMeetingBookItem(id);

    }

    @autobind
    private onItemDelete(item: IMeetingBookItem) {
        this.actions.deleteMeetingBookItems([item.Id]);
    }

    @autobind
    private onOrderChanged(result: DropResult) {


        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = this.reorder(
            this.props.items,
            result.source.index,
            result.destination.index
        );

        this.actions.reorderMeetingBookItems(this.props.meetingBookId, items);

    }

    @autobind
    private reorder(list, startIndex, endIndex) {
        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    }

}

const mapStateToProps = (state: IRootState, ownProps: IMeetingBookItemsProps): IMeetingBookItemsProps => {

    return {
        ...state.meetingBookItemsState,
        baseUrl: ownProps.baseUrl,
        meetingBookId: ownProps.meetingBookId,
        view: ownProps.view
    };

};

export default connect(mapStateToProps)(MeetingBookItems);
