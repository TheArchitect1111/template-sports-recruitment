# Database Schema

## Airtable Base

Base ID:

`appvVr6MVrJvEY0YJ`

Table ID:

`tblZwrZHi3WBR3NHZ`

## Current Athlete Intake Fields

The current CPR Airtable table accepts only these fields from the application:

| Field Name | Type | Notes |
| --- | --- | --- |
| First Name | Single line text | Required |
| Last Name | Single line text | Required |
| Email | Email | Required |
| Phone | Phone | Required |
| Date of Birth | Date | Required |
| Sport | Single line text or select | Required |

The application maps these fields through `normalizeAirtableApplicant()` in `src/lib/integrations.js`.

## Future Recommended Fields

These fields are useful for the full CPR workflow, but they should not be sent to Airtable until they exist in the table:

| Field Name | Type | Notes |
| --- | --- | --- |
| Position | Single line text | Required |
| Height | Single line text | Example: 6'2" |
| Weight | Single line text | Example: 175lbs |
| Wingspan | Single line text | Optional |
| GPA | Number or single line text | Optional |
| SAT Score | Number or single line text | Optional |
| Current School | Single line text | Required |
| Graduation Year | Single line text | Required |
| City/Province | Single line text | Required |
| Parent Name | Single line text | Required |
| Parent Email | Email | Required |
| Parent Phone | Phone | Required |
| Bio | Long text | Athlete summary |
| Strengths | Long text | Athletic strengths |
| Highlight Video URL | URL | YouTube, Hudl, Drive, or similar |
| Photo Upload | Single line text | File name metadata |
| Transcript Upload | Single line text | File name metadata |
| Gameplay Video Upload | Single line text | File name metadata |
| Fee Agreement | Single line text | Agreement status |
| NIL Interest | Single select | Yes or No |
| Terms Agreement | Single line text | Agreement status |
| Digital Signature | Single line text | Required |
| Status | Single select | New, Reviewing, Contacted, Placed, Closed |
| Source | Single line text | Canadian Prospects Recruitment |
| Submitted At | Date time | ISO timestamp |

## Notes

- Current upload fields store file names only. A storage provider should be added before production file hosting is expected.
- Airtable field names must match the app mapping exactly unless the code is updated.
- Status updates are currently not written to Airtable because the current table does not include a `Status` field.
