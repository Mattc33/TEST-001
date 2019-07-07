import * as React from 'react';

import { DropdownMenu } from '../../../../common/dropdown-menu';


export interface IMeetingBookActionsProps {

    onEdit: (e: any) => void;

}

export const MeetingBookActions = (props: IMeetingBookActionsProps) => {
    return (

        <DropdownMenu menuItems={[
            {
                eventId: "1",
                onSelect: props.onEdit,
                title: "Edit"
            }
        ]} />

    );
};

export interface IMeetingBookItemActionsProps {
    onDelete: (e) => void;
}

export const MeetingBookItemActions = (props: IMeetingBookItemActionsProps) => {
    return (


        <DropdownMenu menuItems={[
            {
                eventId: "2",
                onSelect: props.onDelete,
                title: "Delete"
            }
        ]} />

    );
};