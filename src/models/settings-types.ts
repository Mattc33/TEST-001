export type EVENT_FORM_TYPE = "bigapple" | "atlantic";
export type CALENDAR_SERVICE = "wcm-artist-calendar-service" | "artist-calendar-service";
export type ARTIST_SERVICE = "wcm-artist-service" | "artist-service";

export interface ISiteOptions {

    key: string;
    calendarEventForm: EVENT_FORM_TYPE;
    calendarService: CALENDAR_SERVICE;
    artistService: ARTIST_SERVICE;
    artistTermSetName: string;
    artistTermSetId: string;
    categoryTermSetName: string;
    categoryTermSetId: string;
    cssPrefix: string;
    strings?: {[stringKey: string]: string};
}