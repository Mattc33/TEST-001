import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

import { IUserService } from '../../../../services';
import { IMeetingBook, MeetingBookViewType, MeetingBookType } from '../../../../models';

import { IRootState } from '../../reducer';

import MeetingBookManagerActionCreator from './MeetingBookManagerActionCreator';

require("../meeting-book/svpbigappleportal.css");

import { MeetingBookForm } from './controls';
import MeetingBookItems from '../meeting-book-items/meeting-book-items';

export interface IMeetingBookManagerState {

  view?: MeetingBookViewType;

  loading?: boolean;
  error?: Array<any>;

  editMode?: boolean;
  meetingBook?: IMeetingBook;

}

export const initialMeetingBookManagerState: IMeetingBookManagerState = {

  view: 'list',
  loading: false,
  error: null,
  editMode: false,
  meetingBook: null

};

export interface IMeetingBookManagerProps extends IMeetingBookManagerState {

  dispatch?: Dispatch<IRootState>;

  meetingBookId: number;
  baseUrl: string;
  hubUrl: string;

  userService: IUserService;

  onViewChange: (viewName: MeetingBookType) => void;

}



export class MeetingBookManagerComponent extends React.Component<IMeetingBookManagerProps, IMeetingBookManagerState> {

  private actions: MeetingBookManagerActionCreator;

  constructor(props: IMeetingBookManagerProps) {
    
    super(props);

    this.actions = new MeetingBookManagerActionCreator(this.props.dispatch);

  }

  public componentDidMount() {

    if(this.props.meetingBookId)
      this.actions.getMeetingBook(this.props.meetingBookId);

  }

  public componentWillReceiveProps(newProps: IMeetingBookManagerProps) {

  }

  public render(): React.ReactElement<IMeetingBookManagerProps> {

    if(this.props.loading)
      return (<div>Loading...</div>);

    if(!this.props.meetingBookId || !this.props.meetingBook)
      return (<h4> Meeting book not found.</h4>);

    return (
      <div className="wmg-meeting-book list-view">
        <div>
          <div className="row">
            <div className="col-xs-12">
              <div className="form-group">
                <button type="button" className="btn btn-neutral-dark btn-sm" onClick={this.back}>Back to meeting book</button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <MeetingBookForm
                meetingBook={this.props.meetingBook}
                editMode={this.props.editMode}
                onEditModeToggle={this.toggleEditMode}
                onFormCancel={this.handleCancel}
                onFormSave={this.handleSave}
                onViewChange={this.changeView}
                userService={this.props.userService} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className="meeting-book">
                <MeetingBookItems
                  meetingBookId={this.props.meetingBookId}
                  view={this.props.view}
                  baseUrl={this.props.baseUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );


  }

  @autobind
  private changeView(view: MeetingBookViewType) {

    this.actions.changeLayoutView(view);

  }

  @autobind
  private back(e) {

    e.stopPropagation();
    e.preventDefault();

    this.props.onViewChange('meeting');
    
  }

  @autobind
  private toggleEditMode() {

    this.actions.toggleEdit(!this.props.editMode);

  }

  @autobind
  private handleCancel() {

      this.actions.toggleEdit(false);

  }

  @autobind
  private handleSave(meetingBook: IMeetingBook) {

      this.actions.saveMeetingBook(meetingBook);

  }

  @autobind
  private changeToListView() {

      this.actions.changeLayoutView('list');

  }

  @autobind
  private changeToGridView() {

      this.actions.changeLayoutView('grid');

  }
}

const mapStateToProps = (state: IRootState, ownProps: IMeetingBookManagerProps): IMeetingBookManagerProps => {

  return {
    ...state.meetingBookManagerState,
    hubUrl: ownProps.hubUrl,
    baseUrl: ownProps.baseUrl,
    meetingBookId: ownProps.meetingBookId,
    onViewChange: ownProps.onViewChange,
    userService: ownProps.userService
  };

};



export default connect(mapStateToProps)(MeetingBookManagerComponent);
