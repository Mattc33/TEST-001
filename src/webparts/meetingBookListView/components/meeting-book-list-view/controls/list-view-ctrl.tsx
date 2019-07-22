import * as React from 'react';
import {
    DetailsList,
    DetailsListLayoutMode,
    DetailsRow,
    Selection,
    SelectionMode,
    IColumn,
    IDetailsRowCheckProps,
    IDetailsRowProps,
    DetailsRowCheck,
    CheckboxVisibility
} from 'office-ui-fabric-react/lib/DetailsList';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';

import { IMeetingBook, MeetingBookFilterType } from '../../../../../models';
import { ConfirmationDialog } from '../../../../../common/confirmation-dialog';

import { ListViewToolbarCtrl, ListItemActions } from '.';
import { isNextDay } from 'react-dates';

export interface IListViewCtrlProps {

    activeFilter: MeetingBookFilterType;
    items: Array<IMeetingBook>;
    baseUrl: string;

    currentUserEmail: string;

    prevUrl: string;
    nextUrl: string;
    pageNum: number;

    onFilter: (filter: MeetingBookFilterType) => void;
    onNewItemForm: () => void;
    onDeleteItems: (itemIds: Array<number>) => void;
    onSort:(sortField: string, sortAscending: boolean) => void;
    onPage:(nextUrl: string, nextPageNum: number) => void;
    onCloneMeetingBook: (meetingBookId: number) => void;
}

export interface IListViewCtrlState {
    selection: Array<number>;
    showDelete: boolean;
    showDeleteConfirmation: boolean;
    columns: Array<IColumn>;
}


export class ListViewCtrl extends React.Component<IListViewCtrlProps, IListViewCtrlState> {
    private _columns: Array<IColumn>;
    private MEETING_BOOK_PAGE = '/SitePages/MeetingBook.aspx?vp_mbid=';
    private _selection: Selection;

    constructor(props: IListViewCtrlProps) {

        super(props);

        this._columns = [
            {
                key: 'Title',
                name: 'Title',
                fieldName: 'Title',
                isResizable: true,
                minWidth: 0,
                onColumnClick: this._onColumnClick,
                onRender: (item: IMeetingBook) => {
                    return (
                        <a href={`${this.props.baseUrl}${this.MEETING_BOOK_PAGE}${item.Id}`}>
                            {item.Title}
                        </a>
                    );
                }
            },
            {
                key: 'Book_x0020_Status',
                name: 'Status',
                fieldName: 'Status',
                minWidth: 100,
                isRowHeader: true,
                isResizable: true,
                onColumnClick: this._onColumnClick
            },
            {
                key: 'sharedWith',
                name: 'Shared With',
                fieldName: 'SharedWith',
                minWidth: 50,
                isResizable: true,
                onRender: (item: IMeetingBook) => {

                    if(!!item.ShareWithAll)
                        return (<div>ALL</div>);

                    let sharedWith = item.SharedWith.reduce((acc, currVal, currIdx) => {
                        acc += `${currVal.FirstName} ${currVal.LastName}, `;
                        return acc;
                    }, '');

                    sharedWith = sharedWith.replace(/,\s*$/, "");

                    return (<div>{sharedWith}</div>);
                    
                }
            },
            {
                key: 'Author',
                name: 'Created By',
                fieldName: 'Author',
                minWidth: 100,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                onRender: (item: IMeetingBook) => {

                    const author = `${item.CreatedBy.FirstName} ${item.CreatedBy.LastName}`;

                    return (<div>{author}</div>);
                }
            },
            {
                key: 'Created',
                name: 'Date Created',
                fieldName: 'Created',
                minWidth: 100,
                isResizable: true,
                data: 'number',
                onColumnClick: this._onColumnClick,
                onRender: (item: IMeetingBook) => {
                    return (
                        <span>
                            { item.Created.format('MM/DD/YYYY') }
                        </span>
                    );
                },
                isPadded: true
            },
            {
                key: 'Last_x0020_Updated',
                name: 'Date Last Updated',
                fieldName: 'LastUpdate',
                minWidth: 100,
                isResizable: true,
                data: 'number',
                onColumnClick: this._onColumnClick,
                onRender: (item: IMeetingBook) => {
                    return (
                        <span>
                            { item.LastUpdate ? item.LastUpdate.format('MM/DD/YYYY') : '' }
                        </span>
                    );
                },
                isPadded: true
            }
        ];

        this._selection = new Selection({
            selectionMode: SelectionMode.multiple,
            onSelectionChanged: () => {

                const items = this._selection.getSelection() as Array<IMeetingBook>;

                let canDelete = true;
                const itemIds = [];

                for(let i = 0; i < items.length; i++) {
                    const item: IMeetingBook = items[i];
                    itemIds.push(item.Id);

                    if(item.CreatedBy.EMail !== this.props.currentUserEmail)
                        canDelete = false;
                }

                this.setState({
                    selection: itemIds,
                    showDelete: canDelete && !!items.length
                });
            }
        });

        this.state = {
            selection: [],
            columns: this._columns,
            showDelete: false,
            showDeleteConfirmation: false
        };

    }

