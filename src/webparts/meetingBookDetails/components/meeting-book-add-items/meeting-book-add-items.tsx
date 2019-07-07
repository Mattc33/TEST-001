import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import * as _ from 'lodash';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import {
    Pivot,
    PivotItem,
    PivotLinkFormat,
    PivotLinkSize
} from 'office-ui-fabric-react/lib/Pivot';
import {
    Breadcrumb, IBreadcrumbItem, IBreadcrumb
} from 'office-ui-fabric-react/lib/Breadcrumb';
import { Modal } from 'office-ui-fabric-react/lib/Modal';

import { IRootState } from '../../reducer';

import { AddLinkFormCtrl } from './controls/add-link-form-ctrl';
import { LibraryBrowserCtrl } from './controls/library-browser-ctrl';

import { 
    IMeetingBookItem, 
    IDocument, 
    IBreadcrumbKey,
    initialDocument
} from '../../../../models';

import { ILink } from './controls';
import MeetingBookAddItemsActionCreator from './MeetingBookAddItemsActionCreator';
import { ErrorMessage } from '../../../../common/error-message';

export interface IMeetingBookAddItemsState {

    addItemModalOpen?: boolean;

    loading?: boolean;
    error?: Array<string>;

    activeTab?: string;

    browsingSite?: boolean;
    browsingLibary?: boolean;

    items?: Array<IDocument>;
    breadcrumb?: Array<IBreadcrumbItem>;
    sortField?: string;
    sortDesc?: boolean;
    searchTerm?: string;

    odataHypermedia?: any;

    initialFocusedIndex?: number;

}

export interface IMeetingBookAddItemsProps extends IMeetingBookAddItemsState {

    dispatch?: Dispatch<IRootState>;

    show: boolean;
    meetingBookId: number;
    nextSequence: number;
    baseUrl: string;

    onAddItem: (item: Array<IMeetingBookItem>) => void;
    onClose: () => void;

}

export const initialMeetingBookAddItemsState: IMeetingBookAddItemsState = {
    loading: false,
    error: null,
    activeTab: '',
    items: [],
    breadcrumb: [],
    initialFocusedIndex: 0,
    addItemModalOpen: false,
    sortField: '',
    sortDesc: false
};


class MeetingBookAddItems extends React.Component<IMeetingBookAddItemsProps, IMeetingBookAddItemsState> {

    private _actions: MeetingBookAddItemsActionCreator;

    constructor(props: IMeetingBookAddItemsProps) {

        super(props);

        this._actions = new MeetingBookAddItemsActionCreator(this.props.dispatch);

    }

    public componentDidMount() {

        this._actions.toggleModal(this.props.show);

    }

    public componentWillReceiveProps(newProps: IMeetingBookAddItemsProps) {

        const opened = (newProps.show !== this.props.show && newProps.show);

        if(opened)
            this._actions.toggleModal(newProps.show);

        if(newProps.activeTab === 'library' && opened) {

            this._actions.clearBreadcrumb();
            const breadcrumb: IBreadcrumbItem = this.getHomeBreadcrumb();

            if (newProps.show) {
                this._actions.moveDownIntoFolder(
                    breadcrumb);
            }
        }

    }

    public render(): React.ReactElement<IMeetingBookAddItemsProps> {

        return (
            <Modal 
                isBlocking={true} 
                containerClassName="wmg-mb-modal modal-lg modal-content" 
                isOpen={this.props.show} 
                onDismiss={this.props.onClose}>
                <div className="modal-header">
                    <button type="button" className="close" onClick={this.props.onClose} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>

                    <h3 className="modal-title">Add Item</h3>
                </div>

                <div className="modal-body">

                    <ErrorMessage error={this.props.error} />

                    <Pivot
                        selectedKey={ this.props.activeTab }
                        linkSize={ PivotLinkSize.large }
                        onLinkClick={this.onTabChange} >                   
                        <PivotItem linkText='LIBRARY' itemKey='library'>
                            <LibraryBrowserCtrl
                                browsingSite={this.props.browsingSite}
                                browsingLibrary={this.props.browsingLibary}
                                items={this.props.items}
                                baseUrl={this.props.baseUrl}
                                sortField={this.props.sortField}
                                sortDesc={this.props.sortDesc}
                                breadcrumb={this.props.breadcrumb}
                                focusedIndex={this.props.initialFocusedIndex}
                                loading={this.props.loading}
                                onNavigate={(folder) => this.onFolderChange(folder, 'down')}
                                onAdd={this.onAddDocument}
                                onCancel={this.props.onClose}
                                onSort={this.onLibrarySort} 
                                onUploadFile={this.onUploadFile}
                                onDeleteFile={this.onDeleteFile}
                                onSearch={this.onSearch} />
                        </PivotItem>
                        <PivotItem linkText='LINK' itemKey='link'>
                            <AddLinkFormCtrl
                                onAdd={this.onAddLink}
                                onCancel={this.props.onClose} />
                        </PivotItem>
                    </Pivot>

                </div>
            </Modal>
        );

    }

