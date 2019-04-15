import * as React from "react";
import { Panel, PanelType, autobind, Link, TextField, PrimaryButton } from 'office-ui-fabric-react';
import { IReportDiscussion, IReportDiscussionReply } from "../../../models";
import { ReportViewerActions } from "../../../webparts/reportViewer/action/ReportViewActions";
import './main.css';
import { Logger, LogLevel } from '@pnp/logging';
import styles from '../../reportViewer/components/ReportViewer.module.scss';
import * as moment from 'moment';
import { ReportActivityItem } from './ReportActivityItem';
import * as _ from 'lodash';
export interface IReportDiscussionDialogProps {
  discussion?: IReportDiscussion;
  action?: ReportViewerActions;

  onCancel(): void;
}

export interface IReportDiscussionDialogState {
  showDialog: boolean;
  postReply: string;
  currentUserId: number;
  sortOrder:string;
  loading:boolean;
}

export class ReportDiscussionDialog extends React.Component<IReportDiscussionDialogProps, IReportDiscussionDialogState> {

  constructor(props: IReportDiscussionDialogProps) {
    super(props);

    console.info('ReportDiscussionDialog', props);

    this.state = {
      showDialog: true,
      postReply: "",
      currentUserId: 0,
      sortOrder:"Descending",
      loading: false,
    };
  }

  public componentDidMount() {
    console.info('ReportDiscussionDialog::componentDidMount');
    this.props.action.getCurrentUserId().then((id) => {
      this.setState({ currentUserId: id });
    }
    );
  }

  public render(): React.ReactNode {
    const activityList: Array<JSX.Element> = this.createActivity(this.props.discussion.replies);

    return (
      <Panel
        isOpen={this.state.showDialog}
        type={PanelType.customNear}
        customWidth="600px"
        onDismiss={this.props.onCancel}
        closeButtonAriaLabel="Close">

        <div className={styles.row}>
          <div className={styles.column}>
            <div className='discussionTitle'>ViewPort Discussion Forum</div>
            <div style={{ float: "left", fontSize: '15px' }}>: {this.props.discussion.title}</div>
          </div>
        </div>

        <div className={styles.row} style={{ clear: 'left' }}>
          <div className={styles.column}>
            <span style={{ fontWeight: 600 }}> {this.props.discussion.replies.length}</span>  Replies
          </div>
        </div>

        <div className={styles.row} style={{ clear: 'left', marginBottom: '5px', marginTop: '10px' }}>
          <div className={styles.column}>
            <div style={{ fontSize: '18px', fontWeight: 500 }}>{this.props.discussion.title} </div>
            <Link onClick={() => this.sortDiscussionReplies('Descending')} className={this.state.sortOrder==='Descending'?'Active':'inActive'}>Newest</Link>{' | '}
            <Link onClick={() => this.sortDiscussionReplies('Ascending')}  className={this.state.sortOrder==='Ascending'?'Active':'inActive'}>Oldest</Link>
          </div>
        </div>

        <div className={styles.row} style={{ clear: 'left', marginTop: '10px', marginBottom: '5px' }}>
          <div className={styles.column} >
            {activityList}
          </div>
        </div>

        <div className={styles.row} style={{ clear: 'left', marginTop: '15px', marginBottom: '5px' }}>
          <div className={styles.column} >
            <div style={{ width: '420px', float: 'left', marginRight: '5px' }}>
              <TextField onChanged={this._onChanged} styles={{ fieldGroup: { width: 420 } }} placeholder='Add reply' value={this.state.postReply}></TextField>
            </div>
            <PrimaryButton disabled={(!(this.state.postReply.length > 0)) || this.state.loading} onClick={this.handleAdd}>Post</PrimaryButton>
          </div>
        </div>

      </Panel>
    );
  }

  @autobind
  private _onChanged(newValue: string) {
    this.setState({
      postReply: newValue || ""
    });
  }


  @autobind
  private handleAdd() {
    this.setState({ loading: true });
    this.props.action.addReportDiscussionReply(this.state.postReply, null).then(() => {
      this.setState({ postReply: "",loading:false});
    }
    );
  }

  @autobind
  private async handleDialogCanceled() {
    this.setState({
      showDialog: false
    }, () => {
      if (this.props.onCancel)
        this.props.onCancel();
    });
  }

  @autobind
  private createActivity(replies: Array<IReportDiscussionReply>): Array<JSX.Element> {
    let parentActivityList: Array<JSX.Element> = [];
    let parentComments: any = replies.filter(r => r.parentReplyId === null);
    if(this.state.sortOrder==="Descending")
    {
      parentComments = _.sortBy(parentComments, (o)=> { return moment(o.createdDate); }).reverse();
    }
    else
    {
      parentComments = _.sortBy(parentComments, (o) => { return moment(o.createdDate); });
    }
   
    const parentItemList = parentComments.map((parentComment: IReportDiscussionReply) => {
      let activityList: Array<JSX.Element> = [];
      let childReplies: any = replies.filter(r => r.parentReplyId === parentComment.replyId);
      childReplies = _.sortBy(childReplies, (o) =>{ return moment(o.createdDate); }).reverse();
      const activityItemList = childReplies.map((element: IReportDiscussionReply) => {
        return (<div style={{ marginLeft: '20px' }}><ReportActivityItem reply={element} currentUserId={this.state.currentUserId} action={this.props.action} /></div>);
      });
      activityItemList.forEach((item) => {
        activityList.push(item);
      });
      return (<div><ReportActivityItem reply={parentComment} currentUserId={this.state.currentUserId} action={this.props.action} />{activityList}</div>);
    });
    parentItemList.forEach((item) => {
      parentActivityList.push(item);
    });
    return parentActivityList;
  }

  @autobind
  public sortDiscussionReplies(sortOrder: string) {
    this.setState({sortOrder},()=>
    {
      this.createActivity(this.props.discussion.replies);
    });
  }
}
