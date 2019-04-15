import { ISearchResults } from '../../../models/ISearchResult';
import IResultService from '../../../services/ResultService/IResultService';
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import { SiteUserProps } from '@pnp/sp/src/siteusers';

export default interface ISearchResultProps {
    searchResults: ISearchResults;
    componentId: string;
    subheaderFieldName: string;
    context: ApplicationCustomizerContext;
    currentUser: SiteUserProps;
}