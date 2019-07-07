import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext} from '@microsoft/sp-webpart-base';

export interface IServiceConfiguration {

    spHttpClient: SPHttpClient;
    siteAbsoluteUrl: string;
    context: WebPartContext;

}