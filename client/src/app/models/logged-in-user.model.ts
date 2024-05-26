export interface LoggedInUser {
    email: string;
    token: string;
    knownAs: string;
    gender: string;
    roles: string[];
    profilePhotoUrl: string;
}