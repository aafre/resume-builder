# Revenue streams research (non-user-charging)

Checked: 2026-09-25. All URLs were fetched on that date unless marked otherwise. Where only a search-engine
snippet or a third-party site was available, the claim is marked **UNVERIFIED**.

Context: the core product (build and download a resume, no account) stays free. Today the only revenue is
AdSense. The Adzuna jobs feature (`docs/features/JOB_SEARCH_FLOW.md`, `docs/features/JOBS_PSEO_PRD.md`) has
been **decided to ship**. Section 1 is about getting the most out of it.

## Key takeaways

1. **The Adzuna API does not pay per click by default.** Adzuna's API Terms say nothing about paying API users. Money comes
   from a separate **partner programme** (sponsored job feed, job alerts, CV-tool affiliate). You apply
   with your monthly unique visitors, and no rates are published. The PRD's "Adzuna affiliate partner ID"
   (`JOBS_PSEO_PRD.md` §"Adzuna Affiliate Link Tracking") has no public source behind it. The first
   step is to fill in the partner form.
2. **The pSEO PRD as written conflicts with three primary sources:**
   (a) Adzuna's default quota is 250 calls/day and 2,500/month. 2,400 pages refreshed every 6h is about 9,600 calls/day.
   (b) Adzuna forbids ongoing commercial use "in aggregation (… average salaries etc)" without written
   consent, which is exactly what PRD F5.5 does with its salary insight.
   (c) Google says not to put `JobPosting` markup on list pages and rejects incomplete descriptions. Adzuna
   only returns a description snippet, and PRD F3 puts `JobPosting` on role×city list pages.
3. **AdSense allows affiliate links and other ads on the same page.** The limit is Google's ratio rule: no
   "more ads or other paid promotional material than publisher-content". A page of Adzuna "adverts"
   plus AdSense units needs real original content to stay on the right side of that rule.
4. **Affiliate fit:** Coursera (Impact; 15-45%, 30-day cookie, and it includes Professional Certificates,
   which is how Google Career Certificates are sold) is the strongest verified match. Jobscan (Impact, 15%) and Teal (Impact)
   sell competing resume tools, so they conflict with the product. Udemy, LinkedIn Learning and FlexJobs terms could not be
   fetched from primary pages.
5. **Disclosure:** the US FTC says "affiliate link" alone may be inadequate and a footer disclosure may be missed.
   "Paid link" next to the link is acceptable. The UK ASA says "#affiliate" and "may earn an affiliate commission"
   are not clear enough. It wants "Ad"-style labelling upfront. **Label every monetised outbound link at the point
   of the link, in wording that works in both countries.**
6. **Other streams:** job-feed publisher programmes (Jooble: CPC/CPA with no stated minimum; Talent.com and
   WhatJobs: CPC, terms on request) can supplement Adzuna. GitHub Sponsors takes 0% on personal sponsorships
   and the repo is public Apache-2.0. Journey by Mediavine needs 1,000 Tier-1 sessions/month. beehiiv's ad
   network needs a paid Scale plan and a list, which EFR doesn't have yet.

---

## 1. Adzuna: getting the most out of the jobs feature

### 1.1 How money is made

| Claim | Source (checked 2026-09-25) |
|---|---|
| The API Terms describe three permitted uses: publishing ad listings, publishing Jobsworth salary estimates, and personal/academic research. They say **nothing about paying API users** (no CPC or revenue-share clause). | https://developer.adzuna.com/docs/terms_of_service |
| Partner page, verbatim: "We can provide a sponsored feed of ads for your site"; "We can power your job alerts and give you extra revenue with no additional effort. We send branded alerts…"; "Become an affiliate of our flagship CV tool … Earn money for every registration you send." | https://www.adzuna.co.uk/hire/partners/ (same content at https://www.adzuna.com/hire/partners/) |
| The partner form asks for **monthly unique visitors**, website URL and markets. **No CPC rate, revenue share, payout per registration or traffic minimum is published.** | https://www.adzuna.co.uk/hire/partners/ |
| API responses carry a `redirect_url` (e.g. `adzuna.co.uk/jobs/land/ad/…`) with `utm_medium=api&utm_source=<app id>` tracking. So clicks are attributed to the API key, but the docs don't say this earns money. | https://developer.adzuna.com/docs/search |

**Inference:** CPC revenue needs a negotiated partner deal (sponsored feed). A plain API key only gives
content.

### 1.2 Terms: attribution, trial, aggregation, termination

