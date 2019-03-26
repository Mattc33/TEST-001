import { IUserProfile, IUserItem } from "../../models";

export interface IUserProfileService {
    loadCurrentUserProfile(): Promise<IUserProfile>;
    loadCurrentUser(): Promise<IUserItem>;
}