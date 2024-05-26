import { Photo } from "./photo.model";

export interface Member {
    id: string;
    age: number;
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