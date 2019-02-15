import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { Environment, EnvironmentType } from "@microsoft/sp-core-library";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { sp } from "@pnp/sp";
import { initializeIcons } from '@uifabric/icons';

declare var tableau: any;

export interface IInitConfig {
  loadJSOM?: boolean;
  loadTableau?: boolean;
}

export abstract class BaseWebpart<T> extends BaseClientSideWebPart<T> {
  constructor(private config?: IInitConfig) {
    super();

    if (this.isRunningInDev() || this.isRunningInLocalWorkbench()) {
      const { whyDidYouUpdate } = require("why-did-you-update");
      //whyDidYouUpdate(React);
    }
  }

  protected async onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });

    if (this.isRunningInDev()) 
      await this.setupForWorkbench();

    if (this.config && this.config.loadJSOM && !this.isRunningInLocalWorkbench())
      await this.loadJsomAPI();

    if (this.config && this.config.loadTableau)
      await this.loadTableauAPI();

    initializeIcons();
    
    return super.onInit();
  }

  private setupForWorkbench(): Promise<void> {
    console.info("BaseWebpart::setupForWorkbench");

    return Promise.resolve();
  }

  private async loadTableauAPI(): Promise<void> {
    //TODO: make scriptURL webpart property
    const scriptURL = `https://viz.gallery/javascripts/api/tableau-2.2.1.min.js`;
    
    if (typeof tableau === "undefined" || (tableau && typeof tableau.Viz === "undefined")) {
      await SPComponentLoader.loadScript(scriptURL, {
          globalExportsName: "tableau"
        }
      );
    }
  }

  private async loadJsomAPI(): Promise<void> {
    try {
      const siteColUrl = this.context.pageContext.site.absoluteUrl;
      console.info("BaseWebpart::loadJSOM", siteColUrl);

      if (!(window as any).initJsLoaded) {
        await SPComponentLoader.loadScript(siteColUrl + "/_layouts/15/init.js", {
            globalExportsName: "$_global_init"
          }
        );
      }

      await SPComponentLoader.loadScript(siteColUrl + "/_layouts/15/MicrosoftAjax.js", {
          globalExportsName: "Sys"
        }
      );

      if (typeof SP === "undefined" || (SP && typeof (SP as any).ClientRuntimeContext !== "function")) {
        await SPComponentLoader.loadScript(siteColUrl + "/_layouts/15/SP.Runtime.js", {
            globalExportsName: "SP"
          }
        );
      }

      if (
        typeof SP === "undefined" || (SP && typeof (SP as any).ClientContext !== "function")) {
        await SPComponentLoader.loadScript(siteColUrl + "/_layouts/15/SP.js", {
          globalExportsName: "SP"
        });
      }

      if (
        typeof SP === "undefined" || (SP && typeof SP.Taxonomy === "undefined")) {
        await SPComponentLoader.loadScript(siteColUrl + "/_layouts/15/SP.taxonomy.js", {
            globalExportsName: "SP"
          }
        );
      }
    } 
    catch (error) {
      return Promise.reject(error);
    }

    return Promise.resolve();
  }

  private isRunningInDev(): boolean {
    return (
      window.location.pathname.indexOf("_layouts/15/workbench.aspx") > -1 ||
      Environment.type === EnvironmentType.Local
    );
  }

  private isRunningInLocalWorkbench(): boolean {
    return window.location.pathname.indexOf("/temp/workbench.html") > -1;
  }
}