- **Attribution (required):** "An API user shall label each displayed advert with the phrase "Jobs by Adzuna"
  at least 116 X 23 pixels in size, wherein the word "Jobs" shall be hyperlinked to http://www.adzuna.co.uk or
  the relevant local domain and the word "Adzuna" shall be the Adzuna Logo Image and shall also be hyperlinked…"
  https://developer.adzuna.com/docs/terms_of_service
- **Salary estimates (Jobsworth):** each estimate needs a 20×20px icon and the words "Adzuna Jobsworth",
  linked, with the mouseover text "Salary estimate powered by Adzuna Jobsworth". Same URL.
- **Commercial-use trial / aggregation:** "Any other use of the Adzuna API by a commercial, government or
  academic organisation … is permitted subject to a 14 day trial period … It may not be used in its original
  format or in aggregation (including but not limited to vacancy counts, average salaries etc) to deliver any
  ongoing work or research … without written consent." Same URL.
  **This hits PRD F5.5** (salary insight computed from listings) and the job counts in dynamic titles (F2.14), since both
  are aggregation. Get written consent as part of the partner deal.
- **Termination:** Adzuna may suspend access at its discretion. On termination the user "shall immediately remove all
  insertion codes and data acquired from Adzuna from all pages". Same URL. Contacting Adzuna's
  third-party content providers directly is a breach that leads to immediate revocation. Same URL.

### 1.3 Rate limits

- Default: "25 hits per minute, 250 hits per day, 1000 hits per week, 2500 hits per month". "If you wish to
  publish Adzuna ad listings and need to request increased rate limits then please contact us."
  https://developer.adzuna.com/docs/terms_of_service
- **The PRD is well over this:** 2,400+ pages (F1) × a 6h refresh (§"Pre-rendering Strategy") is roughly 9,600
  calls/day before the tier-2/3 fallback calls in `JOB_SEARCH_FLOW.md`. A raised limit is a launch
  prerequisite, not an optimisation.

### 1.4 Caching / storage / SEO indexing

- **Caching or storage duration: not addressed** in the Terms (checked for "store", "cache", "copy"). The
  termination clause implies data may be held while the agreement runs.
  https://developer.adzuna.com/docs/terms_of_service. **UNVERIFIED either way.** Get it in writing.
- **Indexing listings as SEO pages: not addressed** in the Terms ("search engine", "index" not present).
  Same URL. **UNVERIFIED.**
- **Descriptions are snippets:** "Please note we currently only provide a snipped [sic] of the job description in
  the response." https://developer.adzuna.com/docs/search
- **Google JobPosting rules (these determine rich results):** "Put structured data on the most detailed leaf page
  possible. Don't add structured data to pages intended to present a list of jobs." "We don't allow job
  postings with incomplete job descriptions." Violations "may include taking manual action".
  https://developers.google.com/search/docs/appearance/structured-data/job-posting (page last updated
  2026-09-08). **PRD F3 (JobPosting JSON-LD on role×city list pages, built from snippets) does not comply.**
  Drop F3, or change it to leaf pages with full descriptions, which Adzuna doesn't provide.
- **Google Search spam policies** list "Scraping feeds and search results with minimal additions" under scaled
  content abuse. Scraping includes "Reproducing content feeds without user benefits". Doorway abuse covers
  "Substantially similar pages" built to rank for similar queries.
  https://developers.google.com/search/docs/essentials/spam-policies (last updated 2026-08-28). The
  city×role matrix sits directly in this zone, and the PRD's unique-content requirements (F5) are the
  mitigation that matters most.

### 1.5 Ways to earn more from Adzuna

