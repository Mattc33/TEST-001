import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'SyscoApplicationCustomizerStrings';

import styles from '../syscostyles.module.scss';

require('../syscobigstyles.module.scss');

const LOG_SOURCE: string = 'SyscoApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISyscoApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SyscoApplicationCustomizer
  extends BaseApplicationCustomizer<ISyscoApplicationCustomizerProperties> {

    private headerplaceholder: PlaceholderContent;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    console.log("Available Placeholders: ", this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(","));
/*
    if(!this.headerplaceholder){
      this.headerplaceholder =
      this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { //on dispose method
        });
        
        this.headerplaceholder.domElement.innerHTML = `
        <div class="${styles.firstclass}">
        
        </div>`;
    }*/


    let bottomPlaceholder: PlaceholderContent = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom);
    if (bottomPlaceholder) {
      bottomPlaceholder.domElement.innerHTML = `
        <div class="${styles.footContainer}">

          <div class="${styles.foot}">

          <div class="${styles.insideFoot}">

              <div class="${styles.footeritem7}">

                <span class="${styles.blurb}">Sysco is the global leader in selling, marketing and distributing food products to restaurants, healthcare and educational facilities, lodging establishments and other customers who prepare meals away from home. Its family of products also includes equipment and supplies for the food service and hospitality industries. With over 65,000 associations, the company operates approximately 300 distribution facilities across the globe and serves more than 500,000 customer locations. 
                For the fiscal year 2017 that ended July 1, 2017, the company generated sales of more than $55 billion.</span>

              </div>

              <div class="${styles.footeritem2}">
                <span class="${styles.foothead}">about</span>
                <p><a href="#">The Sysco Story</a></p>
                <p><a href="#">Annual Report</a></p>
                <p><a href="#">Corporate Social Responsibility</a></p>
                <p><a href="#">Diversity</a></p>
                <p><a href="#">News Room</a></p>
              </div>
              
              <div class="${styles.footeritem2}">
              
                <span class="${styles.foothead}">customer solutions</span>
                <p><a href="#">Product Categories</a></p>
                <p><a href="#">Sysco Brand Family</a></p>
                <p><a href="#">Services</a></p>
                <p><a href="#">Culinary Solutions</a></p>
                <p><a href="#">Technology Solutions</a></p>

              </div>
              
              <div class="${styles.footeritem2}">
              
                <span class="${styles.foothead}">resources</span>
                <p><a href="#">Suppliers</a></p>
                <p><a href="#">Investors</a></p>
                <p><a href="#">Careers</a></p>
              
              </div>
              
              <div class="${styles.footeritem2}">
              
                <span class="${styles.foothead}">contact us</span>
                <p><a href="#">Become a Customer</a></p>
                <p><a href="#">Our Locations</a></p><br/>
                <span class="${styles.foothead}">support</span>
                <p><a href="#">Report a Concern</a></p>    
              </div>
              
              <div class="${styles.footeritem1}"><a href="#"><img src="https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/SiteAssets/fb_footer.png"></a><br/><a href="#"><img src="https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/SiteAssets/tw_footer.png"></a><br/><a href="#"><img src="https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/SiteAssets/in_footer.png"></a></div>
          </div>   
          
          <div class="${styles.insideFoot}"><hr></div>

          <div class="${styles.insideFoot}">
                 <div class="${styles.footeritem5_first}"><img src="https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/SiteAssets/sysco_bw.png"><br/>&copy;2019 All Rights Reserved. Sysco Corporation.</div>
                 <div class="${styles.footeritem5_second}"><p><a href="#">Terms</a> | <a href="#">Privacy Policy</a> | <a href="#">System Usage Policy</a></p></div>
          </div>

        </div>`;
    }


    return Promise.resolve();
  }
}
