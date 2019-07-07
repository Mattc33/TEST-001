import * as React from 'react';
import * as _ from 'lodash';

import { IMeetingBookItem } from '../../../../../models';

import { DragableMeetingBookListItemCtrl } from './meeting-book-item-ctrl';

export interface IListViewCtrl {

    provided: any;
    items: Array<IMeetingBookItem>;
    selectedItems: Array<number>;

    onItemDelete: (item: IMeetingBookItem) => void;
    onItemSelectionChange: (selectedItems: Array<number>) => void;

}

export class ListViewCtrl extends React.Component<IListViewCtrl, {}> {


    constructor(props: IListViewCtrl) {

        super(props);

    }

    public render(): React.ReactElement<IListViewCtrl> {

        return (
            <ul ref={this.props.provided.innerRef} className="list-group" data-view="list">

                {this.props.items.map((item: IMeetingBookItem, index: number) => {

                    const selected = this.props.selectedItems.indexOf(item.Id) > -1;
                    return <DragableMeetingBookListItemCtrl
                        item={item}
                        index={index}
                        selected={selected}
                        onDelete={this.props.onItemDelete}
                        onSelectionChange={this.props.onItemSelectionChange} />;

                }, this)}

                {this.props.provided.placeholder}

            </ul>
        );

    }

}
