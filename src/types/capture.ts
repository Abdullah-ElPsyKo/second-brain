
export type CaptureType =
    | "NOTE"
    | "IDEA"
    | "LINK"
    | "TASK";

export type CaptureStatus =
    | "INBOX"
    | "ACTIVE"
    | "ARCHIVED";

export interface Tag {
    id: string;
    name: string;
}

export interface Domain {
    id: string;
    name: string;
}

export interface Capture {
    id: string;
    title: string | null;
    content: string;
    type: CaptureType;
    status: CaptureStatus;
    tags: Tag[];
    domain: Domain | null;
    createdAt: string;
    updatedAt: string;
}