    public async componentDidMount() {

    }

    public render(): React.ReactElement<IListViewCtrlProps> {

        return (
            <div>

                <ListViewToolbarCtrl
                    selection={this.state.selection}
                    showDeleteButton={this.state.showDelete}
                    activeFilter={this.props.activeFilter}
                    onFilter={this.props.onFilter}
                    onNewMeetingBook={this.props.onNewItemForm}
                    onDeleteItems={ this.resetSelectionAfter(this.onDeleteItems)} 
                    onCloneMeetingBook={this.resetSelectionAfter(this.onCloneMeetingBook)} />

                <MarqueeSelection selection={this._selection}>
                    <DetailsList
                        items={ this.props.items }
                        columns={ this.state.columns }
                        enterModalSelectionOnTouch={false}
                        setKey='set'
                        selection={this._selection}
                    />
                </MarqueeSelection>

                { this.props.prevUrl &&
                    <button 
                        type="button"
                        className="btn btn-default" 
                        onClick={this._onPage(this.props.prevUrl)(this.prev(this.props.pageNum)) }>Prev</button> }
                { this.props.nextUrl &&
                    <button 
                        type="button"
                        className="btn btn-default" 
                        onClick={this._onPage(this.props.nextUrl)(this.next(this.props.pageNum)) }>Next</button> }
            </div>
        );
    }

    @autobind
    private prev(currentPage) {

        return () => {
            return (currentPage >= 1) ? currentPage-1 : currentPage;
        };

    }

    @autobind
    private next(currentPage) {
        
        return () => {
            return ++currentPage;
        };

    }

    @autobind
    private _onPage(url: string) {

        return (prevOrNext: () => number) => {
            return (e) => {

                e.preventDefault();
                e.stopPropagation();

                this.props.onPage(url, prevOrNext());

            };
        };

    }

    @autobind
    private _onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn) {

        const { columns } = this.state;

        let newColumns: IColumn[] = columns.slice();
        let currColumn: IColumn = newColumns.filter((currCol: IColumn, idx: number) => {
            return column.key === currCol.key;
        })[0];

        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });


        this.setState({
            columns: newColumns
        }, () => {
            this.props.onSort(
                currColumn.key,
                !currColumn.isSortedDescending
            );
        });

    }

    @autobind
    private onDeleteItems() {

        this.props.onDeleteItems(this.state.selection);
        
    }

    @autobind
    private onCloneMeetingBook(meedintBookId: number) {

        this.props.onCloneMeetingBook(meedintBookId);

    }

    @autobind
    private resetSelection() {

        this.setState({
            selection: []
        }, () => {
            this._selection.setAllSelected(false);
        });

    }

    @autobind
    private resetSelectionAfter(action) {
        return this.actionThen(action)(this.resetSelection);
    }

    @autobind
    private actionThen(action) {

        return (next) => {
            return (...args) => {

                return next(action(...args));

            };
        };

    }

}
