# Canadian Prospects Recruitment

A dark theme sports recruitment platform for Canadian Prospects Recruitment.

Brand colors:

- Primary red: `#CC0000`
- Background black: `#0A0A0A`

## Pages

- `/` landing page with navigation, hero, player card, five step process, stats, testimonials, CTA, and footer
- `/apply` athlete profile and fee agreement application
- `/profile/[id]` public player profile powered by Airtable
- `/admin` password protected athlete table with filters and status management

## Integrations

- Form submissions post to `MAKE_WEBHOOK_URL`
- Athlete data is written to Airtable
- Admin reads and updates Airtable records
- Resend sends an application confirmation when configured

## Environment

Copy `.env.example` to `.env.local` and set private credentials.

```env
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=appvVr6MVrJvEY0YJ
AIRTABLE_TABLE_ID=tblZwrZHi3WBR3NHZ
MAKE_WEBHOOK_URL=https://hook.us2.make.com/faigbglxfqhsmrjawbn01zlnum8aigpg
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://prospects.ca
ADMIN_PASSWORD=CPRAdmin2024
```

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```
