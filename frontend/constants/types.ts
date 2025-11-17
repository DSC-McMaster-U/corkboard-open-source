export type EventData = {
  id: number,
  title: string,
  description: string | undefined,
  venue_id: number,
  //venue_name: string, // Not currently implemented
  //venue_address: string, // Not currently implemented
  start_time: string, // Date String
  cost: number | undefined,
  status: string | undefined, //Event Status Enum
  created_at: string, //Date String
  source_type: string | undefined, //Source Type Enum
  source_url: string | undefined
  ingestion_status: string | undefined, //Ingestion Status Enum
}

export type EventList = {
  events: EventData[];
  count: number;
}