import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { GET_FILE_ICON, IMeetingBookItem } from '../../../../../models';

import { MeetingBookItemActions } from '../../dropdown-menu';

export interface IMeetingBookItemCtrlProps {

    item: IMeetingBookItem;
    selected: boolean;
    index: any;

    onDelete: (item) => void;
    onSelectionChange: (e: any) => void;
    
}

export const DragableMeetingBookListItemCtrl = (props: IMeetingBookItemCtrlProps) => {

    const fileIcon = GET_FILE_ICON(props.item.FileExtension);

    return (

        <Draggable 
            key={props.item.Id} 
            draggableId={props.item.Id} 
            index={props.index}
            type='MEETING_BOOK_ITEM'
        >
            {(provided, snapshot) => (
                <li className="meeting-book-item">
                    <div
                        ref={ provided.innerRef }
                        { ...provided.draggableProps }
                    >
                        
                            <ul className="list-inline">
                                <li className="item-actions">
                                    <i 
                                        {...provided.dragHandleProps} 
                                        className="item-grab ms-Icon ms-Icon--GripperBarHorizontal" 
                                        aria-hidden="true">
                                    </i>
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" 
                                            name={props.item.Title} 
                                            id={props.item.Id ? props.item.Id.toString() : "0"} 
                                            checked={props.selected}
                                            onChange={props.onSelectionChange}
                                            className="custom-control-input" />
                                        <label htmlFor={props.item.Id ? props.item.Id.toString() : "0"} className="custom-control-label"></label>
                                    </div>
                                </li>
                                <li>
                                    <a href={props.item.Url} target="_blank" className="list-group-item">
                                    <i className={fileIcon} aria-hidden="true"></i>
                                    { !!props.item.Filename ? props.item.Filename : props.item.Title }
                                    </a>
                                </li>
                                <li className="meeting-book-item__text--right">
                                    <a href={props.item.Url} target="_blank" className="list-group-item">
                                    <span className="meeting-book-item__text--italic">
                                        {` (Added ${props.item.CreatedDate.format('MM/DD/YYYY')}`}
                                        { props.item.ModifiedDate && `; Modified ${props.item.ModifiedDate.format('MM/DD/YYYY')}`}
                                        { `)`}
                                    </span>
                                    </a>
                                </li>
                            </ul>
                        
                    </div>
                
                    {provided.placeholder}
                </li>
            )}
        </Draggable>
        
    );

};

export const DragableMeetingBookGridItemCtrl = (props: IMeetingBookItemCtrlProps) => {

    return (

        <Draggable 
            key={props.item.Id} 
            draggableId={props.item.Id} 
            index={props.index}
            type='MEETING_BOOK_ITEM'
        >
            {(provided, snapshot) => (

                <div 
                    ref={ provided.innerRef }
                    { ...provided.draggableProps } 
                >

                    <a href={props.item.Url} className="item-img">
                        <img {...provided.dragHandleProps} src="http://via.placeholder.com/350x250" alt="" />
                        <div className="overlay">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" name="" id="test2" className="custom-control-input" value="" />
                                <label htmlFor="test2" className="custom-control-label"></label>
                            </div>
                            <MeetingBookItemActions 
                                onDelete={(e) => 
                                    props.onDelete(props.item)} />
                        </div>
                    </a>
                    <h4>
                        <a href={props.item.Filename} className="item-title">Top Sheet</a>
                        <i className="ms-Icon ms-Icon--PowerPointLogo" aria-hidden="true"></i>
                    </h4>
                    <h5>top_sheet_1_15_2018.xlsx</h5>
                    <h5>Updated on 1/15/2018 at 4:21pm</h5>

                    {provided.placeholder}
                </div>
            )}
        </Draggable>
    );

};