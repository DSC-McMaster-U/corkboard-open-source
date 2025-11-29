# Corkboard API Docs

This document provides the input and output specification for all of Corkboard's Backend Endpoints.

### Important Notes

-   All dates should be passed as a string, convereted using the method .toISOString()

## Bookmarks

`GET /api/bookmarks/`

-   Returns the users bookmarks based on the JWT Token.
-   Errors if the JWT Token is invalid or the user does not exist.
-   ##### Request Headers
    -   `Authorization: "Bearer <JWT Token>"`
    -   `Accept: "application/json"`
-   ##### Response Headers
    -   `Content-Type: "application/json"`
-   ##### Response Body

```
{
    bookmarks: [

    ] | undefined
    error: string | undefined
}
```

`POST /api/bookmarks/`

-   Bookmarks an event id for a user.
-   Errors if the JWT Token is invalid, the user does not exist, or the event does not exist.
-   Does nothing if the user has already bookmarked the event.
-   ##### Request Headers
    -   `Authorization: "Bearer <JWT Token>"`
    -   `Accept: "application/json"`
    -   `Content-Type: "application/json"`
-   ##### Request Body

```
{
	eventId: number
}
```

-   ##### Response Headers
    -   `Content-Type: "application/json"`
-   ##### Response Body

```
{
	success: boolean | undefined
	error: string | undefined
}
```

`DELETE /api/bookmarks/`

-   Deletes a bookmarked event for a user.
-   Errors if the JWT Token is invalid, the user does not exist, the event does not exist.
-   Does nothing if the user has not bookmarked the event.
-   ##### Request Headers
    -   `Authorization: "Bearer <JWT Token>"`
    -   `Accept: "application/json"`
    -   `Content-Type: "application/json"`
-   ##### Response Headers
    -   `Content-Type: "application/json"`
-   ##### Response Body

```
{
	success: boolean | undefined
	error: string | undefined
}
```

## Events

`GET /api/events`

-   Gets all events matching the passed in parameters. If no parameters are passed, it returns all events. The Errors if there is an internal error connecting to the database
-   <b>URL Parameters [All optional]</b>
    -   `limit=<number>`
    -   `min_start_time=<Date>`
    -   `max_start_time=<Date>`
    -   `min_cost=<number>`
    -   `max_cost=<number>`
    -   `latitude=<number>`
    -   `longitude=<number>`
    -   `radius=<number>`
-   ##### Request Headers
    -   `Accept: "application/json"`
-   ##### Response Headers
    -   `Content-Type: "application/json"`
-   ##### Response Body

```
{
	events: [
	    {
                id: string,
                title: string,
                description: string | undefined,
                start_time: string, (Date String)
                cost: number | undefined,
                status: string | undefined, (Event Status Enum)
                created_at: string, (Date String)
                source_type: string | undefined, (Source Type Enum)
                source_url: string | undefined,
                artist: string | undefined
                venues: {
                	id: number,
                	name: string,
                	address: string | undefined,
                	type: string | undefined (Venue Type Enum)
                },
                genres: [
                    genre_id: string,
                    genres: {
                        id: string,
                        name: string,
                    },
                ] | undefined,
        }
    ] | undefined,
    count: number | undefined,
    error: string | undefined,
}
```

`POST /api/events`

-   Creates an event with the provided fields. The associated venue must be created before this endpoint is used, otherwise the endpoint will fail
-   Errors if the JWT Token is invalid, the associated venue does not exist.
-   ##### Request Headers
    -   `Authorization: "Bearer <JWT Token>"`
    -   `Content-Type: "application/json"`
    -   `Accept: "application/json"`
-   ##### Request Body

```
{
    title: string,
    description: string | undefined
    venue_id: number,
    start_time: string, (Date String)
    cost: number | undefined,
    status: string | undefined, (Event Status Enum)
    source_type: string | undefined, (Source Type Enum)
    source_url: string | undefined
}
```

-   ##### Response Headers
    -   `Content-Type: "application/json"`
-   ##### Response Body

```
{
	id: string | undefined
	success: bool | undefined
	error: string | undefined
}
```

## Genres

`GET /api/genres`
`POST /api/genres`

## Users

`GET /api/users/`

-   Returns the current user session information based on the JWT Token.
-   Errors if the JWT token is invalid.
-   ##### Request Headers
    -   `Authorization: "Bearer <JWT Token>"`
    -   `Accept: “application/json”`
-   ##### Response Headers
    -   `Content-Type: "application/json"`
-   ##### Response Body

```
{
    user: {
	    name: string,
	    email: string,
	    id: number
    } | undefined,
    error: string | undefined,
}
```

## Venues

`GET /api/venues`
`POST /api/venues`
