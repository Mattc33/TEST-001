import * as React from "react";
import { Panel, PanelType, autobind } from 'office-ui-fabric-react';
import { IReportDiscussion, IReportDiscussionReply } from "../../../models";
import { ReportViewerActions } from "../../../webparts/reportViewer/action/ReportViewActions";

import { Logger, LogLevel } from '@pnp/logging';

export interface IReportDiscussionDialogProps {
  discussion?: IReportDiscussion;
  action?: ReportViewerActions;

  onCancel(): void;
}

export interface IReportDiscussionDialogState {
  showDialog: boolean;
}

export class ReportDiscussionDialog extends React.Component<IReportDiscussionDialogProps, IReportDiscussionDialogState> {

  constructor(props: IReportDiscussionDialogProps) {
    super(props);

    console.info('ReportDiscussionDialog', props);

    this.state = {
      showDialog: true
    };
  }

  public componentDidMount() {
    console.info('ReportDiscussionDialog::componentDidMount');
  }

  public render(): React.ReactNode {
    const items = this.props.discussion.replies.map((d: IReportDiscussionReply) => {
      return (
        <div>{d.title}</div>
      );
    });

    return (
      <Panel
        isOpen={this.state.showDialog}
        type={PanelType.customNear}
        customWidth="888px"
        onDismiss={this.props.onCancel}
        headerText="Report Discussion"
        closeButtonAriaLabel="Close">

        <div>
            { items }
        </div>

        <button type="button" onClick={this.handleAdd}>Add</button>
        <button type="button" onClick={this.handleUpdate}>Update</button>

      </Panel>
    );
  }

  @autobind
  private handleAdd() {
    this.props.action.addReportDiscussionReply("test message");
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
