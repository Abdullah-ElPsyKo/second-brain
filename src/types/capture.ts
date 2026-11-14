
export type CaptureType =
    | "NOTE"
    | "IDEA"
    | "LINK"
    | "TASK";

export type CaptureStatus =
    | "INBOX"
    | "ACTIVE"
    | "ARCHIVED";

export interface Capture {
    id: string;
    title: string | null;
    content: string;
    type: CaptureType;
    status: CaptureStatus;
    createdAt: string;
    updatedAt: string;
}
