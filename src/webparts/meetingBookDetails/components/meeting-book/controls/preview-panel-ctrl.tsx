import * as React from "react";
import { autobind } from "office-ui-fabric-react/lib/Utilities";

// import {
//     ArtistCalendarProvider
// } from '../../../../wmgArtistCalendar/artist-calendar-provider';

import {
    IMeetingBookItem,
    EVENT_FORM_TYPE,
    CALENDAR_SERVICE,
    ISiteOptions
} from "../../../../../models";
import { ErrorMessage } from "../../../../../common/error-message";

export interface IPreviewPanelCtrlProps {

    calendarFormView: EVENT_FORM_TYPE;
    calendarDataServiceName: CALENDAR_SERVICE;

    selectedItem: IMeetingBookItem;
    context: any;

    artistTermSetName: string;
    artistTermSetId: string;

    categoryTermSetName: string;
    categoryTermSetId: string;

    siteOptions: ISiteOptions;

}

export class PreviewPanelCtrl extends React.Component<IPreviewPanelCtrlProps, any> {

    constructor(props: IPreviewPanelCtrlProps) {

        super(props);

    }

    public render(): React.ReactElement<IPreviewPanelCtrlProps> {

        const preview = this.renderPreview();
        return (
            <div className="meeting-book-viewer">
                { preview }
            </div>
        );

    }

    @autobind
    private renderPreview() {

        if(!this.props.selectedItem) {
            return <div></div>;
        }

        if(this.props.selectedItem.Url === "ERROR") {
            return <ErrorMessage show={true} error="File has been removed or you do not have permission to view this file." />;
        }

        // if(this.props.selectedItem.Type === 'calendar') {
        //     return <ArtistCalendarProvider
        //             siteOptions={this.props.siteOptions}
        //             formView={this.props.calendarFormView}
        //             dataService={this.props.calendarDataServiceName}
        //             calendarUrl={this.props.selectedItem.Url}
        //             embedded={true}
        //             context={this.props.context}
        //             artistTermSetName={this.props.artistTermSetName}
        //             artistTermSetId={this.props.artistTermSetId}
        //             categoryTermSetName={this.props.categoryTermSetName}
        //             categoryTermSetId={this.props.categoryTermSetId} />;
        // }

        if(!!this.props.selectedItem.EmbedHtml) {
            return <div dangerouslySetInnerHTML={{__html: this.props.selectedItem.EmbedHtml}}></div>;
        }

        if(!this.props.selectedItem.EmbedHtml) {
            return <iframe allowFullScreen={true} src={this.props.selectedItem.Url} width="100%" height="623px"></iframe>;
        }

        return <div></div>;

    }

}
