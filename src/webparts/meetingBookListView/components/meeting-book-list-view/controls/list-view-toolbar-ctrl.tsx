import * as React from 'react';
import {
  Row,
  Col,
  ButtonGroup,
  Label,
  Button,
  Modal
} from 'react-bootstrap';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

import { MeetingBookFilterType } from '../../../../../models';
import { ConfirmationDialog } from '../../../../../common/confirmation-dialog';

export interface IListViewToolbarCtrlProps {

  activeFilter: MeetingBookFilterType;
  showDeleteButton: boolean;

  selection: Array<any>;

  onNewMeetingBook: () => void;
  onFilter: (filter: MeetingBookFilterType) => void;
  onDeleteItems: () => void;
  onCloneMeetingBook: (meetingBookId: number) => void;
}

export interface IListViewToolbarCtrlState {
  showDeleteConfirmation: boolean;
}

export class ListViewToolbarCtrl extends React.Component<IListViewToolbarCtrlProps, IListViewToolbarCtrlState> {
    
  constructor(props: IListViewToolbarCtrlProps) {
    super(props);

    this.state = {
      showDeleteConfirmation: false
    };


  }

  public render(): React.ReactElement<IListViewToolbarCtrlProps> {

    return (
      <div className="row">
        <div className="col-xs-4 bootstrap-div--nopadding">
          <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">

              <button 
                type="button"
                className="general__button general__button--brand-primary" 
                onClick={this.props.onNewMeetingBook}>New Meeting Book</button>

              { this.props.selection && this.props.selection.length === 1 &&
                <button type="button" className="btn btn-neutral-light" onClick={this.onClone}>
                  <i className="ms-Icon ms-Icon--Copy" aria-hidden="true"></i>
                </button>
              }
              { this.props.showDeleteButton && !!this.props.selection.length &&
                <button type="button" className="btn btn-neutral-light" onClick={this.onDelete}>
                  <i className="ms-Icon ms-Icon--Delete" aria-hidden="true"></i>
                </button>
              }
          </div>
        </div>
        <div className="col-xs-8 text-right bootstrap-div--nopadding">

          <div className="general__btn-group pull-right">
            <button 
              type="button" 
              className={`general__button general__button--default general__button--clear${this.props.activeFilter === 'Published' ? ' general__button--brand-secondary' : ''} general__button--grouped`} 
              onClick={() => this.props.onFilter('Published')}>Published</button>
            <button 
              type="button" 
              className={`general__button general__button--default general__button--clear${this.props.activeFilter === 'In Progress' ? ' general__button--brand-secondary' : ''} general__button--grouped`} 
              onClick={() => this.props.onFilter('In Progress')}>In Progress</button>
            <button 
              type="button" 
              className={`general__button general__button--default general__button--clear${this.props.activeFilter === '' ? ' general__button--brand-secondary' : ''} general__button--grouped--last`} 
              onClick={() => this.props.onFilter('')}>All</button>
          </div>

          { this.state.showDeleteConfirmation &&

            <ConfirmationDialog 
              showDialog={this.state.showDeleteConfirmation} 
              headerText="Are you sure you want to delete the meeting book(s)?"
              confirmButtonText="YES, DELETE THIS MEETING BOOK"
              cancelButtonText="NO, KEEP IT"
              onCancel={this.onCancel}
              onConfirm={this.onConfirm}
            >
                <span>By deleting this meeting book, you will also be deleting it for all users it is shared with.</span>
            </ConfirmationDialog>

          }

        </div>
      </div>

    );
  }

  @autobind
  private onCancel() {
    this.setState({
      showDeleteConfirmation: false
    });
  }

  @autobind
  private onDelete() {

    this.setState({
      showDeleteConfirmation: true
    });

  }

  @autobind
  private onConfirm() {
    this.props.onDeleteItems();

    this.setState({
      showDeleteConfirmation: false
    });
  }

  @autobind
  private onClone() {
    if (this.props.selection && this.props.selection.length === 1) {
      this.props.onCloneMeetingBook(this.props.selection[0]);
    }
  }
    
}
