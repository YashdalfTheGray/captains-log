# Captain's Log REST API

This defines the REST API for the Captain's Log server.

All endpoints are mounted at `/api/v1`.

## Log module endpoints

### `GET /logs`

Returns the ids all of the documents stored in the pouch database.

### `POST /logs`

Creates a new document in the pouch database using `log_<current_date>` as the id for the document.

### `PUT /logs/:id`

Replaces the document at the id passed in with the document passed in.

### `DELETE /logs/:id`

Deletes the document at the passed in id. The rev of the document is also required to be passed in.

## Report module endpoints

The format for the report responses is as follows

```json
{
    "start": "{day|week} start date",
    "end": "{day|week} end date",
    "entries": [
        {
            "id": "",
            "key": "",
            "value": {
                "rev": ""
            },
            "doc": "the doc object contains all the data stored as part of this document"
        },
        "array of pouch documents that fall between the start and the end times"
    ]
}
```

### `GET /reports/day`

Generates a report for the current day, returning all the documents found along with the start and end dates.

### `GET /reports/week`

Generates a report for the current week, returning all the documents found along with the start and end dates.
