# Canadian Prospects Recruitment

A recruiting intake template for Canadian Prospects Recruitment. The app captures athlete profiles, sends submissions to Make, optionally writes directly to Airtable when an Airtable API key is configured, and can send confirmation email through Resend.

## Environment

Copy `.env.example` to `.env.local` and set any private credentials.

```env
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=appvVr6MVrJvEY0YJ
AIRTABLE_TABLE_ID=tblZwrZHi3WBR3NHZ
MAKE_WEBHOOK_URL=https://hook.us2.make.com/faigbglxfqhsmrjawbn01zlnum8aigpg
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://prospects.ca
ADMIN_PASSWORD=cpr2024
```

`AIRTABLE_API_KEY` is optional for local testing. Without it, submissions still post to the Make webhook.

## Commands

```bash
npm install
npm run dev
npm run build
```
