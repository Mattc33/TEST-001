import * as React from 'react';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import * as _ from 'lodash';

import { IUserService } from '../../../../../services';

import { IMeetingBook, MeetingBookViewType } from '../../../../../models';
import { MeetingBookDisplayForm } from '.';
import { MeetingBookFormModal } from '../../../../../common/form/meeting-book-form';

export interface IMeetingBookFormState {

}

export interface IMeetingBookFormProps {

    userService: IUserService;

    meetingBook: IMeetingBook;
    editMode: boolean;

    onViewChange: (view: MeetingBookViewType) => void;
    onFormCancel: () => void;
    onFormSave: (meetingBook: IMeetingBook) => void;
    onEditModeToggle: (editMode: boolean) => void;

}

export class MeetingBookForm extends React.Component<IMeetingBookFormProps, IMeetingBookFormState> {

    constructor(props: IMeetingBookFormProps) {
        
        super(props);
        
    }


    public componentDidMount() {

    }

    public componentWillReceiveProps(newProps: IMeetingBookFormProps) {

    }


    public render(): React.ReactElement<IMeetingBookFormProps> {

        return (
            <div className="row">
                <div className="col-xs-8">

                    <MeetingBookDisplayForm
                        onEdit={this.toggleEditMode}
                        status={this.props.meetingBook.Status}
                        title={this.props.meetingBook.Title} />

                    <MeetingBookFormModal
                        loading={false}
                        show={this.props.editMode}
                        initialMeetingBook={this.props.meetingBook}
                        submitting={false}
                        onModalClose={this.handleCancel}
                        onCancel={this.handleCancel}
                        onSave={this.handleSave}
                        userService={this.props.userService} />

                </div>
                <div className="col-xs-4 text-right">

                </div>
            </div>
        );
    }

    @autobind
    private toggleEditMode() {

        this.props.onEditModeToggle(!this.props.editMode);

    }

    @autobind
    private handleCancel() {

        this.props.onFormCancel();

    }

    @autobind
    private handleSave(data) {

        const meetingBook: IMeetingBook = {
            Id: data.Id || 0,
            Title: data.Title,
            Status: data.Status,
            SharedWith: data.SharedWith,
            ShareWithAll: data.ShareWithAll
        };

        this.props.onFormSave(meetingBook);

    }

    @autobind
    private changeToListView() {

        this.props.onViewChange('list');

    }

    @autobind
    private changeToGridView() {

        this.props.onViewChange('grid');
        
    }

}