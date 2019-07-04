import { ISiteOptions } from '../../../models/settings-types';

export const atlanticDevOptions: ISiteOptions = {

    key: 'atlantic-dev',
    calendarEventForm: 'atlantic',
    calendarService: 'artist-calendar-service',
    artistService: 'artist-service',
    artistTermSetName: 'DEV WMG Artists',
    artistTermSetId: '28f0b46e-5831-4e6b-8ef2-293b15d0c3e2',
    categoryTermSetName: 'DEV WMG Event Categories',
    categoryTermSetId: '08b3caf2-43c4-4f0e-a05f-ee148bbbed20',
    cssPrefix: 'atlantic',
    strings: {
        ARTIST: 'Artist',
        EVENT_CATEGORY: 'Event Category',

    },
    
};

export const atlanticQAOptions: ISiteOptions = {
    
    key: 'atlantic-qa',
    calendarEventForm: 'atlantic',
    calendarService: 'artist-calendar-service',
    artistService: 'artist-service',
    artistTermSetName: 'QA WMG Artists',
    artistTermSetId: '70c4aa56-9c09-4deb-a751-1545799f12f2',
    categoryTermSetName: 'QA WMG Event Categories',
    categoryTermSetId: 'f6c02279-348f-4125-b83a-1a9d51ce6b1b',
    cssPrefix: 'atlantic',
    strings: {
        ARTIST: 'Artist',
        EVENT_CATEGORY: 'Event Category',

    },
    
};

export const atlanticProdOptions: ISiteOptions = {

    key: 'atlantic-prod',
    calendarEventForm: 'atlantic',
    calendarService: 'artist-calendar-service',
    artistService: 'artist-service',
    artistTermSetName: 'WMG Artists',
    artistTermSetId: 'e84a636f-01b1-4dce-8839-769c7d403e5b',
    categoryTermSetName: 'WMG Event Categories',
    categoryTermSetId: '6114d1d8-6ed4-4760-b8df-a603ef966f0d',
    cssPrefix: 'atlantic',
    strings: {
        ARTIST: 'Artist',
        EVENT_CATEGORY: 'Event Category',
        
    },
    
};