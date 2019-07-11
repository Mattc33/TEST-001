import * as React from 'react';
import { Modal, Dialog } from 'office-ui-fabric-react';

import { MeetingBookForm } from './meeting-book-form';
import { IUserService } from '../../../services';
import { IMeetingBook } from '../../../models';


export interface IMeetingBookFormModalProps {

    loading: boolean;
    error?: Array<string> | string;

    show: boolean;
    initialMeetingBook: IMeetingBook;
    submitting: boolean;

    onModalClose: () => void;
    onCancel: () => void;
    onSave: (meetingBook: IMeetingBook) => void;

    userService: IUserService;

}

export class MeetingBookFormModal extends React.Component<IMeetingBookFormModalProps, {}> {

  constructor(props: IMeetingBookFormModalProps) {

    super(props);

  }

  public render(): React.ReactElement<IMeetingBookFormModalProps> {

    return (
      <Dialog 
        isBlocking={true} 
        containerClassName="wmg-calendar-modal" 
        isOpen={this.props.show} 
        onDismiss={this.props.onModalClose}>

            <MeetingBookForm

                {...this.props}
                loading={this.props.loading}
                error={this.props.error}
                initialValues={this.props.initialMeetingBook}
                submitting={this.props.submitting}
                onModalClose={this.props.onModalClose}
                onSave={this.props.onSave}
                userService={this.props.userService}

            />

        </Dialog>
    );

  }

}
