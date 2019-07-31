import { override } from '@microsoft/decorators';
import { Log, SPEventArgs } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import styles from './mainAppstyles.module.scss';
import * as strings from 'VpMainAppCustomizerApplicationCustomizerStrings';
const LOG_SOURCE: string = 'VpMainAppCustomizerApplicationCustomizer';
import { ReportActionsService }  from '../../services/ReportActionsService/ReportActionsService';
import { sp } from "@pnp/sp";

require('./mainAppbigstyles.module.scss');


/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IVpMainAppCustomizerApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
  trackingID: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class VpMainAppCustomizerApplicationCustomizer
  extends BaseApplicationCustomizer<IVpMainAppCustomizerApplicationCustomizerProperties> {
    private _reportActionsService: ReportActionsService;
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    console.log(`LCEVENT:onInit=${window.location.href}`);
    sp.setup({
      spfxContext: this.context
    });

    if (!(window as any).isNavigatedEventSubscribed) {
      this.context.application.navigatedEvent.add(this, this.logNavigatedEvent);
      (window as any).isNavigatedEventSubscribed = true;
    }

    console.log("Available Placeholders: ", this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(","));
    /*
    let bottomPlaceholder: PlaceholderContent = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom);
    if (bottomPlaceholder) {
      bottomPlaceholder.domElement.innerHTML = `
        <div class="${styles.footContainer}">
          <div class="${styles.insideFoot}">
                 <div class="${styles.footeritem5_first}"><img src="https://{xxxxxx.sharepoint.com}/sites/DASHQA/VisualizationAssets/Logos/sysco_bw.png"></div>
                 <div class="${styles.footeritem5_second}">&copy;2019 All Rights Reserved. Slalom LLC.</div>
          </div>
        </div>`;
    }
  */ 


    //Implementing Google Analytics - START
    let trackingID: string = this.properties.trackingID;
    if (!trackingID) {
      Log.info(LOG_SOURCE, "Tracking ID not provided");
    }else{
      var gtagScript = document.createElement("script");
      gtagScript.type = "text/javascript";
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingID}`;    
      gtagScript.async = true;
      document.head.appendChild(gtagScript);  
  
      eval(`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());    
        gtag('config',  '${trackingID}');
      `);
    }
    //Implementing Google Analytics - END
  
  return Promise.resolve();
  
   
  }

  @override
  public onDispose(): Promise<void> {

    console.log(`LCEVENT:onDispose=${window.location.href}`);
    this.context.application.navigatedEvent.remove(this, this.logNavigatedEvent);
    (window as any).isNavigatedEventSubscribed = false;
    (window as any).currentPage = '';

    return Promise.resolve();
  }

  public logNavigatedEvent(args: SPEventArgs): void {
    setTimeout(async () => {
      if ((window as any).currentPage !== window.location.href) {
        // REGISTER PAGE VIEW HERE >>>
        console.log(`LCEVENT:navigatedEvent=${window.location.href}`);
        //TODO: Read the User and Time and Page URL and Write in table somewhere.
        (window as any).currentPage = window.location.href;
        this._reportActionsService = new ReportActionsService();
        let reportId = parseInt(this.getParameterByName('reportId', window.location.href));
        console.log("Report Id",reportId);
        if(!reportId)
        {
        const favReportId = parseInt(this.getParameterByName('favReportId', window.location.href));
        console.log("favReportId Id",favReportId);
        reportId = favReportId ? await this._reportActionsService.getReportId(this.context.pageContext.web.absoluteUrl, favReportId) :null;
        }
        if(reportId)
        this._reportActionsService.AddView(this.context.pageContext.web.absoluteUrl,reportId);
      }
    }, 3000);
  }

  public getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

  

}
