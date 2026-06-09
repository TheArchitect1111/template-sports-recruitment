# Automations

## Make Webhook

Environment variable:

`MAKE_WEBHOOK_URL`

The application sends normalized athlete data to Make from `notifyMake()` in `src/lib/integrations.js`.

Trigger:

- User submits `/apply`

Payload:

- Athlete profile fields
- Parent contact fields
- Upload metadata
- Fee agreement fields
- Status
- Source
- Submitted timestamp

Recommended Make workflow:

1. Receive webhook from CPR app.
2. Validate required fields.
3. Create or update Airtable athlete record if needed.
4. Notify CPR staff by email.
5. Create a task for profile review.
6. Send family confirmation or follow-up instructions.
7. Route high-priority prospects to outreach.

## Airtable Automation

Recommended Airtable views:

- New Applications
- Reviewing
- Contacted
- Placed
- Missing Materials
- NIL Interest

Recommended Airtable automations:

- When Status changes to Reviewing, notify assigned reviewer.
- When Status changes to Contacted, log coach outreach date.
- When Status changes to Placed, add athlete to success story pipeline.
- When required materials are missing, send staff reminder.

## Resend Email

Environment variable:

`RESEND_API_KEY`

Current app behavior:

- Sends application confirmation after successful form submit when configured.

Recommended future emails:

- Application received
- Missing documents reminder
- Profile review started
- Coach outreach started
- Opportunity update

## Admin Status Automation

Admin can update statuses:

- New
- Reviewing
- Contacted
- Placed
- Closed

Each status should eventually trigger reporting or communication steps in Make or Airtable.
