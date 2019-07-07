import * as React from 'react';

import { DropdownMenu } from '../../../../../common/dropdown-menu';

export interface IListItemActions {
    onEdit: (e) => void;
}

export const ListItemActions = (props: IListItemActions) => {
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