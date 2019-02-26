import * as React from 'react';
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import { ReportServiceMock } from "../../services/ReportServiceMock";
import { IReportService } from "../../services/interfaces/IReportService";
import { isTouchSupported } from 'fabric/fabric-impl';
import ReportMyFavList from "./components/ReportMyFavList";



export interface IReportMyFavProviderProps {
    context: WebPartContext;
    headerMessage:string;
    clientLabel:string;
    favReportCount:number;
}

export interface IReportMyFavProviderState {

}

//export class ReportRotatorProvider extends React.Component<IReportRotatorProviderProps, IReportRotatorProviderState> {

export class ReportMyFavProvider extends React.Component<IReportMyFavProviderProps,IReportMyFavProviderState> {
    private _IFavReportService: IReportService;

    constructor (props: IReportMyFavProviderProps) {
        super(props);

        this._IFavReportService = new ReportServiceMock();

    }

    public async componentDidMount() {
    }

    public render() : React.ReactElement<IReportMyFavProviderProps> {

        return (
            <ReportMyFavList
                {...this.props}
                controlHeaderMessage = {this.props.headerMessage}
                myFavReportService = {this._IFavReportService}
            />
        );
    }



}