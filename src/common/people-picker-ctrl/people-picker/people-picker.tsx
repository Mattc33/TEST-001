/**
 * 
 * UNTIL WE REFACTOR OUT REDUX-FORMS AND THE OLD
 * PEOPLE PICKER, THIS CONTROL NEEDS TO BE EMBEDED IN 
 * A SUB-FOLDER TO AVOID REGRESSIONS.
 * 
 */

import * as React from 'react';
import { IPersonaProps, Persona } from 'office-ui-fabric-react/lib/Persona';
import {
  CompactPeoplePicker,
  IBasePickerSuggestionsProps,
  IBasePicker,
  ListPeoplePicker,
  NormalPeoplePicker,
} from 'office-ui-fabric-react/lib/Pickers';
import {
    autobind
} from 'office-ui-fabric-react/lib/Utilities';
import * as _ from 'lodash';

import { IUserService } from '../../../services';


export interface IPeoplePickerProps {

    placeHolderText?: string;
    multi?: boolean;

    principals: Array<any>;

    userService: IUserService;

    onChange: (value: Array<any>) => void;

}

export interface IPeoplePickerState {
    personas: Array<any>;
}

export class PeoplePicker extends React.Component<IPeoplePickerProps, IPeoplePickerState> {

    constructor(props) {

      super(props);

      this.state = {
          personas: this.getPersonaFromPrincipal(props.principals || [])
      };

    }

    public render() {

        const { multi } = this.props;

        const itemLimit = !!multi ? undefined : 1;

        const suggestionProps: IBasePickerSuggestionsProps = {
            suggestionsHeaderText: 'Suggested People',
            mostRecentlyUsedHeaderText: 'Suggested Contacts',
            noResultsFoundText: 'No results found',
            loadingText: 'Loading',
            showRemoveButtons: false,
            suggestionsAvailableAlertText: 'People Picker Suggestions available',
            suggestionsContainerAriaLabel: 'Suggested contacts'
        };

        return (

            <CompactPeoplePicker
                onItemSelected={this.onItemSelected}
                onResolveSuggestions={this._onFilterChanged}
                getTextFromItem={this.getTextFromPrincipal}
                className={'general__input people-picker'}
                itemLimit={itemLimit}
                defaultSelectedItems={this.getPersonaFromPrincipal(this.props.principals || [])}
                onChange={this.onChange}
                key={'people-picker'}
                pickerSuggestionsProps={suggestionProps}
                inputProps={{
                    'aria-label': 'People Picker',
                    placeholder: this.props.placeHolderText || ''
                }}
            />
            
        );

    }

    @autobind
    private getPersonaFromPrincipal(principals: Array<any>) {
        return principals.map(principal => {
            return {
                imageUrl: principal.picture || principal.imageUrl || '',
                imageInitials: '',
                primaryText: principal.title || principal.primaryText || '',
                secondaryText: principal.jobTitle || principal.JobTitle || '',
                tertiaryText: '',
                optionalText: '',
                principal: principal
            };
        });
    }

    @autobind
    private getTextFromPrincipal(persona: any) {
        return persona.primaryText;
    }

    @autobind
    private onChange(items: Array<any>) {

        const principals = items.map( p => p.principal);

        this.props.onChange(principals);

    }

    @autobind
    private onBlur(e) {

        // Just in case this is needed.

    }

    @autobind
    private onFocus(e) {

    }

    @autobind
    private onItemSelected(item) {
        return item;
    }

    @autobind
    private async _onFilterChanged(filterText: string, currentPersonas: IPersonaProps[], limitResults?: number) {

        if (filterText) {
            if (filterText.length > 2) {
                const users = await this.props.userService.searchUsers(filterText);

                const principals = users.map( u => {
                    return {
                        ...u,
                        principal: {
                            department: u.Department,
                            email: u.EMail,
                            id: u.Id,
                            jobTitle: u.JobTitle,
                            picture: u.imageUrl,
                            sip: u.EMail,
                            title: u.Name
                        }
                    };
                });

                const suggestions = this._removeDuplicates(principals, currentPersonas);
                return _.take(suggestions, 6);
            }
        } else {
            return Promise.resolve([]);
        }

    }

    @autobind
    private _removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]) {
        return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
    }
    
    @autobind
    private _listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[]) {
        if (!personas || !personas.length || personas.length === 0) {
            return false;
        }
        return personas.filter(item => item.primaryText === persona.primaryText).length > 0;
    }

}