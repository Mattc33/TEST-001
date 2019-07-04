import * as React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

const DropdownMenuToggle = (props) => {
    return (
        <div onClick={(e) => {e.preventDefault(); props.onClick();}}>
            { props.children }
        </div>
    );
};

export interface IMenuItem {

    title: string;
    eventId: string;
    onSelect: (e: any) => void;

}

export interface IDropdownMenuProps {

    menuItems: Array<IMenuItem>;

}

export const DropdownMenu = (props: IDropdownMenuProps) => {
    return (

        <Dropdown id="dropdown-custom-menu" pullRight>
            <DropdownMenuToggle bsRole="toggle">
                <i className="ms-Icon ms-Icon--More dropdown-toggle">
                </i>
            </DropdownMenuToggle>

            <Dropdown.Menu>
                {
                    props.menuItems.map( i => 
                        <MenuItem 
                            eventId={i.eventId} 
                            onSelect={i.onSelect}
                        >{i.title}</MenuItem>)
                }
            </Dropdown.Menu>
        </Dropdown>
    );
};