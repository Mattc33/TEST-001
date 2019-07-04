
import * as React from 'react';
import {
    DragDropContext, 
    Droppable, 
    Draggable,
    DropResult
} from 'react-beautiful-dnd';
import * as _ from 'lodash';

import { IMeetingBookItem, MeetingBookViewType } from '../../../../../models';

import { ListViewCtrl } from './list-view-ctrl';

export interface IMeetingBookItemsDndProps {

    items: Array<IMeetingBookItem>;
    selectedItems: Array<number>;
    view: MeetingBookViewType;

    onDragEnd: (result: DropResult) => void;
    onItemDelete: (item: IMeetingBookItem) => void;
    onItemSelectionChange: (selectedItems: Array<number>) => void;
    onRemoveSelected: (removeItems: Array<number>) => void;
    
}

export interface IMeetingBookItemsDndState {

}

export class MeetingBookItemsDnd extends React.Component<IMeetingBookItemsDndProps, IMeetingBookItemsDndState> {

    constructor(props: IMeetingBookItemsDndProps) {
        
        super(props);
   
    }

    public componentWillReceiveProps(newProps: IMeetingBookItemsDndProps) {

    }

    public render() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <DragDropContext onDragEnd={this.props.onDragEnd}>
                            <Droppable droppableId="meeting_book_items" type="MEETING_BOOK_ITEM">
                                {(provided, snapshot) => (
                                    <ListViewCtrl 
                                        provided={provided}
                                        onItemDelete={this.props.onItemDelete}
                                        onItemSelectionChange={this.props.onItemSelectionChange}
                                        items={this.props.items}
                                        selectedItems={this.props.selectedItems} />
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
                
            </div>
        );
    }
}