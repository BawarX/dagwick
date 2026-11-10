# Fleet data in a dashboard

Dagwick does not push metrics anywhere, and it has no separate metrics
endpoint. Everything the fleet page shows comes from one read-only API,
`/dagwick/api/fleet`. You can pull the same data into a dashboard, a report or
a scheduled job. It uses Airflow's own login and permissions, so a caller sees
only the DAGs it is allowed to read.

For a one-off report, use **Download CSV** on the fleet page instead.

## 1. Get an Airflow API token

`/dagwick/api/fleet` needs the same token as Airflow's REST API. How you get
one depends on your auth manager; see Airflow's documentation on API
authentication. With the simple auth manager:

```bash
TOKEN=$(curl -s -X POST https://airflow.example.com/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "dashboards", "password": "..."}' | jq -r .access_token)
```

Use an account that may read every DAG the dashboard should show. Tokens
expire after `[api_auth] jwt_expiration_time` seconds (one day by default), so
a job that runs on a schedule should get a new token each time.

## 2. Read the fleet

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  https://airflow.example.com/dagwick/api/fleet
```

The response looks like this (one entry per active DAG, up to 2,000;
`truncated` is `true` when there are more):

```json
{
  "dags": [
    {
      "dag_id": "load_payments",
      "score": 74.5,
      "grade": "C",
      "counts": {"pass": 10, "warn": 1, "fail": 2, "skip": 1, "ack": 0},
      "is_paused": false,
      "owners": "data-team",
      "tags": ["finance", "team:data"],
      "issues": [
        {"id": "retries", "title": "Tasks retry on failure", "status": "fail", "gain": 15.0}
      ],
      "health": {"runs": 12, "success_rate": 91.7}
    }
  ],
  "truncated": false
}
```

- `issues` lists the checks that fail or warn, worst first. `gain` is how many
  points fixing the check would add.
- `health` covers finished runs in the last 30 days. `success_rate` is a
  percentage, or `null` without runs.
- The response format may still change before 1.0. Check the changelog when
  you upgrade.

Some examples with `jq`:

```bash
# DAGs graded D or F, worst first
curl -s -H "Authorization: Bearer $TOKEN" https://airflow.example.com/dagwick/api/fleet |
  jq -r '.dags | sort_by(.score)[] | select(.grade == "D" or .grade == "F")
         | "\(.grade)  \(.score)  \(.dag_id)  \(.owners)"'

# Average score per owner
curl -s -H "Authorization: Bearer $TOKEN" https://airflow.example.com/dagwick/api/fleet |
  jq -r '.dags | group_by(.owners)[]
         | "\(.[0].owners)\t\((map(.score) | add / length * 10 | round / 10))"'
```

## 3. Put it in a dashboard

- **Grafana:** a data source that reads JSON over HTTP (for example the
  Infinity plugin) can query `/dagwick/api/fleet` with an `Authorization:
  Bearer` header and turn `dags` into a table. Remember that the token
  expires: something has to renew it.
- **A warehouse or BI tool:** a small scheduled job (cron, CI, or an Airflow
  DAG) that gets a token, reads `/dagwick/api/fleet` and appends the rows with
  a timestamp gives you scores over time.
- **Alerts:** the same job can post to chat when a DAG drops below a grade.

Scores change when a DAG's code or file changes, and run health changes as runs
finish, so reading the fleet once an hour or once a day is plenty.
