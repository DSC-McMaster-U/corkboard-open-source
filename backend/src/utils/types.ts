type VenueType =
    | "bar"
    | "club"
    | "theater"
    | "venue"
    | "outdoor"
    | "other"
    | undefined;

type IngestionType =
    | "manual"
    | "api"
    | "scraping"
    | "rss"
    | "ics"
    | "other"
    | undefined;

type EventStatus = "draft" | "hidden" | "published" | undefined;

type IngestionStatus =
    | "pending"
    | "processing"
    | "success"
    | "failed"
    | undefined;
