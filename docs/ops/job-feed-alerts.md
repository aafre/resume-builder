# Job feed log alerts (Cloud Run)

Alerts for Adzuna outages. Prod service runs in `europe-west1`. Commands are a template: review, then run manually. Nothing here is applied automatically.

Log lines (see `job_feeds.py`, `job_engine.py`):
- `job_quota_exhausted feed=adzuna: skipped until next UTC day` (WARNING) - quota hit (HTTP 401/403/429)
- `Job feed adzuna failed for query ...` (ERROR) - non-quota feed error (timeouts, 5xx)

Placeholders: `PROJECT_ID`, `SERVICE_NAME` (Cloud Run service), `CHANNEL_ID` (notification channel id; list with `gcloud alpha monitoring channels list --project PROJECT_ID`).

## 1. Log-based metrics

```bash
gcloud logging metrics create job_quota_exhausted \
  --project=PROJECT_ID \
  --description="Adzuna quota exhausted (401/403/429)" \
  --log-filter='resource.type="cloud_run_revision" AND resource.labels.service_name="SERVICE_NAME" AND resource.labels.location="europe-west1" AND textPayload:"job_quota_exhausted"'

gcloud logging metrics create job_feed_adzuna_failed \
  --project=PROJECT_ID \
  --description="Adzuna feed request failed" \
  --log-filter='resource.type="cloud_run_revision" AND resource.labels.service_name="SERVICE_NAME" AND resource.labels.location="europe-west1" AND textPayload:"Job feed adzuna failed"'
```

If logs are structured (`jsonPayload.message`), replace `textPayload:` with `jsonPayload.message:`.

## 2. Alert policies

Quota: fires on any hit (the app logs it once per UTC day per instance).

```bash
cat > quota-policy.json <<'EOF'
{
  "displayName": "Job feed: Adzuna quota exhausted",
  "combiner": "OR",
  "conditions": [{
    "displayName": "job_quota_exhausted >= 1 in 5m",
    "conditionThreshold": {
      "filter": "metric.type=\"logging.googleapis.com/user/job_quota_exhausted\" AND resource.type=\"cloud_run_revision\"",
      "comparison": "COMPARISON_GT",
      "thresholdValue": 0,
      "duration": "0s",
      "aggregations": [{"alignmentPeriod": "300s", "perSeriesAligner": "ALIGN_SUM", "crossSeriesReducer": "REDUCE_SUM"}]
    }
  }],
  "notificationChannels": ["projects/PROJECT_ID/notificationChannels/CHANNEL_ID"],
  "alertStrategy": {"autoClose": "86400s"}
}
EOF
gcloud alpha monitoring policies create --project=PROJECT_ID --policy-from-file=quota-policy.json
```

Failures: sustained errors (5+ in 10m; tune to traffic).

```bash
sed -e 's/Adzuna quota exhausted/Adzuna feed failing/' \
    -e 's/job_quota_exhausted >= 1 in 5m/job_feed_adzuna_failed > 5 in 10m/' \
    -e 's#user/job_quota_exhausted#user/job_feed_adzuna_failed#' \
    -e 's/"thresholdValue": 0/"thresholdValue": 5/' \
    -e 's/"alignmentPeriod": "300s"/"alignmentPeriod": "600s"/' \
    quota-policy.json > failed-policy.json
gcloud alpha monitoring policies create --project=PROJECT_ID --policy-from-file=failed-policy.json
```

## 3. Verify

```bash
gcloud logging metrics list --project=PROJECT_ID
gcloud alpha monitoring policies list --project=PROJECT_ID --format="table(displayName,enabled)"
```

Metrics only count entries logged after creation. Quota resets at 00:00 UTC (`_utc_today` in `job_feeds.py`).