    @autobind
    private getHomeBreadcrumb() {

        const key: IBreadcrumbKey = {
            IsSite: true,
            IsLibrary: false,
            IsFolder: false,
            Title: 'Home',
            Id: '-1',
            Url: this.props.baseUrl
        };

        const breadcrumb: IBreadcrumbItem = {
            key: JSON.stringify(key),
            text: 'Home',
            onClick:(e, item) => this.onFolderChange(
                {
                    ...initialDocument,
                    Id: -1,
                    Url: this.props.baseUrl,
                    IsSite: true,
                    IsLibrary: false,
                    IsFolder: false,
                    Name: 'Home'
                },
                'up'
            ),
            isCurrentItem: true
        };

        return breadcrumb;
    }

    @autobind
    private onDeleteFile(files: Array<string>) {

        this._actions.deleteFile(
            files, 
            this.props.breadcrumb, 
            this.props.sortField, 
            this.props.sortDesc);

    }

    @autobind
    private onUploadFile(item: any, file: File) {

        this._actions.saveFile(
            item, 
            file, 
            this.props.breadcrumb, 
            this.props.sortField,
            this.props.sortDesc);
    }

    @autobind
    private onLibrarySort(folder: Array<IBreadcrumbItem>, sortColumn: string, sortDesc: boolean) {

        this._actions.retrieveLibraryItems(
            this.props.breadcrumb, 
            sortColumn, 
            sortDesc);
    }

    @autobind
    private onAddLink(link: ILink) {

        let linkType: 'link' | 'calendar' = 'link';

        if(link.url.indexOf("ArtistCalendar.aspx") > -1) 
            linkType = 'calendar';

        const mbItem: IMeetingBookItem = {
            Title: link.title,
            Filename: link.title,
            Url: link.url,
            MeetingBookId: typeof this.props.meetingBookId === 'string' ?
                parseInt(this.props.meetingBookId) : this.props.meetingBookId,
            Sequence: this.props.nextSequence,
            Type: linkType
        };

        this.props.onAddItem([mbItem]);

    }

    @autobind
    private onAddDocument(document: Array<IDocument>) {

        let seq = this.props.nextSequence;

        const mbItems = document.reduce((acc, d, idx, items) =>{

            if(d.IsFolder)
                return;

            const mbItem: IMeetingBookItem = {
                DocumentODataId: d.ODataId,
                Title: d.Name,
                Filename: d.Name,
                Url: d.Url,
                MeetingBookId: typeof this.props.meetingBookId === 'string' ?
                    parseInt(this.props.meetingBookId) : this.props.meetingBookId,
                Sequence: seq++,
                Type: 'link'
            };

            acc.push(mbItem);

            return acc;
        }, []);

        this.props.onAddItem(mbItems);

    }

    @autobind
    private onFolderChange(folder: IDocument, direction: 'down' | 'up') {

        const key: IBreadcrumbKey = {
            IsSite: folder.IsSite,
            IsLibrary: folder.IsLibrary,
            IsFolder: folder.IsFolder,
            Title: folder.Name,
            Id: `${folder.Id}`,
            Url: folder.Url
        };

        const breadcrumb: IBreadcrumbItem = {
            key: JSON.stringify(key),
            text: folder.Name || 'Atlantic Hub',
            onClick: (e, item) => this.onFolderChange(folder, 'up'),
            isCurrentItem: true
        };

        if(direction === 'down') {
            this._actions.moveDownIntoFolder(breadcrumb);
        }

        if (direction === 'up') {
            this._actions.moveUpIntoFolder(breadcrumb);
        }

    }

    @autobind
    private onTabChange(item?: PivotItem, ev?: React.MouseEvent<HTMLElement>) {
        this._actions.changeTab(item.props.itemKey);
    }

    @autobind
    private onSearch(searchTerm: string) {
        this._actions.retrieveLibraryItems(
            this.props.breadcrumb,
            this.props.sortField,
            this.props.sortDesc,
            searchTerm
        );
    }

}

const mapStateToProps = (state: IRootState, ownProps: IMeetingBookAddItemsProps): IMeetingBookAddItemsProps => {

    return {
        ...state.meetingBookAddItemsState,
        baseUrl: ownProps.baseUrl,
        show: ownProps.show,
        meetingBookId: ownProps.meetingBookId,
        nextSequence: ownProps.nextSequence,
        onAddItem: ownProps.onAddItem,
        onClose: ownProps.onClose
    };

};

export default connect(mapStateToProps)(MeetingBookAddItems);
