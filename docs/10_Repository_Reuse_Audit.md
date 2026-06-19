# Repository Reuse Audit

## Summary

GitHub access is working for `TheArchitect1111`, and the available repositories do contain useful pieces for turning CPR into the model portal/template.

## Repositories Reviewed

| Repository | Purpose | Stack | Reusable Features | Score | Complexity | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| `template-sports-recruitment` | Live CPR site | Next.js, React, Airtable, Resend | Applications, public profiles, admin leads, password reset, status tracking, homepage proof sections | 9 | Low | Reuse as current production base |
| `cpr-site` | Newer CPR platform build | Next.js, TypeScript, Stripe, Vercel Blob, Airtable | Coach outreach, athlete edit links, agreement flow, payments, Ask CPR, messages, documents, events, resource library, engagement scoring | 10 | Medium | Integrate module by module |
| `template-sports-recruitment-v9` | Earlier CPR visual/template build | Next.js, TypeScript, shadcn/lucide | Landing sections, admin dashboard, profile sidebar, UI components | 6 | Medium | Reference and selectively adapt |
| `ea-payments` | EA payment and proposal engine | Next.js, TypeScript, Stripe, Airtable | Checkout, proposal pages, pricing engine, portal access, admin dashboards, emails | 8 | Medium | Adapt payment architecture |
| `BrotherHub` | Hub concept/prototype | Next.js, React | Blueprint form, hub positioning, submission route | 5 | Low | Reference hub language and layout |
| `SisterHub` | Hub concept/prototype | Next.js, TypeScript | Blueprint page, public hub structure | 5 | Low | Reference hub language and layout |
| `ETFM-ASSESSMENT-` | Assessment and reset payment flow | Vite/React, Vercel API routes, Stripe, Claude | Assessment flow, AI API route, payment reset/session routes, portal concepts | 6 | Medium | Reference AI/payment flows |
| `ea-operating-system` | EA strategy/content library | Markdown, CSV, Python | Visibility Intelligence, workflows, assessments, funnels, content tracker | 7 | Low | Use as source material for platform modules |

## Reusable Component Inventory

- Player profiles: live CPR already has public profile routes and Airtable-backed profile data.
- Application intake: live CPR already writes applicant records and sends confirmation/admin emails.
- Admin dashboard: live CPR has lead management; `cpr-site` has a much richer player/outreach/admin dashboard.
- Coach outreach: `cpr-site` has coach contacts, outreach templates, coach share links, response tracking and CSV export.
- Payments: `cpr-site` and `ea-payments` both include Stripe checkout patterns; `cpr-site` is closest to CPR.
- Resource Hub: `cpr-site/lib/sections-data.ts` includes Resources, Documents, Events, Messages and Ask CPR tickets.
- Activity/Pulse: `cpr-site/lib/activity-data.ts` includes engagement score logic and athlete activity summaries.
- Hub positioning: BrotherHub and SisterHub provide lightweight hub language and blueprint flows.

## Priority Integration Roadmap

1. Keep `template-sports-recruitment` as the production CPR base.
2. Pull in `cpr-site` modules first: Resource Hub, Events/Camps, Ask CPR, Documents, Messages and engagement scoring.
3. Add Stripe payment stages from `cpr-site`, using `ea-payments` only where CPR needs broader proposal or catalog payments.
4. Expand the admin dashboard with coach outreach, player readiness, application status, payment status and Pulse-style activity.
5. Turn the CPR structure into a repeatable template for future EA portals.