1. **Submit the partner form now** (https://www.adzuna.co.uk/hire/partners/). In one conversation, ask for:
   a sponsored/CPC feed and rate, raised rate limits, written consent for commercial use and salary/count
   aggregation, written position on caching TTL and indexing, and which markets they'll pay for.
2. **Job alerts partnership** (same page: "extra revenue with no additional effort"). This fits a no-account
   product only if alerts are opt-in by email. Adzuna sends them "branded", so check whose brand.
3. **CV-tool affiliate** (same page). **Conflict:** it sends resume-builder users to a competing CV tool.
   Lowest priority.
4. **Stay inside the attribution rules**, and keep listings visually distinct from AdSense units. See §4.

---

## 2. Affiliate programmes for job seekers

| Programme | Payout | Cookie | Network / approval | Restrictions | Source / status |
|---|---|---|---|---|---|
| **Coursera** (covers Google Career Certificates, which Coursera sells as Professional Certificates) | "Baseline commissions between 15% – 45% on any eligible purchases … within 30 days", with performance bonuses. Eligible: courses, Specializations, professional certificates, Coursera Plus. Degrees are excluded. | 30 days | Impact | Not stated on the page (probably in the Impact contract terms) | https://www.coursera.org/about/affiliates. Google Certificates→Coursera link is **inferred**. Grow with Google's own partner programme is for organisations (training/scholarships), not commission: https://grow.google/partners (search snippet only, **UNVERIFIED**) |
| **Udemy** | **UNVERIFIED**. A search snippet of Udemy's own help centre says commission on paid courses, not on subscriptions or free courses | 7 days (snippet of Udemy help article) | Impact (snippet) | — | https://partnersupport.udemy.com/hc/en-us/articles/360049412573-What-is-a-Cookie-How-Long-do-Cookies-Last and https://www.udemy.com/terms/affiliate/. Both return 403/Cloudflare to automated fetch. Third-party sites claim 10-15%. |
| **LinkedIn Learning** | **UNVERIFIED**. Search snippet of LinkedIn Help: "up to $10 per free trial sign-up or 35 percent" of standalone course sales | Not seen | Impact (snippet) | — | https://www.linkedin.com/help/learning/answer/a702909 now returns **HTTP 404**. The programme may have been retired. Confirm in the Impact marketplace. |
| **Jobscan** (ATS resume scanner) | "The commission rate is 15% of each order." | Not stated | Impact; apply and be approved | No bidding on brand terms/misspellings; no coupon or deal sites; no Jobscan branding in ad copy | https://www.jobscan.co/affiliates. **Conflict:** it overlaps with EFR's ATS/keyword tools. |
| **Teal** (resume builder + job tracker) | Commission on sign-up/upgrade. Rate not on the page (third-party sites say "$20 per lead", **UNVERIFIED**) | Not stated | Impact; "no minimum" payout | — | https://www.tealhq.com/partner/affiliate (fetched via curl). **Direct competitor.** Not recommended. |
| **FlexJobs** (premium job board) | **UNVERIFIED**. Snippets say $12/signup | 30 days (snippet) | Impact (snippet) | — | https://www.flexjobs.com/affiliate-program timed out on two attempts |
| **TopResume** (professional resume review/writing) | "competitive commission rates". No rate published | — | Contact partnerships@topresume.com | — | https://topresume.com/partnerships |
| **Interview coaching** (Big Interview etc.) | No primary affiliate page found (biginterview.com/affiliates: 404) | — | — | — | **UNVERIFIED / none found** |

### Networks

| Network | Cost / approval bar | Source |
|---|---|---|
| **Impact** | Partner sign-up; application checklist (business category, channels, profile). "We recommend adding at least one verified property to increase your chances of getting approved." No traffic minimum stated. Each brand then approves separately. | https://help.impact.com/partner/what-would-you-like-to-learn-about/getting-started/sign-up-as-a-partner-on-impactcom |
| **Awin** | "£5 deposit in order to proceed with the application", credited back at first payment threshold and refundable on rejection. Manual compliance review with identity checks, target 24h. No traffic minimum stated. | https://www.awin.com/gb/compliance-and-regulations/application-process-and-joining-fee |
| **CJ** | Free publisher sign-up (search snippet of cj.com). The "Content Certification" tier bars sites whose primary traffic is paid search. | https://signup.cj.com/member/signup/publisher/ and https://www.cj.com/content-publishers (**snippet only, UNVERIFIED**) |
| **PartnerStack** | Network application reviewed daily. A business-domain email "increases the likelihood" of approval. | https://support.partnerstack.com/hc/en-us/articles/20574018677395-Joining-the-PartnerStack-Network (403 to fetch; **snippet only, UNVERIFIED**) |

No network or programme checked publishes a hard traffic minimum. Approval is manual and per brand, so
approval odds for a low-traffic site are **unknown**. Specific paid-search and incentivised-click rules live in each
brand's Impact/CJ contract terms, which are not public (see Open questions).

---

## 3. Disclosure law

### US: FTC Endorsement Guides

- Affiliate relationships must be disclosed "clearly and conspicuously on your site". "The closer the
  disclosure is to your recommendation, the better."
  https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking
- "Consumers might not understand that 'affiliate link' means that the person placing the link is getting paid
  for purchases made through the link." "'Paid link' right next to an affiliate link should be an adequate
  disclosure." Same URL.
- "Consumers may miss a disclosure at the bottom of a blog or page." A single site-wide disclosure page is not
  enough. Same URL.
- Applies to non-US publishers when it's "reasonably foreseeable" that US consumers see the content. Same URL.
- Underlying regulation: 16 CFR Part 255, https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255
  (**not fetched**: eCFR redirected to a bot-block page).

### UK: ASA / CAP Code

- Affiliate content on a publisher's own site counts as marketing under the CAP Code. Rule 2.1: it must be "obviously
  identifiable as such". Rule 2.3: it "must make clear their commercial intent, if that is not apparent from the context".
  https://www.asa.org.uk/advice-online/affiliate-marketing.html (page updated 22 Mar 2023)
- Labels the ASA says are unclear: "#affiliate", "a d/affiliate", "#collab", "may earn an affiliate
  commission". Acceptable: "Ad"/"#Ad" upfront, or an asterisk with a clear upfront explanation. The label must come
  "prior to consumer engagement". Bottom disclaimers are "unlikely to be sufficient". Same URL.

**Practical rule for EFR:** put a visible label at each monetised link or card (e.g. "Ad · we earn a commission if
you buy") and a short upfront line on pages that carry affiliate content. Adzuna job cards are "adverts" in
Adzuna's own terms (§1.2), so label them as sponsored/ads as well.

---

## 4. Google AdSense policies

| Topic | Policy (verbatim where quoted) | Source |
|---|---|---|
| Affiliate links / other ads on the same page | Non-Google ads may appear on the same site or page as Google ads. Affiliate or limited-text links are allowed, subject to the Publisher Policies and a rule against more ads than content. | https://support.google.com/adsense/answer/9728?hl=en |
| Ad-to-content ratio ("valuable inventory") | Prohibited: "Google-served ads on screens with more ads or other paid promotional material than publisher-content." | https://support.google.com/adsense/answer/10502938 |
| Low-value / copied content | Prohibited: ads on screens "without publisher-content or with low-value content", and on screens "with embedded or copied content from others without additional commentary, curation, or otherwise adding value". | https://support.google.com/adsense/answer/10502938 |
| Thin affiliate / doorway | AdSense beginner's guide flags "affiliate programs with little or no original content" and "'doorway' pages created just for search engines, or other 'cookie cutter' approaches". "Publishers are responsible for the content on every page displaying their ads, even if the content was created by someone else." | https://support.google.com/adsense/answer/23921?hl=en |
| Ads next to third-party content / listings | "Publishers may not implement Google ads in a manner that disguises the ads … This includes formatting neighboring content to look similar to the ads." Only "Advertisements" or "Sponsored Links" may label Google ads. Be careful placing ads near "links … navigation buttons … drop-down menus" (accidental clicks). | https://support.google.com/adsense/answer/1346295 |
| Encouraging clicks | Don't use phrases such as "click the ads", "**support us**", "visit these links". | https://support.google.com/adsense/answer/48182 |
| Job-listings pages specifically | No job-specific AdSense restriction found in the pages above. The risk comes from the ratio and copied-content rules. | pages above |

**What this means for job pages:** each Adzuna listing is an Adzuna "advert" built from an API snippet.
That makes it copied content and arguably "paid promotional material". A role×city page that is mostly
listings, with AdSense after every 5th card (PRD F7.2), is exposed on both the ratio rule and the copied-content
rule. To mitigate: substantial original content per page (salary analysis, which needs Adzuna consent per §1.2;
resume tips for the role; links to EFR's templates and keywords pages), fewer in-feed units, and job cards
styled clearly apart from ads. PRD F7 acceptance already says "ads clearly distinguishable from job listings".
Keep that.

---

## 5. Other revenue streams that don't charge users

| Stream | Payout model | Suits low traffic? | Conflicts (AdSense / "core stays free") | Source |
|---|---|---|---|---|
| **(a) Adzuna** | See §1. Negotiated sponsored feed / alerts / CV affiliate | The form asks for UVs; no minimum published | Ratio and copied-content rules (§4) | https://www.adzuna.co.uk/hire/partners/ |
| **(b) Jooble publisher** | "paid out monthly on a CPC and CPA basis"; Net45. XML feed or API, with a test period | Yes: traffic bands start at "0-10,000" sessions; no stated minimum. Markets include US, UK, CA, AU, IN | Same as Adzuna. Could backfill markets or roles Adzuna covers thinly | https://jooble.org/affiliate |
| **(b) Talent.com publisher** | CPC, monthly (search snippet); XML feed, API, affiliate URLs | Unknown; terms via contact form | Same | https://employers.talent.com/publishers (no rates on page) |
| **(b) WhatJobs publisher** | Paid "each time a user clicks on a sponsored job"; feed API, Jobbox, Searchbox, text links | Unknown; no terms on page | Same | https://www.whatjobs.com/affiliates |
| **(b) Indeed** | Publisher API reportedly retired (2022-2023) | — | — | **UNVERIFIED**: secondary sources only (e.g. jobspipe.dev). indeed.com/publisher returns 403 |
| **(b) ZipRecruiter** | Reportedly 50% of collected CPC revenue; ZipSearch reportedly deprecated after 2025-03-31 | — | — | https://www.ziprecruiter.com/marketplace/publisher_service_terms (Cloudflare-blocked). **UNVERIFIED** |
| **(c) Newsletter sponsorship (beehiiv Ad Network)** | CPM (e.g. "$5 for every 1,000 unique opens") or CPC; paid monthly via Stripe | Only on beehiiv's **paid Scale plan**, and EFR has **no email list** today (no newsletter code in `resume-builder-ui/src`) | Doesn't touch AdSense. Signup must stay optional. Needs consent-based email capture (UK PECR/GDPR: see Open questions) | https://www.beehiiv.com/features/ad-network |
| **(c) Display-network upgrade: Journey by Mediavine** | Managed display ads (rev share not on page) | "minimum of 1,000 sessions from Tier 1 countries … within a 30-day period". Full Mediavine needs "$5,000 in annual ad revenue" and "good standing with Google AdSense and AdExchange" | Would replace or overlap AdSense. Exclusivity **not stated** on the page | https://www.mediavine.com/mediavine-requirements/ |
| **(d) Employer/recruiter (B2B)**: paid direct job posts, sponsored employer slots | Flat fee per post (self-set) | Hard at low traffic: employers pay for applicant volume | Users stay free. Direct employer postings on their own leaf pages *can* legitimately carry `JobPosting` markup (unlike Adzuna list pages) | https://developers.google.com/search/docs/appearance/structured-data/job-posting |
| **(e) GitHub Sponsors** | "does not charge any fees for sponsorships from personal accounts"; up to 6% from organisation accounts | Yes, zero fixed cost. Repo is public Apache-2.0, so open-source eligibility plausibly holds (recipient must be in a supported region) | Don't word it "support us" next to ad units (§4) | https://docs.github.com/en/sponsors/getting-started-with-github-sponsors/about-github-sponsors |
| **(e) Buy Me a Coffee** | "5% platform fee per transaction" plus Stripe 2.9% + $0.30, 0.5% payout fee, +1% international | Yes | Same "support us" wording caution | https://help.buymeacoffee.com/en/articles/8105744-how-to-calculate-charges-on-your-payment |
| **(f) Professional review / writing referral (TopResume)** | Commission, rate on request; offers the user a "FREE resume review" | Unknown | Upsells a paid service on top of a free product. Acceptable if opt-in and labelled, but it's a partial competitor | https://topresume.com/partnerships |
| **(f) Print referral** | No primary resume-print affiliate programme found | — | — | **none found** |
| **(g) Data-safe only** | All of the above work without selling user data. Affiliate and job clicks send only a click with tracking parameters, never the resume. Keep resume content out of outbound URLs and UTM tags (the PRD's UTM plan uses role slug only, which is fine) | — | — | design note, no external source |

---

## Open questions / unverifiable

1. **Adzuna commercial terms**: CPC rate, revenue share, CV-affiliate payout, traffic minimum, caching TTL,
   indexing permission, raised rate limits. None are public. Only the partner form or a written agreement can
   answer these (https://www.adzuna.co.uk/hire/partners/).
2. **Does Adzuna pay anything on `redirect_url` clicks for a plain API key?** No source says it does. The PRD
   assumes an "affiliate partner ID" exists. Unverified.
3. **Written consent for aggregation** (salary insight, job counts in titles) is needed before PRD F5.5 and F2.14 ship
   (https://developer.adzuna.com/docs/terms_of_service).
4. **Udemy, LinkedIn Learning, FlexJobs** terms. The primary pages blocked automated fetch (403, timeout) or
   returned 404 (LinkedIn, so possibly retired). Check by logging into the Impact marketplace.
5. **Brand-specific restrictions** (paid search, trademark bidding, incentivised clicks, email) for Coursera
   and others live in Impact/CJ contract terms that are only visible after joining.
6. **Indeed and ZipRecruiter publisher programme status**: secondary sources only.
7. **Talent.com / WhatJobs** rates and minimums: only via their sales contact.
8. **UK:** whether the CMA's consumer-protection regime (DMCC Act 2024) adds requirements beyond CAP for
   affiliate labels, and PECR consent rules for any newsletter. Not researched here.
9. **16 CFR Part 255** text was not fetched (eCFR bot block). The FTC FAQ page was used instead.
10. **Journey by Mediavine**: whether it requires removing AdSense, and its revenue share. Not on the requirements page.
