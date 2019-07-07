import { 
    SPHttpClient, 
    ISPHttpClientOptions, 
} from '@microsoft/sp-http';
import { PrincipalType } from '@pnp/sp';
import * as _ from 'lodash';

import { IServiceConfiguration } from '../models';
import { IUserService } from '.';

import {
    IPeoplePickerUser
} from '../models';

export class SPUserService implements IUserService {

    private spHttpClient: SPHttpClient;
    private siteAbsoluteUrl: string;

    private cachedPersonas: { [property: string]: Array<any> };
    private cachedLocalUsers: { [siteUrl: string]: Array<any> };


    constructor(config: IServiceConfiguration){

        this.spHttpClient = config.spHttpClient;
        this.siteAbsoluteUrl = config.siteAbsoluteUrl;

        this.cachedPersonas = {};
        this.cachedLocalUsers = {};
        this.cachedLocalUsers[this.siteAbsoluteUrl] = [];

    }

    public async searchUsers(keyword: string): Promise<any> {

        try {

            const type: PrincipalType = PrincipalType.User;

            // PrincipalType controls the type of entities that are returned in the results.
            // Choices are All - 15, Distribution List - 2 , Security Groups - 4, SharePoint Groups - 8, User - 1.
            // These values can be combined (example: 13 is security + SP groups + users)
            let principalType: PrincipalType = type;

            let userRequestUrl = `${this.siteAbsoluteUrl}` +
                `/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser`
                .replace(/\/\//g, '/');

            const userQueryParams = {
                'queryParams': {
                    'AllowEmailAddresses': true,
                    'AllowMultipleEntities': false,
                    'AllUrlZones': false,
                    'MaximumEntitySuggestions': 11,
                    'PrincipalSource': 15,      
                    'PrincipalType': principalType,
                    'QueryString': keyword
                }
            };

            const httpPostOptions: ISPHttpClientOptions = {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(userQueryParams)
            };

            // Do the call against the People REST API endpoint
            const data = await this.spHttpClient.post(
                userRequestUrl, 
                SPHttpClient.configurations.v1, 
                httpPostOptions);

            if (data.ok) {

                const userDataResp = await data.json();
                if (userDataResp && userDataResp.value && userDataResp.value.length > 0) {

                    let values: any = userDataResp.value;

                    if (typeof userDataResp.value === "string") {
                        values = JSON.parse(userDataResp.value);
                    }

                    // Filter out "UNVALIDATED_EMAIL_ADDRESS"
                    values = values.filter(v => !(v.EntityData && v.EntityData.PrincipalType && v.EntityData.PrincipalType === "UNVALIDATED_EMAIL_ADDRESS"));

                    for (const value of values) {
                        // Only ensure the user if it is not a SharePoint group
                        if (!value.EntityData || (value.EntityData && typeof value.EntityData.SPGroupID === "undefined")) {
                            const id = await this.ensureUser(value.Key);
                            value.Key = id;
                        }
                    }

                    // Filter out NULL keys
                    values = values.filter(v => v.Key !== null);

                    const userResults = values.map(element => {
                        switch (element.EntityType) {
                            case 'User':
                                const email : string = element.EntityData.Email !== null ? element.EntityData.Email : element.Description;

                                return {
                                    Id: element.Key,
                                    Name: element.DisplayText,
                                    EMail: email,
                                    Department: '',
                                    JobTitle: '',
                                    FirstName: '',
                                    LastName: '',
                                    UserName: email,
                                    imageUrl: this.generateUserPhotoLink(email),
                                    imageInitials: this.getFullNameInitials(element.DisplayText),
                                    primaryText: element.DisplayText,
                                } as IPeoplePickerUser;
                            case 'SecGroup':
                                // return {
                                //     id: element.Key,
                                //     imageInitials: this.getFullNameInitials(element.DisplayText),
                                //     text: element.DisplayText,
                                //     secondaryText: element.ProviderName
                                // } as IPeoplePickerUserItem;
                            case 'FormsRole':
                                // return {
                                //     id: element.Key,
                                //     imageInitials: this.getFullNameInitials(element.DisplayText),
                                //     text: element.DisplayText,
                                //     secondaryText: element.ProviderName
                                // } as IPeoplePickerUserItem;
                            default:
                                // return {
                                //     id: element.EntityData.SPGroupID,
                                //     imageInitials: this.getFullNameInitials(element.DisplayText),
                                //     text: element.DisplayText,
                                //     secondaryText: element.EntityData.AccountName
                                // } as IPeoplePickerUserItem;
                        }
                    });

                    return userResults;
                }
            }

            // Nothing to return
            return [];

        } catch (e) {
            console.error("SPUserService::searchUsers: error occured while fetching the users.");
            return [];
        }
    
    }

    /**
     * Generates Initials from a full name
     */
    private getFullNameInitials(fullName: string): string {
        if (fullName === null) {
            return fullName;
        }

        const words: string[] = fullName.split(' ');

        if (words.length === 0) {
            return '';
        } else if (words.length === 1) {
            return words[0].charAt(0);
        } else {
            return (words[0].charAt(0) + words[1].charAt(0));
        }
    }

    /**
     * Generate the user photo link
     *
     * @param value
     */
    private generateUserPhotoLink(value: string): string {
        return `https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=${value}&UA=0&size=HR96x96`;
    }

    /**
     * Retrieves the local user ID
     *
     * @param userId
     */
    private async ensureUser(userId: string): Promise<number> {

        const siteUrl = this.siteAbsoluteUrl;

        if (this.cachedLocalUsers && this.cachedLocalUsers[siteUrl]) {
            const users = this.cachedLocalUsers[siteUrl];
            const userIdx = _.findIndex(users, u => u.LoginName === userId);
            if (userIdx !== -1) {
                return users[userIdx].Id;
            }
        }

        const restApi = `${siteUrl}/_api/web/ensureuser`;
        const data = await this.spHttpClient.post(restApi, SPHttpClient.configurations.v1, {
            body: JSON.stringify({ 'logonName': userId })
        });

        if (data.ok) {
            const user: any = await data.json();
            if (user && user.Id) {
                this.cachedLocalUsers[siteUrl].push(user);
                return user.Id;
            }
        }

        return null;

    }



}