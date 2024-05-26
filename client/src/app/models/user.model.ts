import { Photo } from "./photo.model";

export interface User {
    email: string;
    knownAs: string;
    created: Date;
    lastActive: Date;
    // isPrivate: boolean, // true / false
    gender: string;
    introduction?: string;
    lookingFor?: string;
    interests?: string;
    city: string;
    country: string;
    photos: Photo[];
}