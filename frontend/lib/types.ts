// file containing the types used in frontend API calls

export type Show = {
    id: string;
    title: string;
    description: string;
    venue_id: string;
    start_time: string;
    cost: number;
    status: string;
    created_at: string;
    source_type: string;
    source_url: string | null;
    ingestion_status: string;
}