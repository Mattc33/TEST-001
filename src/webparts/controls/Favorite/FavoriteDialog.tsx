import * as React from "react";
import { Dialog, DialogFooter, PrimaryButton, DefaultButton, DialogType, autobind, TextField } from 'office-ui-fabric-react';
import { Logger, LogLevel } from '@pnp/logging';

export interface IFavoriteDialogProps {
  title?: string;
  description?: string;
  showTitle?: boolean;

  onSave(title: string, description: string): void;
  onCancel(): void;
}

export interface IFavoriteDialogState {
  title?: string;
  description?: string;

  hideDialog: boolean;
}

export class FavoriteDialog extends React.Component<IFavoriteDialogProps, IFavoriteDialogState> {

  constructor(props: IFavoriteDialogProps) {
    super(props);

    this.state = {
      title: props.title,
      description: props.description,
      hideDialog: false
    };
  }

  public render(): React.ReactNode {
    return (
      <Dialog
        hidden={this.state.hideDialog}
        onDismiss={this.handleDialogCanceled}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Save Favorite',
          subText: 'Enter a custom report title and description.'
        }}
        modalProps={{
          isBlocking: false,
          containerClassName: 'ms-dialogMainOverride'
        }}>

        <div><strong>Title:</strong></div>
        <TextField placeholder="Enter custom title..."
          ariaLabel="Please enter text here" multiline rows={3}
          value={this.state.title} onChanged={this.handleTitleChanged} />

        <br />

        <div><strong>Description:</strong></div>
        <TextField placeholder="Enter custom description..."
          ariaLabel="Please enter text here" multiline rows={5}
          value={this.state.description} onChanged={this.handleDescriptionChanged} />

        <DialogFooter>
          <PrimaryButton onClick={this.handleDialogSaved} text="Save" />
          <DefaultButton onClick={this.handleDialogCanceled} text="Cancel" />
        </DialogFooter>
      </Dialog>
    );
  }

  @autobind
  private handleTitleChanged(newValue: string) {
    this.setState({
      title: newValue || ""
    });
  }

  @autobind
  private handleDescriptionChanged(newValue: string) {
    this.setState({
      description: newValue || ""
    });
  }

  @autobind
  private async handleDialogSaved() {
    Logger.write("Save clicked on save favorite dialog.", LogLevel.Verbose);
    this.setState({
      hideDialog: true
    }, () => {
      if (this.props.onSave) {
        this.props.onSave(this.state.title, this.state.description);
      }
    });
  }

  @autobind
  private async handleDialogCanceled() {
    Logger.write("Cancel clicked on save favorite dialog.", LogLevel.Verbose);
    this.setState({
      hideDialog: true
    }, () => {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    });
  }
}