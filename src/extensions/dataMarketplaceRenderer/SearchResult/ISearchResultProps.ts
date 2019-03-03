import { ISearchResults } from '../../../models/ISearchResult';
import IResultService from '../../../services/ResultService/IResultService';
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';

export default interface ISearchResultProps {
    searchResults: ISearchResults;
    componentId: string;
    subheaderFieldName: string;
    context: ApplicationCustomizerContext;
}