# SMS Funnel — Klaviyo Setup (PARKED)

> **This is not active.** SMS was dropped before the August 2026 release
> because carrier toll-free verification takes 1–3+ weeks and could not clear
> in time. The signup form is **email-only** today, and the site collects no
> phone numbers.
>
> Kept because the research and copy are still good if SMS gets picked back
> up. To revive it you would need to: re-add the phone field and TCPA consent
> checkbox to `FanSignup.tsx`, restore the `sms` subscription block and E.164
> normalisation in `subscribe.ts`, and put the text-message program section
> back into `/terms` plus the mobile-information clause in `/privacy`.
> Everything below then applies as written.

Site side: the signup form posts to `subscribeFan` in
[`app/actions/subscribe.ts`](../app/actions/subscribe.ts), which calls Klaviyo's
Bulk Subscribe Profiles endpoint. That endpoint is used specifically because it
writes an auditable consent record — a plain profile-create does not, and would
fail a carrier audit.

---

## 1. Decide on double opt-in (do this first)

The `SMS List` (`Tx2YYk`) is currently set to **double opt-in**. That means when
someone submits the form, Klaviyo sends a confirmation message and they are
**not subscribed** until they reply/click to confirm.

| | Double opt-in (current) | Single opt-in |
|---|---|---|
| Consent strength | Strongest. Best evidence in a carrier audit or complaint. | Still valid — our form captures explicit checkbox consent. |
| Conversion | Lower. Every unconfirmed signup is lost. | Higher. |
| Friction | Extra step, on a phone, from a link in a text. | None. |

**Recommendation: keep double opt-in for SMS.** Sam is building this list from
scratch right before a release, and a clean list with provable consent is worth
more than a bigger one — especially since a spam complaint rate on a new number
can get the number shut off entirely.

If you'd rather trade that for volume: **Lists & segments → SMS List →
Settings → Consent → single opt-in.** No code change either way.

## 2. Toll-free verification — full walkthrough

This is the long pole — typically **1–3+ weeks**, and it gates whether any text
can legally send. Nothing else here matters if this hasn't started.

> Throughout, `DOMAIN` means the site's real public domain. As of setup,
> `samsuen.com` did not resolve in DNS — confirm the live domain and use it
> consistently, because carriers fetch every URL you submit.

### Step 0 — before you open Klaviyo

Three things must be true or the application gets rejected:

1. **`DOMAIN/privacy` and `DOMAIN/terms` are deployed and publicly reachable.**
   Open both in a private/incognito window. If either 404s, stop and deploy.
2. **The signup form is live** at `DOMAIN/#early-access`, showing the consent
   checkbox. Reviewers look for it.
3. **You have the business details:** legal business name, a real street
   address (no PO boxes), and a contact name, email, and phone.

### Step 1 — enable SMS on the account

Klaviyo account menu (bottom-left, "SAM SUEN") → **Settings** → **SMS**.

If SMS has never been set up, there's a **Set up SMS** / **Get started**
button. SMS is billed separately from email and needs an SMS plan or credits
on the account — you may be asked to add billing here.

### Step 2 — get the sending number

Choose **United States** as the sending country. Klaviyo offers:

| Type | Use it? |
|---|---|
| **Toll-free** (833/844/855/866/877/888) | **Yes.** Free, fast to provision, right for an artist list. |
| 10DLC (local area code) | No. Separate registration, more paperwork, no benefit here. |
| Short code (5–6 digits) | No. Thousands of dollars and months of lead time. |

Claim the toll-free number. Provisioning is immediate — but the number is
**unverified**, meaning traffic on it is heavily filtered until Step 3 clears.

### Step 3 — the verification form, field by field

Klaviyo surfaces this as **Toll-free verification** under Settings → SMS
(sometimes labeled "Complete registration" or shown as a banner).

| Field | What to enter |
|---|---|
| Business name | The legal entity that owns the list |
| Business address | Real street address, no PO box |
| Business website | `DOMAIN` |
| Contact name / email / phone | A person who will actually answer |
| Use case | **Marketing** (or "Promotional" / "Marketing & Promotional") |
| Estimated monthly volume | Start conservative — a few hundred |
| Opt-in method | **Web form** |
| Opt-in URL | `DOMAIN/#early-access` |
| Privacy policy URL | `DOMAIN/privacy` |
| Terms URL | `DOMAIN/terms` |

**Use case description** — paste this:

