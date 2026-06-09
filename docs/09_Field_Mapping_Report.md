# CPR Field Mapping Report

This report audits the athlete data flow from the Apply form to Airtable to the public athlete profile page.

## Canonical Data Flow

Apply Form -> `/api/apply` -> Airtable Athlete Intake table -> `/athlete/[id]` -> athlete profile components

## Required Field Mapping

| Form Field | Form Payload Key | Airtable Field | Profile Component |
| --- | --- | --- | --- |
| First Name | `firstName` | `First Name` | `AthleteProfileCard` name |
| Last Name | `lastName` | `Last Name` | `AthleteProfileCard` name |
| Email | `email` | `Email` | Stored for admin and contact |
| Phone | `phone` | `Phone` | Stored for admin and contact |
| Date of Birth | `dateOfBirth` | `Date of Birth` | Stored for admin review |
| Sport | `sport` | `Sport` | Stored for admin filters |
| Position | `position` | `Position` | `AthleteProfileCard` meta |
| Height | `height` | `Height` | `AthleteStatsCard` |
| Weight | `weight` | `Weight` | `AthleteStatsCard` |
| Wingspan | `wingspan` | `Wingspan` | `AthleteStatsCard` |
| School | `currentSchool` | `School` | `AthleteProfileCard` meta |
| Grad Year | `graduationYear` | `Grad Year` | `AthleteProfileCard` meta |
| GPA | `gpa` | `GPA` | `AthleteStatsCard` |
| SAT / ACT | `satScore` | `SAT / ACT` | `AthleteStatsCard` |
| Bio | `bio` | `Bio` | `AthleteProfileCard` bio section |
| Strengths | `strengths` | `Strengths` | `AthleteProfileCard` strengths section |
| Highlight Video | `highlightVideoUrl` | `Highlight Video` | `VideoSection` |
| Profile Photo | `profilePhotoUrl` | `Photo URL` | `AthleteProfileCard` image |

## Compatibility Aliases

The profile normalizer still reads earlier field names so existing Airtable data can render:

| Profile Value | Canonical Field | Legacy Fields Also Supported |
| --- | --- | --- |
| School | `School` | `Current School` |
| Grad Year | `Grad Year` | `Graduation Year`, `Grade`, `School Year` |
| SAT / ACT | `SAT / ACT` | `SAT Score`, `ACT Score` |
| Highlight Video | `Highlight Video` | `Highlight Video URL` |
| Profile Photo | `Photo URL` | `Athlete Photo`, `Photo` |

## Mismatches Fixed

| Issue | Fix |
| --- | --- |
| Apply form collected many fields, but Airtable create only stored six fields. | `normalizeAirtableApplicant()` now sends the full required profile field set. |
| Profile expected `School`, but intake used `Current School`. | Airtable now stores `School`; profile still supports both. |
| Profile expected `Grad Year`, but intake used `Graduation Year`. | Airtable now stores `Grad Year`; profile still supports prior aliases. |
| Profile expected `SAT / ACT`, but intake used `SAT Score`. | Airtable now stores `SAT / ACT`; profile still supports prior aliases. |
| Profile expected `Highlight Video`, but intake used `Highlight Video URL`. | Airtable now stores `Highlight Video`; profile still supports both. |
| Photo upload submitted only a file name through JSON. | Apply form now collects `Profile photo URL` and stores it as `Photo URL`. |

## Airtable Schema Notes

The application attempts to create missing Airtable fields automatically when Airtable reports an unknown field. If the Airtable token does not have schema permissions, the app retries record creation without unknown fields and reports dropped fields in the apply response integrations. For full profile rendering, the Athlete Intake table should include every canonical Airtable field listed above.
