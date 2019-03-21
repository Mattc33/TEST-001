import * as React from 'react';
import styles from './ReportCommentsPanel.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import SlidingPane from 'react-sliding-pane';
import Modal from 'react-modal';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import  ReportComments  from "./ReportComments";


export interface IReportCommentsPanelProps {
  description: string;
}

export interface IReportCommentsPanelState {
  isPaneOpen: boolean;
  isPaneOpenLeft: boolean;
}

//TODO: Read this Article to Implement the Comments Fucntionality.
//https://www.vrdmn.com/2017/07/working-with-page-comments-rest-api-in.html
export default class ReportCommentsPanel extends React.Component<IReportCommentsPanelProps, IReportCommentsPanelState> {

  constructor(props:IReportCommentsPanelProps) {
    super(props);

    this.state = {
        isPaneOpen: false,
        isPaneOpenLeft: false
    };
  }

  public componentDidMount() {
    //Modal.setAppElement(this.el);
  }

  public render(): React.ReactElement<IReportCommentsPanelProps> {
    const reportTitle = "Report: Some Report Name 1";

    return (
      <div className={styles.ReportCommentsPanel}>

            <div style={{ marginTop: '32px' }}>
              <button className={styles.button} onClick={ () => this.setState({ isPaneOpenLeft: true }) }>
               Discussion Board
              </button> 
            </div>

            <SlidingPane
              closeIcon={<div>Close icon.</div>}
              isOpen={ this.state.isPaneOpenLeft }
              title={reportTitle}
              from='left'
              width='400px'
              onRequestClose={ () => this.setState({ isPaneOpenLeft: false }) }>
              <ReportComments></ReportComments>
            </SlidingPane>
        </div>
    );
  }
}
