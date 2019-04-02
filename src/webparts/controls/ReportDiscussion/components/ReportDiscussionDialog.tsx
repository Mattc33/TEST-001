import * as React from "react";
import { Panel, PanelType, autobind } from 'office-ui-fabric-react';
import { Logger, LogLevel } from '@pnp/logging';

export interface IReportDiscussionDialogProps {
    onCancel(): void;
}

export interface IReportDiscussionDialogState {
  showDialog: boolean;
}

export class ReportDiscussionDialog extends React.Component<IReportDiscussionDialogProps, IReportDiscussionDialogState> {

  constructor(props: IReportDiscussionDialogProps) {
    super(props);

    this.state = {
      showDialog: true
    };
  }

  public render(): React.ReactNode {
    return (
      <Panel
        isOpen={this.state.showDialog}
        type={PanelType.customNear}
        customWidth="888px"
        onDismiss={this.handleDialogCanceled}
        headerText="Report Discussion"
        closeButtonAriaLabel="Close">

        <div>
            Comments Control goes here...
        </div>
        
      </Panel>
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
}