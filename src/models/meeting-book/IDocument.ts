import * as moment from 'moment';

export interface IDocument {

    Id: number;
    ODataId: string;
    Name: string;
    DateModified: moment.Moment;
    IsLibrary: boolean;
    IsSite: boolean;
    IsFolder: boolean;
    Url: string;
    SourceUrl: string;
    ThumbnailUrl: string;
    DefaultThumbnail: string;
    Filename: string;
    Extension: string;

}

export const initialDocument: IDocument = {
    Id: 0,
    ODataId: '',
    Name: '',
    DateModified: moment(),
    IsLibrary: false,
    IsSite: false,
    IsFolder: false,
    Url: '',
    SourceUrl: '',
    ThumbnailUrl: '',
    DefaultThumbnail: '',
    Filename: '',
    Extension: ''
};