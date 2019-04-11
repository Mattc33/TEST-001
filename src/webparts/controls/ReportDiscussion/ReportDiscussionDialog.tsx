import * as React from "react";
import { Panel, PanelType, autobind, Link , ActivityItem, Icon, TextField, PrimaryButton } from 'office-ui-fabric-react';
import { IReportDiscussion, IReportDiscussionReply } from "../../../models";
import * as moment from 'moment';
import { ReportViewerActions } from "../../../webparts/reportViewer/action/ReportViewActions";
import './main.css';
import { Logger, LogLevel } from '@pnp/logging';
import styles from '../../reportViewer/components/ReportViewer.module.scss';
export interface IReportDiscussionDialogProps {
  discussion?: IReportDiscussion;
  action?: ReportViewerActions;

  onCancel(): void;
}

export interface IReportDiscussionDialogState {
  showDialog: boolean;
  postReply:string;
}

export class ReportDiscussionDialog extends React.Component<IReportDiscussionDialogProps, IReportDiscussionDialogState> {

  constructor(props: IReportDiscussionDialogProps) {
    super(props);

    console.info('ReportDiscussionDialog', props);

    this.state = {
      showDialog: true,
      postReply:"",
    };
  }

  public componentDidMount() {
    console.info('ReportDiscussionDialog::componentDidMount');
  }

  public render(): React.ReactNode {
    const activityItemList = this.props.discussion.replies.map((d: IReportDiscussionReply) => {
      return(
        {
          key: 1,
          activityDescription: [
            <Link
              key={1}             
            >
             {d.createdBy}
            </Link>,
            <span key={2}> commented</span>
          ],
          activityIcon: <Icon iconName={'Message'} />,
          comments: [
            <span key={1}> {d.replyBody} </span>,
          ],
          timeStamp:moment(d.createdDate).fromNow() + ' | ' + moment(d.createdDate).format('LLLL')
        }
      
      );
    });
    
    const activityList: Array<JSX.Element> = [];
    activityItemList.forEach((item: { key: string | number }) => {
      const props = item;
      activityList.push(<ActivityItem {...props} key={item.key}  />);
    });

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
            <div style={{float:"left",fontSize:'15px'}}>: {this.props.discussion.title}</div>  
          </div>      
        </div>
        <div className={styles.row} style={{clear: 'left'}}>
          <div className={styles.column}>
          <span style={{fontWeight:600}}> {this.props.discussion.replies.length}</span>  Replies 
          </div>
        </div>
        <div className={styles.row} style={{clear: 'left',marginBottom:'5px',marginTop:'10px'}}>
          <div className={styles.column}>
            <div style={{fontSize:'18px',fontWeight:500}}>{this.props.discussion.title} </div>
            <Link>Oldest</Link>{' '} 
            <Link>Newest</Link>
          </div>
        </div>
        <div className={styles.row} style={{clear: 'left', marginTop:'10px',marginBottom:'5px'}}>
          <div className={styles.column} >
            {activityList}
          </div>
        </div> 
        <div className={styles.row} style={{clear: 'left', marginTop:'15px',marginBottom:'5px'}}>
          <div className={styles.column} >
          <div style={{width:'450px', float:'left',marginRight:'5px'}}>
          <TextField onChanged={this._onChanged} styles={{ fieldGroup: { width: 450 } }} placeholder='Add reply' value={this.state.postReply}></TextField>
          </div>
          <PrimaryButton  onClick={this.handleAdd}>Post</PrimaryButton>
          </div>
        </div>          
        
        <button type="button" onClick={this.handleUpdate}>Update</button>

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
    this.props.action.addReportDiscussionReply(this.state.postReply).then(()=>
    {
    this.setState({postReply:""});
    }
    );
  }

  @autobind
  private handleUpdate() {
    this.props.action.updateReportDiscussionReply(2, "update message");
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
}
