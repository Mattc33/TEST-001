import { ISiteOptions } from "../../../models";

import * as viewport from "./viewport";


const environmentMap: any = {
    "https://bigapplesharepoint.sharepoint.com/sites/mbooks": viewport.atlanticDevOptions,
    "https://bigapplesharepoint.sharepoint.com/sites/svpmeetingbook": viewport.atlanticDevOptions,
    "https://bigapplesharepoint.sharepoint.com/sites/svpintg1": viewport.atlanticDevOptions
};

export const getSiteOptions: Function = (siteUrl: string): ISiteOptions => {

     const key: string = (siteUrl || "").toLowerCase();

     return environmentMap[key] as ISiteOptions || viewport.atlanticDevOptions;

};