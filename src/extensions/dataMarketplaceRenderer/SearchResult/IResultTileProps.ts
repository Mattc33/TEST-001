import { ISearchResult } from "../../../models/ISearchResult";
import { SiteUserProps } from '@pnp/sp/src/siteusers';

export default interface IResultTileProps {
  result: ISearchResult;
  currentUser: SiteUserProps;
}