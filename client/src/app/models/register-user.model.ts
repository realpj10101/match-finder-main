import { Photo } from "./photo.model";

export interface RegisterUser {
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
    knownAs: string;
    dateOfBirth: string | undefined;
    gender: string;
    city: string;
    country: string;
}