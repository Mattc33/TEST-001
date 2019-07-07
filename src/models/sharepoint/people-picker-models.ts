import { IUser } from "../.";

// export interface IUser {
    
//     Id: number;
//     Name: string;
//     EMail: string;
//     Department: string;
//     JobTitle: string;
//     FirstName: string;
//     LastName: string;
//     UserName: string;

// }

export interface IPeoplePickerUser extends IUser {
    imageUrl: string;
    imageInitials: string;
    primaryText: string;
}