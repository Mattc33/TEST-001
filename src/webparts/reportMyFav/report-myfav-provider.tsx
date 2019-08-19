import * as React from 'react';
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import { ReportServiceMock } from "../../services/MockServices/ReportServiceMock";
import { isTouchSupported } from 'fabric/fabric-impl';
import ReportMyFavList from "./components/ReportMyFavList/ReportMyFavList";
import { IReportFavoriteService } from "../../services/interfaces/IReportFavoriteService";
import { IReportService } from "../../services/interfaces/IReportService";
import { ReportFavoriteService } from "../../services/ReportFavoriteService";
import { IReportFavoriteItem } from "../../models/IReportItem";
import { ReportActionsService } from "../../services/ReportActionsService/ReportActionsService";

export interface IReportMyFavProviderProps {
    context: WebPartContext;
    headerMessage:string;
    clientLabel:string;
    viewNameLabel: string;
    favReportCount:number;
    visualizationTitle:string;
    visualizationImage:string;
   SVPVisualizationImage: string;
}

export interface IReportMyFavProviderState {
    myFavReportItemsinState: IReportFavoriteItem[];
}

//export class ReportRotatorProvider extends React.Component<IReportRotatorProviderProps, IReportRotatorProviderState> {

export class ReportMyFavProvider extends React.Component<IReportMyFavProviderProps,IReportMyFavProviderState> {
    private _IFavReportService: IReportFavoriteService;
    private _ReportActionsService: any;
    //private _IFavReportServiceNew: IReportFavoriteService;
    private _siteUrl: string;

    constructor (props: IReportMyFavProviderProps) {
        super(props);
        this.state = { myFavReportItemsinState: []};

        //this._IFavReportService = new ReportServiceMock();
        this._IFavReportService = new ReportFavoriteService(this.props.context);
        this._ReportActionsService = new ReportActionsService();

    }


    public async componentDidMount() {

    }

    public render() : React.ReactElement<IReportMyFavProviderProps> {

        this._siteUrl = this.props.context.pageContext.site.absoluteUrl;

        return (
            <ReportMyFavList
                {...this.props}
                controlHeaderMessage = {this.props.headerMessage}
                siteUrl = {this._siteUrl}
                loggedInUserName = {this.props.context.pageContext.user.displayName}
                viewName = {this.props.viewNameLabel}
                myFavReportService = {this._IFavReportService}
                reportActionService ={this._ReportActionsService}
                reportCount = {this.props.favReportCount}
                visualizationTitle = {this.props.visualizationTitle}
                visualizationImage = {this.props.visualizationImage}
            />
        );
    }



}