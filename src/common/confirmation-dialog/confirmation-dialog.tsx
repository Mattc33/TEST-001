import * as React from 'react';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { Modal, Dialog } from 'office-ui-fabric-react';
import { Button } from 'react-bootstrap';

import { IMeetingBook, MeetingBookFilterType } from '../../models';


export interface IConfirmationDialogProps {

    showDialog: boolean;
    headerText: string;
    confirmButtonText: string;
    cancelButtonText: string;

    onCancel: () => void;
    onConfirm: () => void;

}

export interface IConfirmationDialogState {

}


export class ConfirmationDialog extends React.Component<IConfirmationDialogProps, IConfirmationDialogState> {

    constructor(props: IConfirmationDialogProps) {

        super(props);

    }

    public render(): React.ReactElement<IConfirmationDialogProps> {

        return (
            <Dialog 
                isBlocking={true} 
                containerClassName="wmg-new-meeting-book-modal modal-lg modal-content" 
                isOpen={this.props.showDialog} 
                onDismiss={this.props.onCancel}>
                <div className="modal-header">

                    <button type="button" className="close" onClick={this.props.onCancel} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h3 className="modal-title">{ this.props.headerText }</h3>

                </div>

                <div className="modal-body">
                    { this.props.children }
                </div>

                <div className="modal-footer">
                    <Button onClick={this.props.onCancel} bsStyle="close">{this.props.cancelButtonText}</Button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.props.onConfirm}>{this.props.confirmButtonText}</button>
                </div>
            </Dialog>

            // <Modal 
            //     isBlocking={true} 
            //     containerClassName="wmg-new-meeting-book-modal modal-lg modal-content" 
            //     isOpen={this.props.showDialog} 
            //     onDismiss={this.props.onCancel}>
            //     <div>
            //     <div className="modal-header">

            //         <button type="button" className="close" onClick={this.props.onCancel} aria-label="Close">
            //             <span aria-hidden="true">&times;</span>
            //         </button>
            //         <h3 className="modal-title">{ this.props.headerText }</h3>

            //     </div>

            //     <div className="modal-body">
            //         { this.props.children }
            //     </div>

            //     <div className="modal-footer">
            //         <Button onClick={this.props.onCancel} bsStyle="close">{this.props.cancelButtonText}</Button>
            //         <button
            //             type="button"
            //             className="btn btn-primary"
            //             onClick={this.props.onConfirm}>{this.props.confirmButtonText}</button>
            //     </div>
            //     </div>
            // </Modal>
        );
        
    }

}
