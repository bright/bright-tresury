# 12. App events

Date: 2021-10-04

## Status

Accepted

## Context

We need to provide mechanism for notifying users about various events in the app. There are two approaches:

-   we can store only the minimal information (i.e. only the created entity id) and query the database anytime we need more data (i.e. to send the notification with some details).
-   we can store all the additional data along with the event. This will cause data duplication.

If we store additional data along with the event we need to find a solution on how to handle the additional data structure changes.

## Decision

We decided to store additional contextual data, but just the minimal of them.
If we need to change the additional data structure of some event, we need to create new event type and the contextual data interface for it.
The new event type should add ordinal number suffix (i.e. original event name is `NEW_IDEA_COMMENT`, the next event name would be `NEW_IDEA_COMMENT_1`)

## Consequences

-   If we need more data to display we need to get them from database
-   If we want to change the structure of the stored event details, we need to create a new event.