> Fans opt in through a form on the artist's official website by entering
> their mobile number and checking an unchecked consent box that discloses
> message frequency, that message and data rates may apply, and STOP/HELP
> instructions. Subscribers receive new music release announcements, early
> access links, and live show announcements from the recording artist Sam
> Suen. Consent is not a condition of any purchase.

**Opt-in workflow description** — paste this:

> The user visits the artist's website, enters their mobile phone number in
> the signup form, and checks a consent checkbox that is unchecked by
> default. On submission, consent is recorded with a timestamp via Klaviyo's
> subscription API. The list uses double opt-in: the subscriber receives a
> confirmation text and must reply to confirm before any marketing message is
> sent.

(Drop the last sentence if you switched to single opt-in in Step 1.)

**Sample messages** — give both. They must match what you actually send:

> Sam Suen here. You're on the list — you'll get a text when a song drops or
> a show goes on sale. Everything's here: DOMAIN/early Reply STOP to opt out.

> Sam Suen: "Efforts and Sincerity" is out now. Listen: DOMAIN/early
> Reply STOP to opt out.

If a **screenshot of the opt-in form** is requested, a mobile screenshot of
the signup block showing the checkbox and the full consent sentence is what
they want.

### Step 4 — after you submit

- Status shows **Pending** in Settings → SMS. One to three weeks is normal.
- **Do not send campaigns while pending.** Traffic on an unverified number is
  filtered, and heavy sending pre-verification can get the number revoked.
- Rejections come back with a reason and can be resubmitted, but the clock
  restarts — which is why the URLs must be live before the first submission.

### Common rejection reasons

| Reason | Prevention |
|---|---|
| Opt-in URL not publicly reachable | Check it in incognito first |
| Privacy policy missing the mobile-data clause | Ours has it verbatim |
| Sample message missing brand name or STOP | Both samples above include them |
| Business name doesn't match the website | Use the entity that owns the domain |
| Use case too vague ("marketing") | Use the description above |

## 3. Build the welcome flow

**Flows → Create flow → Start from scratch.** Name it `SMS Welcome — Early Access`.

**Trigger:** List — *Added to SMS List*

### Message 1 — immediate (SMS)

> Sam Suen here. You're on the list — you'll get a text when a song drops or
> a show goes on sale. Everything's here: DOMAIN/early
>
> Reply STOP to opt out.

### Message 2 — release day, Friday Aug 14 (SMS)

Don't put this in the welcome flow. Send it as a **one-off Campaign** scheduled
for release day, so people who signed up earlier in the week still get it.

> Sam Suen — "Efforts and Sincerity" is out now.
> Listen: DOMAIN/early
>
> Reply STOP to opt out.

**Notes on the copy:**
- Keep every message under 160 characters where possible. Longer messages split
  into multiple segments and cost more.
- Include the brand name in the first message — carriers require the sender be
  identifiable.
- `STOP` language on the first message is required; on later messages it's good
  practice.

## 4. Update `/early` on release day

Once the track is live on streaming, add the URLs to `NEW_RELEASE` in
[`app/lib/links.ts`](../app/lib/links.ts):

```ts
spotify: "https://open.spotify.com/track/...",
appleMusic: "https://music.apple.com/...",
```

The page renders whichever links are non-empty, so nothing else needs changing.
Empty strings are simply skipped.

## 5. Email fallback while SMS is gated

The signup form accepts an email address with or without a phone number, and
email consent is recorded on the same call. Email has no carrier gate — it can
send on Friday regardless of where toll-free verification stands.

If verification hasn't cleared by release day, send the release announcement as
a Klaviyo **email** campaign to the same list. The SMS side catches up later.

---

## Environment variables

Already set in `.env.local`. These must also be added in **Vercel → Project →
Settings → Environment Variables** before this works in production:

| Variable | Purpose |
|---|---|
| `KLAVIYO_PRIVATE_API_KEY` | Server-side Klaviyo auth. Never expose client-side. |
| `KLAVIYO_SMS_LIST_ID` | `Tx2YYk` |
| `RESEND_API_KEY` | Booking form email delivery. |
| `BOOKING_TO_EMAIL` | `samsuenmusic@gmail.com` |
| `BOOKING_FROM_EMAIL` | Sandbox sender until `mail.samsuen.com` DNS is verified. |

The Klaviyo API revision is pinned to `2026-07-15` in `subscribe.ts`. Bumping it
may change the payload shape, so treat it as a deliberate upgrade rather than
routine maintenance.
