import * as React from "react";
import { autobind, Link, ActivityItem, Icon, TextField, PrimaryButton, MessageBar, MessageBarButton, MessageBarType, Label } from 'office-ui-fabric-react';
import { IReportDiscussionReply } from "../../../models";
import * as moment from 'moment';
import { ReportViewerActions } from "../../../webparts/reportViewer/action/ReportViewActions";
import './main.css';
import { Logger, LogLevel } from '@pnp/logging';
import styles from '../../reportViewer/components/ReportViewer.module.scss';
export interface IReportActivityItemProps {
  reply?: IReportDiscussionReply;
  action?: ReportViewerActions;
  currentUserId: number;
}

export interface IReportActivityItemState {
  operationClicked: string;
  postReply: string;
  loading: boolean;
}

export class ReportActivityItem extends React.Component<IReportActivityItemProps, IReportActivityItemState> {

  constructor(props: IReportActivityItemProps) {
    super(props);
    this.state = {
      operationClicked: '',
      postReply: "",
      loading: false,
    };
  }

  public componentDidMount() {
    console.info('ReportActivityItem::componentDidMount');
  }

  public render(): React.ReactNode {
    const reply = this.props.reply;
    const index= reply.likes.indexOf(this.props.currentUserId);
    const replyHTML =
    {
      key: reply.replyId,
      activityDescription: [
        <Link key={reply.replyId} className={reply.parentReplyId === null ? 'parentReply' : ''}>
          {reply.createdBy}
        </Link>,
        <span key={reply.replyId}>{reply.parentReplyId === null ? ' commented' : ' replied to comment'}</span>
      ],
      activityIcon: <Icon iconName={reply.parentReplyId === null ? 'MessageFill' : 'Message'} />,
      comments: [
        <span key={reply.replyId}> {reply.replyBody} </span>,
      ],
      timeStamp: moment(reply.createdDate).fromNow() + ' | ' + moment(reply.createdDate).format('LLLL')
    };

    return (
      <div style={{ marginBottom: '7px' }}>
        <ActivityItem  {...replyHTML} style={{ marginBottom: '2px' }} />
        <div style={{ marginLeft: '22px' }}>
          <span>
            <Icon onClick={() => this.likeClicked(reply)} style={{ cursor: 'pointer' }}
            iconName={index !== -1 ? 'LikeSolid' : 'Like'} />
            <span style={{color:'darkred',fontWeight:600}}>{reply.likes.length > 0 ? ' ' + reply.likes.length : ''}{'   '} </span>
          </span>
          {(reply.parentReplyId === null) &&
            <span><Link className='linkButton' onClick={() => this.onClicked('Reply', '')} >Reply</Link>{' | '}</span>
          }
          {(reply.createdById === this.props.currentUserId) &&
            <span><Link className='linkButton' onClick={() => this.onClicked('Edit', reply.replyBody)} >Edit</Link>{' | '}</span>
          }
          {(reply.createdById === this.props.currentUserId) &&
            <span><Link className='linkButton' onClick={() => this.onClicked('Delete', '')} >Delete</Link></span>
          }

          {this.state.operationClicked === 'Reply' &&
            <div className={styles.row} style={{ clear: 'left', marginTop: '5px' }}>
              <div className={styles.column} >
                <div style={{ width: '300px', float: 'left', marginRight: '5px' }}>
                  <TextField onChanged={this._onChanged} styles={{ fieldGroup: { width: 300 } }} placeholder='Add reply' value={this.state.postReply}></TextField>
                </div>
                <PrimaryButton disabled={(!(this.state.postReply.length > 0)) || this.state.loading} onClick={() => this.handleAdd(reply.replyId)}>Post</PrimaryButton>
              </div>
            </div>
          }
          {this.state.operationClicked === "Edit" &&
            <div className={styles.row} style={{ clear: 'left', marginTop: '5px' }}>
              <div className={styles.column} >
                <div style={{ width: '300px', float: 'left', marginRight: '5px' }}>
                  <TextField onChanged={this._onChanged} styles={{ fieldGroup: { width: 300 } }} value={this.state.postReply}></TextField>
                </div>
                <PrimaryButton disabled={(!(this.state.postReply.length > 0)) || this.state.loading} onClick={() => this.handleUpdate(reply.replyId)}>Edit Post</PrimaryButton>
              </div>
            </div>
          }
          {this.state.operationClicked === "Delete" &&
              <MessageBar isMultiline={false}
                messageBarType={MessageBarType.severeWarning}
                actions={
                  <div>
                    <MessageBarButton onClick={() => this.handleDelete("Yes", reply)}>Yes</MessageBarButton>
                    <MessageBarButton onClick={() => this.handleDelete("No", null)}>No</MessageBarButton>
                  </div>
                }
              >
                Do you wish to delete the comment?
              </MessageBar>
          }

        </div>

      </div>
    );
  }

  @autobind
  public onClicked(operation: string, replyBody) {
    switch (operation) {
      case 'Reply': this.setState({ operationClicked: this.setOperation('Reply'), postReply: replyBody });
        break;
      case 'Edit': this.setState({ operationClicked: this.setOperation('Edit'), postReply: replyBody });
        break;
      case 'Delete': this.setState({ operationClicked: this.setOperation('Delete') });
        break;
    }

  }

  @autobind
  private _onChanged(newValue: string) {
    this.setState({
      postReply: newValue || ""
    });
  }

  @autobind
  private handleAdd(parentReplyId) {
    this.setState({ loading: true });
    this.props.action.addReportDiscussionReply(this.state.postReply, parentReplyId).then(() => {
      this.setState({ postReply: "", operationClicked: '', loading: false });
    }
    );
  }


  @autobind
  private handleUpdate(replyId) {
    this.setState({ loading: true });
    this.props.action.updateReportDiscussionReply(this.state.postReply, replyId).then(() => {
      this.setState({ postReply: "", operationClicked: '', loading: false });
    });
  }

  @autobind
  private handleDelete(operationDelete, reply: IReportDiscussionReply) {
    if (operationDelete === 'No') {
      this.setState({ operationClicked: '' });
      return;
    }
    this.setState({ loading: true });
    this.props.action.deleteReportDiscussionReply(reply).then(() => {
      this.setState({ operationClicked: '', loading: false });
    });
  }

  @autobind
  private setOperation(operation): string {
    if (this.state.operationClicked === operation) {
      return '';
    }
    else {
      return operation;
    }
  }

  @autobind
  public likeClicked(reply: IReportDiscussionReply) {
    this.props.action.likeComment(this.props.currentUserId, reply.replyId);
  }

}
