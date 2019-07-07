import { Environment, EnvironmentType } from "@microsoft/sp-core-library";
import { autobind } from "office-ui-fabric-react/lib/Utilities";

import { getSiteOptions } from "./environment/index";
import { ISiteOptions } from "../../models";

const buster = require("../../../hash/styles.busters.json");

export type RuntimeCallback = (siteKey: string, envType: typeof Environment, window: any, css: Array<string>) => any | Promise<any>;
export type ConditionFn = (env: typeof Environment, window: Window) => boolean;
export type SiteKey = "atlantic" | "elektra" | "wbr" | "wc";

/**
 * Common runtime utility methods that run in the context of the 
 * provided Environment and Window.
 */
export class Runtime {

    private _fns = [];
    private _siteKey: string;
    private _cssArr: Array<string> = [];
    private _runningDev: boolean;
    private _runningModern: boolean;

    constructor(
        private _environment: typeof Environment, 
        private _window: Window,
        private _devSiteUrl: string = "https://localhost:4321",
        private _assetsDist: string = "/dist/css"
    ) {

        this.SiteOptions = getSiteOptions(this.getSiteCollectionUrl(this._window));

        this._runningDev = this.runningOnDeveloperEnvironment(this._window, this._environment);
        this._runningModern = this.runningOnModernPage(this._environment);
        this._siteKey = this.getSiteKey(this.SiteOptions);
        this._cssArr = this.collectCssUrls(this._siteKey, this._devSiteUrl, this._assetsDist);

    }

    public SiteOptions: ISiteOptions;

    /**
     * Function to get Site Collection URL
     * Samples:
     *      "https://domain.sharepoint.com/sites/intranet"
     */
    public getSiteCollectionUrl(window: Window): string {

        let baseUrl = window.location.protocol + "//" + window.location.host;

        const pathname = window.location.pathname;
        const siteCollectionDetector = "/sites/";

        if (pathname.indexOf(siteCollectionDetector) >= 0) {
            baseUrl += pathname.substring(0, pathname.indexOf("/", siteCollectionDetector.length));
        }

        return baseUrl;

    }

    /**
     * 
     * Executes a function when running in a development environment i.e., loading css.
     * 
     * @param cb - Function to run when running in a development environment.
     */
    @autobind
    public runWhenDev(cb: RuntimeCallback) {

        return this.runWhen(() => this._runningDev, cb);

    }

    /**
     * 
     * Executes a function when running on a modern page environment i.e., loading css.
     * 
     * @param cb - Function to run when running on a modern page environment.
     */
    @autobind
    public runWhenModernPage(cb: RuntimeCallback) {

        return this.runWhen(() => this._runningModern, cb);
        
    }


    /**
     * 
     * Conditionaly executes a function based on the environment and window properties.
     * 
     * @param condition - Funtion that returns a boolean true to indicate if the the callback should execute.
     * @param cb - Callback function that will run when the condition function returns true.
     */
    @autobind
    public runWhen(condition: ConditionFn, cb: RuntimeCallback) {

        if(condition(this._environment, window)) 
            this._fns.push(() => cb(this._siteKey, this._environment, window, this._cssArr));

        return this;

    }

    /**
     * 
     */
    @autobind
    public async run(): Promise<any> {

        for(const f of this._fns) {
            await f();
        }

    }

    /*******************
     * PRIVATE METHODS *
     *******************/

     /**
      * 
      * @param siteKey 
      * @param rootUrl 
      * @param distPath 
      */
    @autobind
    private collectCssUrls(siteKey: string, rootUrl: string, distPath: string) {

        const cssUrls = [];

        const fileName = `wmg-${siteKey}-portal.css`;
        const cssMasterHash = buster[`dist/css/${fileName}`];
        const masterCssUrl = `${rootUrl}${distPath}/${fileName}?wmg_ref=${cssMasterHash}`;
        cssUrls.push(masterCssUrl);

        // tslint:disable-next-line: no-console
        console.info("collectCssUrls", cssUrls);

        return cssUrls;

    }

    /**
     * 
     * @param siteOptions 
     */
    @autobind
    private getSiteKey(siteOptions: ISiteOptions): string {

        return !!siteOptions ? siteOptions.cssPrefix : "";

    }

    /**
     * Returns true if the web part context is running on a Modern SharePoint page.
     * (Note: running on the workbench will return true in this case.)
     */
    @autobind
    private runningOnModernPage(environment: typeof Environment): boolean {

        const modern = (environment.type === EnvironmentType.SharePoint);

        return modern;

    }

    /**
     * Returns true if the web part is running in a development context either
     * from localhost or any of the workbench pages (hosted and local).
     */
    @autobind
    private runningOnDeveloperEnvironment(rootWindow: Window, environment: typeof Environment): boolean {

        const dev = (rootWindow.location.pathname.indexOf("_layouts/15/workbench.aspx") > -1
                    || environment.type === EnvironmentType.Local);

        return dev;

    }

  }