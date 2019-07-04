import * as moment from 'moment';

export type MediaType =  'office' | 'youtube' | 'vimeo' | 'calendar' | 'link';

export interface IItemBase {
    thumbnail: string;
    url: string;
    extension: string;
}

export interface ILinkItem extends IItemBase {

    filename: string;

}

export interface ICalendarItem extends IItemBase {

}

export interface IVideoItem extends IItemBase{

    html: string;

}

export interface IDocumentItem extends IItemBase {

    filename: string;
    modifiedDate?: moment.Moment;

}

export interface IMediaItem {
    service: MediaType;
    type: 'documentItem' | 'videoItem' | 'calendarItem' | 'linkItem';
    defaultThumbnail: string;
    item: IDocumentItem | IVideoItem | ICalendarItem  | IItemBase;
    openInNewTab: boolean;
}