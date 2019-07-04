/* tslint:disable:no-unused-variable */
import * as React from 'react';
/* tslint:enable:no-unused-variable */
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import {
    DetailsList,
    DetailsRow,
    Selection,
    SelectionMode,
    IColumn,
    IDetailsRowCheckProps,
    IDetailsRowProps,
    DetailsRowCheck,
    IObjectWithKey,
    ConstrainMode
} from 'office-ui-fabric-react/lib/DetailsList';
import {
    IBreadcrumbItem, Breadcrumb
} from 'office-ui-fabric-react/lib/Breadcrumb';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import {
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import * as _ from 'lodash';

import {
    IDocument,
    initialDocument,
    FILE_TYPES,
    GET_FILE_ICON
} from '../../../../../models';
import { ActionButtons } from '../../../../../common/form/action-buttons/action-buttons';

export interface ILibraryBrowserCtrlProps {

    browsingLibrary: boolean;
    browsingSite: boolean;

    items: Array<IDocument>;
    breadcrumb: Array<IBreadcrumbItem>;
    focusedIndex: number;

    sortField: string;
    sortDesc: boolean;

    loading: boolean;
    baseUrl: string;

    onCancel: () => void;
    onAdd: (documents: Array<IDocument>) => void;
    onNavigate: (folder: IDocument, sortColumn?: string, sortDesc?: boolean) => void;
    onSort: (folder: Array<IBreadcrumbItem>, sortColumn: string, sortDesc: boolean) => void;
    onUploadFile: (item: any, file: File) => void;
    onDeleteFile: (fiels: Array<string>) => void;
    onSearch: (searchTerm: string) => void;
    
}

export interface ILibraryBrowserCtrlState {

    columns: Array<IColumn>;
    currentFolder: IDocument;
    selected: Array<IDocument>;
    showConfirm: boolean;
    confirm: (event: any) => void;
    cancel: (event: any) => void;

}

export class LibraryBrowserCtrl extends React.Component<ILibraryBrowserCtrlProps, ILibraryBrowserCtrlState> {

    private _selection: Selection;
    private _columns: Array<IColumn>;
    private _dragOn: React.CSSProperties = {
        backgroundColor: "#f1f1f1"
    };

    constructor(props: any) {
        super(props);

        this._columns = [
            {
                key: 'fileType',
                name: 'File Type',
                headerClassName: 'DetailsListExample-header--FileIcon',
                className: 'DetailsListExample-cell--FileIcon',
                iconClassName: 'DetailsListExample-Header-FileTypeIcon',
                iconName: 'Page',
                isIconOnly: true,
                fieldName: 'name',
                minWidth: 18,
                maxWidth: 18,
                onRender: (item: IDocument) => {
                    if (item.Id === -1) {
                        return <div></div>;
                    }

                    return (
                        <div className={this.getFileExtension(item.Name, item.IsFolder || item.IsLibrary || item.IsSite).icon} aria-hidden={true}></div>
                    );
                }
            },
            {
                key: 'fileName',
                name: 'File Name',
                fieldName: 'LinkFilename',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                isPadded: true,
                onColumnClick: this._onColumnClick,
                onRender: (item: IDocument) => {

                    return item.Id > -1 && (item.IsFolder || item.IsLibrary || item.IsSite) ?
                        (
                            <a
                                href="#"
                                key={item.Id}
                                onClick={this._onNavigate(item)}
                            >
                                {item.Name}
                            </a>
                        ) : (<div> {item.Name} </div>);

                }
            },
            {
                key: 'modifiedDate',
                name: 'Date Modified',
                fieldName: 'Modified',
                minWidth: 70,
                maxWidth: 90,
                isResizable: true,
                data: 'number',
                onColumnClick: this._onColumnClick,
                onRender: (item: IDocument) => {

                    return item.Id > -1 ?
                        (
                            <span>
                                {item.DateModified.format('MM/DD/YYYY')}
                            </span>

                        ) : (

                            <span></span>

                        );

                },
                isPadded: true
            }
        ];

        this._selection = new Selection({
            selectionMode: SelectionMode.multiple,
            onSelectionChanged: () => {

                const items = this._selection.getSelection() as Array<IDocument>;
                const selected = items.filter((i: IDocument): boolean => {
                    return !i.IsFolder;
                });

                this.setState({
                    selected: selected
                });

            },
            canSelectItem: (item: IObjectWithKey): boolean => {

                const doc = item as IDocument;
                if (doc.IsFolder || doc.Id === -1) {
                    return false;
                }

                return true;

            }
        });

        this.state = {
            columns: this._columns,
            currentFolder: {
                ...initialDocument,
                Id: -1,
                Name: '',
                IsFolder: true
            },
            selected: [],
            showConfirm: true,
            confirm: undefined,
            cancel: undefined
        };

    }

    public componentDidMount() {

    }

    public shouldComponentUpdate(nextProps: ILibraryBrowserCtrlProps, nextState: ILibraryBrowserCtrlState) {

        if (_.isEqual(nextProps, this.props) && _.isEqual(nextState.selected, this.state.selected))
            return false;

        return true;

    }

    public componentWillReceiveProps(newProps: ILibraryBrowserCtrlProps) {

        if (newProps.sortField === this.props.sortField
            && newProps.sortDesc === this.props.sortDesc
            && _.isEqual(newProps.breadcrumb, this.props.breadcrumb)
        ) {
            this._selection.setItems(this.props.items as Array<IObjectWithKey>, true);
            return;
        }

        const currentFolder = newProps.breadcrumb.length ? {
            ...initialDocument,
            ...JSON.parse(newProps.breadcrumb[newProps.breadcrumb.length - 1].key)
        } : { ...initialDocument };

        const columns = [...this._columns];

        const currColumnIdx = _.findIndex(this.state.columns, (c) => {
            return c.key === newProps.sortField;
        });

        if (currColumnIdx > -1) {
            columns[currColumnIdx].isSorted = true;
            columns[currColumnIdx].isSortedDescending = newProps.sortDesc;
        }

        this.setState({
            currentFolder,
            columns
        });

    }

    public render() {

        const items = this.props.items.map((i => i));

        const file = items.find((i => !i.IsFolder));
        const hideDnd = this.props.browsingSite;
        if (!hideDnd) {
            if (!items.length || !file) {
                const placeholder = { ...this.state.currentFolder };
                placeholder.Id = -1;
                placeholder.Name = 'Drag and drop file here to upload';
                placeholder.Filename = 'Drag and drop file here to upload';
                placeholder.IsFolder = true;
                placeholder.Url = this._getUploadUrl();

                items.push(placeholder);
            }
        }

        return (
            <div>
                <div className="form-group">
                    <TextField placeholder="Search" onKeyPress={this._onSearch} />

                    <Breadcrumb
                        items={this.props.breadcrumb}
                        maxDisplayedItems={3}
                        ariaLabel={'Website breadcrumb'}
                    />

                    <MarqueeSelection selection={this._selection}>
                        <DetailsList
                            items={items}
                            columns={this.state.columns}
                            initialFocusedIndex={this.props.focusedIndex}
                            enterModalSelectionOnTouch={false}
                            setKey='set'
                            selection={this._selection}
                            onRenderRow={this._onRenderRow}
                            constrainMode={ConstrainMode.unconstrained}
                        />
                    </MarqueeSelection>

                </div>
                <div className="form-actions text-right">

                    {!!this.props.loading &&
                        <div className="btn">
                            <Spinner size={SpinnerSize.small} />
                        </div>
                    }

                    <ActionButtons
                        showDelete={false}
                        submitting={!!this.props.loading}
                        deleteCancelText=""
                        deleteConfirmText=""
                        deleteText=""
                        cancelText="Cancel"
                        saveText="Add Item"
                        onCancel={this.props.onCancel}
                        onSave={this.onAdd}
                        onDelete={() => {}} />

                </div>
            </div>

        );

    }

    @autobind
    private _openDocumentLibrary() {

        const { Url } = this.state.currentFolder;

        if (Url)
            window.open(Url, '_blank');

    }

    @autobind
    private _getUploadUrl(): string {

        let baseUrl = this.props.baseUrl;

        if (!this.props.breadcrumb || this.props.breadcrumb.length === 0) {

            baseUrl += '/​​​Shared Documents/';

        }
        else {

            const dirUrl = this.props.breadcrumb.reduce<string>((prev: string, curr: IBreadcrumbItem): string => {
                prev += (curr.text === "Documents") ? '/Shared Documents/' : curr.text + '/';
                return prev;
            }, '');

            baseUrl += dirUrl;

        }

        return baseUrl;
    }

    @autobind
    private _onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn) {

        const { columns } = this.state;
        const newColumns = columns.slice();
        const currColumn: IColumn = newColumns.filter((currCol: IColumn, idx: number) => {
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
                this.props.breadcrumb,
                currColumn.fieldName,
                currColumn.isSortedDescending);
        });

    }

    @autobind
    private onAdd() {

        const selection: Array<IDocument> = this._selection.getSelection() as Array<IDocument>;
        this.props.onAdd(selection);

    }

    @autobind
    private _onDragStart(e: React.SyntheticEvent<any>) {

        e.preventDefault();
        e.stopPropagation();

        (e.currentTarget as any).style.backgroundColor = "#f1f1f1";

        const child: any = (e.currentTarget as any).children;
        if (child.length > 0) {
            child[0].style.backgroundColor = "#f1f1f1";
        }

    }

    @autobind
    private _onDragEnd(e: React.SyntheticEvent<any>) {

        e.preventDefault();
        e.stopPropagation();

        (e.currentTarget as any).style.backgroundColor = "";
        const child: any = (e.currentTarget as any).children;
        if (child.length > 0) {
            child[0].style.backgroundColor = "";
        }

    }

    @autobind
    private _onDrop(e: React.SyntheticEvent<any>, props: IDetailsRowProps) {

        e.preventDefault();
        e.stopPropagation();

        (e.currentTarget as any).style.backgroundColor = "";
        const child: any = (e.currentTarget as any).children;
        if (child.length > 0) {
            child[0].style.backgroundColor = "";
        }

        const evt = e as any;
        const evtItem = props.item as IDocument;
        if (evtItem.IsSite) {
            return;
        }

        const files = evt.target.files || (evt.dataTransfer ? evt.dataTransfer.files : null);
        if (files && files.length === 1) {
            setTimeout(() => this.props.onUploadFile(props.item, files[0]), 0);
        }

    }

    @autobind
    private _onRenderRow(props: IDetailsRowProps) {

        return (
            <div id="myRow" className="wmg-dragon"
                onDragOver={this._onDragStart}
                onDragEnter={this._onDragStart}
                onDragLeave={this._onDragEnd}
                onDragEnd={this._onDragEnd}
                onDrop={(e) => this._onDrop(e, props)}>
                <DetailsRow
                    {...props}
                    onRenderCheck={(cbProps) => this._onRenderCheck(cbProps, props.item.IsFolder)}
                    aria-busy={false}
                />
            </div>
        );

    }

    @autobind
    private _onRenderCheck(props: IDetailsRowCheckProps, isFolder: boolean) {

        props.canSelect = !isFolder;
        return (
            <DetailsRowCheck
                {...props} />
        );

    }

    @autobind
    private _onSearch(event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === "Enter") {
            this.props.onSearch(event.currentTarget.value);
        }
    }

    private getFileExtension(filename, isFolder): { docType: string; icon: any; } {

        const ext = isFolder ? 'folder' : filename.substr(filename.lastIndexOf('.') + 1);

        const docType = _.indexOf(FILE_TYPES, ext) > -1 ? ext : 'document';
        //const iconName = GET_BRANDED_ICON(ext);
        const icon = GET_FILE_ICON(ext);

        return {
            docType,
            icon: icon
        };

    }

    @autobind
    private _onNavigate(folder) {
        return (e) => {
            this._navigate(e, folder);
        };
    }

    @autobind
    private _navigate(e, folder) {

        e.preventDefault();
        e.stopPropagation();

        const { sortField, sortDesc } = this.props;
        this.props.onNavigate(folder, sortField, sortDesc);

    }

}
