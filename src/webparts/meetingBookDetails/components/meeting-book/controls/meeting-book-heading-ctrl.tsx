import * as React from 'react';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { SPUser } from '@microsoft/sp-page-context';


import {
    IMeetingBook
} from '../../../../../models';

export interface IMeetingBookHeadingCtrl {

    meetingBook: IMeetingBook;

    onEditView: () => void;

    currentUser: SPUser;
}

export class MeetingBookHeadingCtrl extends React.Component<IMeetingBookHeadingCtrl, any> {

    constructor(props: IMeetingBookHeadingCtrl) {

        super(props);

    }

    public render(): React.ReactElement<IMeetingBookHeadingCtrl> {

        return (
            <div className="meetingbookinfo">

                <div className="svp-mtgbk-title bootstrap-div--nopadding">
                    <span className="meetingbook-title">{this.props.meetingBook.Title}</span>
                </div>

                <div className="svp-mtgbk-status bootstrap-div--nopadding">
                    <span className="meetingbook-status">{this.props.meetingBook.Status}</span>
                </div>
                
                { this.props.currentUser.loginName.toLowerCase() === this.props.meetingBook.CreatedBy.UserName.toLowerCase() && 
                    <div className="bootstrap-div--nopadding">
                        <button type="button" 
                                className="general__button general__button--brand-primary pull-right"
                                onClick={this.props.onEditView}>Edit</button>
                    </div>
                }
            </div>
        );
    }

}
