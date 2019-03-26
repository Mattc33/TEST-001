/// <reference types="microsoft-ajax" />
/// <reference types="sharepoint" />

import { sp, ItemUpdateResult, FileAddResult, Field, Folder, WebEnsureUserResult } from '@pnp/sp';
import { dateAdd } from "@pnp/common";
import { IUserProfileService } from ".";
import { IUserProfile, IUserItem } from "../models";

const UserProfileListTitle = "User Profiles";

export class UserProfileService implements IUserProfileService {

    public loadCurrentUser(): Promise<IUserItem> {
        return sp
            .web
            .currentUser
                .usingCaching({
                    expiration: dateAdd(new Date(), "hour", 4),
                    key: "SVP_CurrentUser"
                })
                .get();
    }

    public async loadCurrentUserProfile(): Promise<IUserProfile> {
        const userItem = await this.loadCurrentUser();

        const items = await sp
            .web
            .lists
                .getByTitle(UserProfileListTitle)
            .items
                .filter(`AuthorId eq ${userItem.Id}`)
                .get();

        return (items && items.length) ? items[0] : null;
    }
}