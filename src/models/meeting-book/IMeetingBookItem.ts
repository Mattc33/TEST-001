import { ISPItemId } from '..';
import { MediaType } from '.';
import * as moment from 'moment';

export interface IMeetingBookItem {

    Id?: number;
    MeetingBookId: number;
    Filename: string;
    Url: string;
    EmbedHtml?: string;
    Title: string;
    Sequence: number;
    ThumbnailUrl?: string;
    DefaultThumbnailUrl?: string;
    FileExtension?: string;
    Type: MediaType;
    DocumentODataId?: string; //https://wmg.sharepoint.com/sites/Glb.AtlanticDEV/_api/Web/Lists(guid'a3aadd7f-d7fa-4522-840f-d6d2253ef7f6')/Items(4)/Folder,
    OpenInNewTab?: boolean;
    CreatedDate?: moment.Moment;
    ModifiedDate?: moment.Moment;
}

export const initialMeetingBookItem: IMeetingBookItem = {
    Id: 0,
    MeetingBookId: 0,
    Filename: '',
    Url: '',
    Title: '',
    Sequence: 0,
    ThumbnailUrl: '',
    DefaultThumbnailUrl: '',
    DocumentODataId: '',
    FileExtension: '',
    Type: 'link',
    OpenInNewTab: true
};