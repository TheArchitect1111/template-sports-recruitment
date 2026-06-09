# User Flows

## Athlete Application Flow

1. Athlete lands on the homepage.
2. Athlete reviews the recruitment process, upload types, tracking features, stats, and success stories.
3. Athlete clicks `APPLY NOW`.
4. Athlete completes the profile form.
5. Athlete acknowledges the fee agreement and terms.
6. Athlete submits the application.
7. System sends data to Make.
8. System creates an Airtable record.
9. System sends confirmation email through Resend when configured.
10. Athlete receives follow-up from CPR staff.

## Parent or Guardian Flow

1. Parent reviews the homepage with the athlete.
2. Parent helps complete contact, school, and agreement details.
3. Parent confirms fee acknowledgement and terms.
4. CPR team receives parent contact details for follow-up.

## Admin Review Flow

1. CPR staff opens `/admin`.
2. Staff enters the admin password.
3. Staff loads athlete records from Airtable.
4. Staff filters or searches the athlete table.
5. Staff opens a profile or reviews table details.
6. Staff updates athlete status.
7. Updated status is saved back to Airtable.

## Coach Profile Review Flow

1. CPR staff shares a `/profile/[id]` link.
2. Coach reviews athlete measurements, academics, status, bio, and strengths.
3. Coach responds to CPR staff or requests next materials.

## Status Flow

Current statuses:

- New
- Reviewing
- Contacted
- Placed
- Closed

Recommended status meaning:

- New: Application received
- Reviewing: CPR team is assessing fit and completeness
- Contacted: Outreach or follow-up is underway
- Placed: Athlete has secured an opportunity
- Closed: Application is inactive or not moving forward
