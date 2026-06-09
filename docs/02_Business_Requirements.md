# Business Requirements

## Business Goals

- Increase completed athlete applications
- Standardize intake data for recruitment review
- Improve coach outreach readiness
- Give staff an admin view of athlete status
- Create a professional public presence for Canadian Prospects Recruitment

## Functional Requirements

### Landing Page

The landing page must communicate the recruitment offer clearly and include:

- CPR brand navigation
- Hero headline: `YOUR NEXT OPPORTUNITY STARTS HERE.`
- Basketball-focused visual treatment
- Recruitment process section
- Upload types showcase
- Sample athlete profile card
- Tracking and dashboard feature section
- Stats bar
- Success stories
- Red CTA section
- Full footer with contact details

### Application Page

The `/apply` page must collect:

- Athlete identity and contact information
- Sport, position, measurements, academics, and school details
- Parent or guardian contact information
- Bio and strengths
- Highlight video URL
- Upload metadata for photo, transcript, and gameplay video
- Fee agreement acknowledgement
- NIL interest
- Terms agreement
- Digital signature

### Submission Behavior

On submit, the app must:

- Validate required fields
- POST submission data to `process.env.MAKE_WEBHOOK_URL`
- Write athlete data to Airtable when Airtable credentials are configured
- Send a confirmation email when Resend is configured
- Return a profile ID when Airtable creates a record

### Admin Portal

The `/admin` page must:

- Require the admin password
- Load athlete records from Airtable
- Display records in a table
- Filter by sport and status
- Search by athlete, email, position, or school
- Update athlete status

## Nonfunctional Requirements

- Dark theme with red primary accent
- Responsive layout for desktop and mobile
- No em dashes in source content
- Environment variables must not be committed
- Production build must pass before deployment

## Success Metrics

- Application completion rate
- Number of athlete profiles created
- Number of coach contacts made
- Number of schools reached
- Scholarship opportunity value tracked
- Admin status movement from New to Placed
