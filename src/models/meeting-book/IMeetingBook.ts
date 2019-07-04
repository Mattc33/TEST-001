import { IPeoplePickerUser, MeetingBookFilterType } from '..';
import * as moment from 'moment';



export interface IMeetingBook {

    Id: number;
    Title: string;
    Status: MeetingBookFilterType;
    SharedWith?: Array<any>;
    ShareWithAll?: boolean;
    CreatedBy?: IPeoplePickerUser;
    Created?: moment.Moment;
    Modified?: moment.Moment;
    LastUpdate?: moment.Moment;
    
}

export interface IMeetingBookResponse {
    result: Array<IMeetingBook>;
    nextPage?: string;
}

export const initialMeetingBook: IMeetingBook = {
    Id: 0,
    Title: '',
    Status: 'In Progress',
    SharedWith: [],
    CreatedBy: null,
    ShareWithAll: false
};