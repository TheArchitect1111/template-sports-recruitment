# Canadian Prospects Recruitment Project Overview

## Purpose

Canadian Prospects Recruitment is a sports recruitment platform built to help Canadian student-athletes organize their athletic profile, submit recruiting materials, complete a fee agreement, and stay visible to college coaches.

## Current Product

The platform includes:

- A public landing page focused on basketball recruitment
- An application page for athlete profile intake and fee agreement acknowledgement
- A public player profile route at `/profile/[id]`
- An admin portal at `/admin`
- Airtable-backed athlete records
- Make webhook submission automation
- Resend confirmation email support

## Primary Audience

- Canadian student-athletes seeking college opportunities
- Parents and guardians supporting the recruiting process
- Canadian Prospects Recruitment staff
- College coaches reviewing athlete profiles

## Core Value Proposition

Canadian Prospects Recruitment helps athletes get noticed by organizing key recruiting assets, tracking outreach activity, and building a clearer pathway from application to coach contact.

## Live Routes

- `/`: Landing page
- `/apply`: Athlete application and fee agreement
- `/profile/[id]`: Player profile
- `/admin`: Admin athlete table and status management

## Key Integrations

- Airtable: Athlete database
- Make: Submission workflow automation
- Resend: Confirmation email delivery
- Vercel: Hosting and production deployment

## Production Environment Variables

- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_ID`
- `MAKE_WEBHOOK_URL`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_PASSWORD`
