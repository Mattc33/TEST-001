import * as React from 'react';
import { MeetingBookActions } from '../../dropdown-menu';

export interface IMeetingBookDisplayFormProps {

    title: string;
    status: string;

    onEdit: () => void;

}

export const MeetingBookDisplayForm = (props: IMeetingBookDisplayFormProps) => {
    return (

        <h2 className="meeting-book-title h4">
            {props.title}
            <span className="badge">{props.status}</span>
            <MeetingBookActions onEdit={props.onEdit} />
        </h2>

    );
};
