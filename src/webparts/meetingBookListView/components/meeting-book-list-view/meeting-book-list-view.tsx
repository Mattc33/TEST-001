import * as React from 'react';
import {
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import { connect, Dispatch } from 'react-redux';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

import { IUserService } from '../../../../services';
import { IMeetingBook, MeetingBookFilterType } from '../../../../models';

import { IRootState } from '../../reducer';

import MeetingBookListViewActionCreator from './MeetingBookListViewActionCreator';
import { ListViewCtrl } from './controls';

import { MeetingBookFormModal } from '../../../../common/form/meeting-book-form';

require("./meetingbooklist.css");

export declare type NavLinks = { [key: number]: PageLinks; };

export interface PageLinks {
    prev: string;
    next: string;
}

export interface IMeetingBookListViewState {
    initialized?: boolean;
    loading?: boolean;
    errors?: Array<string>;

    activeFilter?: MeetingBookFilterType;
    items?: Array<IMeetingBook>;

    showNewItemForm?: boolean;

    sortField?: string;
    sortAscending?: boolean;

    prevPage?: string;
    nextPage?: string;
    pageNum?: number;

    prevPages?: NavLinks;
}

export interface IMeetingBookListViewProps extends IMeetingBookListViewState {

    dispatch?: Dispatch<IRootState>;
    baseUrl: string;
    userService: IUserService;

    currentUserEmail: string;

}

export const initialMeetingBookListViewState: IMeetingBookListViewState = {
    initialized: false,
    loading: false,
    errors: null,
    activeFilter: '',
    items: [],
    prevPages: {},
    showNewItemForm: false
};


export class MeetingBookListViewComponent extends React.Component<IMeetingBookListViewProps, IMeetingBookListViewState> {

  private actions: MeetingBookListViewActionCreator;

  constructor(props: IMeetingBookListViewProps) {

    super(props);

    this.actions = new MeetingBookListViewActionCreator(this.props.dispatch);

  }

  public async componentDidMount() {
    this.actions.initializeMeetingBookList();
  }

  public render(): React.ReactElement<IMeetingBookListViewProps> {

    return (
        <div className="wmg-meeting-book list-view">
            <div className="form-group">
                { !!this.props.loading &&
                    <Spinner size={ SpinnerSize.xSmall } />
                }

                <ListViewCtrl
                    currentUserEmail={this.props.currentUserEmail}
                    activeFilter={this.props.activeFilter}
                    items={this.props.items}
                    baseUrl={this.props.baseUrl}
                    prevUrl={this.props.prevPage}
                    nextUrl={this.props.nextPage}
                    pageNum={this.props.pageNum}
                    onFilter={this.onFilter}
                    onDeleteItems={this.onDeleteItems}
                    onNewItemForm={this.openNewMeetingBookForm}
                    onSort={this.onSort}
                    onPage={this.onPage}
                    onCloneMeetingBook={this.cloneMeetingBook} />
            </div>

            <MeetingBookFormModal

                loading={false}
                show={this.props.showNewItemForm}
                initialMeetingBook={{
                    Title: '',
                    Status: 'In Progress',
                    ShareWithAll: false,
                    SharedWith: []
                } as IMeetingBook}
                submitting={false}
                onModalClose={this.cancelNewMeetingBook}
                onCancel={this.cancelNewMeetingBook}
                onSave={this.saveMeetingBook}
                userService={this.props.userService} />

        </div>
    );
  }

  @autobind
  private onPage(nextUrl: string, nextPageNum: number) {
    this.actions.pageMeetingBooks(nextUrl, nextPageNum);
  }

  @autobind
  private onSort(sortField: string, sortAscending: boolean) {
    this.actions.sortMeetingBooks(sortField, sortAscending);
  }

  @autobind
  private openNewMeetingBookForm() {
      this.actions.openNewMeetingBookForm();
  }

  @autobind
  private onFilter(filter: MeetingBookFilterType) {
    this.actions.filterMeetingBooks(filter);
  }

  @autobind
  private onDeleteItems(itemIds: Array<number>) {
    this.actions.deleteMeetingBooks(itemIds);
  }

  @autobind
  private saveMeetingBook(meetingBook: IMeetingBook) {
    this.actions.addMeetingBook(meetingBook);
  }

  @autobind
  private cancelNewMeetingBook() {
    this.actions.closeMeetingBookForm();
  }

  @autobind
  private cloneMeetingBook(meetingBookId: number) {
    this.actions.cloneMeetingBook(meetingBookId);
  }
}

const mapStateToProps = (state: IRootState, ownProps: IMeetingBookListViewProps): IMeetingBookListViewProps => {

    return {
        ...state.meetingBookListViewState,
        baseUrl: ownProps.baseUrl,
        userService: ownProps.userService,
        currentUserEmail: ownProps.currentUserEmail
    };

};

export const MeetingBookListView = connect(mapStateToProps)(MeetingBookListViewComponent);
