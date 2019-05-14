import * as React from "react";
import { Dialog, DialogFooter, PrimaryButton, DefaultButton, DialogType, autobind, TextField, Spinner, SpinnerSize, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { Logger, LogLevel } from '@pnp/logging';

export enum SaveStatus {
  None,
  SaveInProgress,
  SaveSuccess,
  SaveError
}

export interface IFavoriteDialogProps {
  title?: string;
  description?: string;
  showTitle?: boolean;
  saveState?: SaveStatus;

  onSave(title: string, description: string): void;
  onCancel(): void;
}

export interface IFavoriteDialogState {
  title?: string;
  description?: string;
  saveState?: SaveStatus;

  hideDialog: boolean;
}

export class FavoriteDialog extends React.Component<IFavoriteDialogProps, IFavoriteDialogState> {

  constructor(props: IFavoriteDialogProps) {
    super(props);

    this.state = {
      title: props.title,
      description: props.description,
      hideDialog: false,
      saveState: SaveStatus.None
    };
  }

  public static getDerivedStateFromProps(newProps: IFavoriteDialogProps, state: IFavoriteDialogState) {
    if (state.saveState !== newProps.saveState) {
      return (newProps.saveState === SaveStatus.SaveSuccess) 
        ? { hideDialog: true }
        : { saveState: newProps.saveState };
    }

    return null;
  }

  public render(): React.ReactNode {
    const subText = (this.state.saveState === SaveStatus.None)
      ? "Enter a custom report title and description." 
      : "";

    return (
      <Dialog
        hidden={this.state.hideDialog}
        onDismiss={this.handleDialogCanceled}
        onDismissed={this.handleDialogClosed}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: 'Save Favorite',
          subText: subText
        }}
        modalProps={{
          isBlocking: false,
          containerClassName: 'ms-dialogMainOverride'
        }}>

        { this.state.saveState === SaveStatus.None && 
          <React.Fragment>
            <div><strong>Title:</strong></div>
            <TextField placeholder="Enter custom title..."
              ariaLabel="Please enter text here" multiline rows={3}
              value={this.state.title} onChanged={this.handleTitleChanged} />

            <br />

            <div><strong>Description:</strong></div>
            <TextField placeholder="Enter custom description..."
              ariaLabel="Please enter text here" multiline rows={5}
              value={this.state.description} onChanged={this.handleDescriptionChanged} />
          </React.Fragment>
        }

        { this.state.saveState === SaveStatus.SaveInProgress && 
          <Spinner size={SpinnerSize.large} label="Saving report in favorite list, wait..." ariaLive="assertive" />
        }

        { this.state.saveState === SaveStatus.SaveSuccess && 
          <MessageBar messageBarType={MessageBarType.success}>
            <strong>Successfully saved this report in your favorite list.</strong>
          </MessageBar>
        }

        { this.state.saveState === SaveStatus.SaveError && 
          <MessageBar messageBarType={MessageBarType.error}>
            <strong>Error occured while saving report in your favorite list.</strong>
          </MessageBar>
        }

        <DialogFooter>
          <PrimaryButton onClick={this.handleDialogSaved} text="Save" disabled={this.state.saveState !== SaveStatus.None} />
          <DefaultButton onClick={this.handleDialogCanceled} text="Close" />
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
    if (this.props.onSave)
      this.props.onSave(this.state.title, this.state.description);
  }

  @autobind
  private async handleDialogCanceled() {
    this.setState({
      hideDialog: true
    }, () => {
      if (this.props.onCancel) {
        //this.props.onCancel();
      }
    });
  }

  @autobind
  private async handleDialogClosed() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
}