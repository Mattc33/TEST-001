export interface IUserId {
    NameId: string;
    NameIdIssuer: string;
}

export interface IUserItem {
    Id: number;
    IsHiddenInUI: boolean;
    LoginName: string;
    Title: string;
    PrincipalType: number;
    Email: string;
    IsEmailAuthenticationGuestUser: boolean;
    IsShareByEmailGuestUser: boolean;
    IsSiteAdmin: boolean;
    UserId: IUserId;
    UserPrincipalName: string;
}
