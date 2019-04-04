import * as React from 'react';
import { autobind } from 'office-ui-fabric-react';
import { IReportItem  } from "../../../../models";

export const IMAGE_SUPPORTED_TOOLBAR = ["comment", "savecustom", "feedback", "share", "fullscreen"];

export interface IImageReportProps {
    reportURL: string;
    height?: number;
    width?: number;
}
 
export interface IImageReportState {
    
}
 
class ImageReport extends React.Component<IImageReportProps, IImageReportState> {

    constructor(props: IImageReportProps) {
        super(props);
    }

    @autobind
    public render() { 
        const divStyles = {
            height: this.props.height,
            width: this.props.width
        };

        const imgStyles = {
            display: "block",
            maxWidth: this.props.width,
            maxHeight: this.props.height,
            width: "auto",
            height: "auto"
        };

        return ( 
            <div style={divStyles}>
                <img src={this.props.reportURL} style={imgStyles} />
            </div>
         );
    }
}
 
export { ImageReport };