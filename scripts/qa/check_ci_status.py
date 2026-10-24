import urllib.request
import json
import sys

url = 'https://api.github.com/repos/vcongggggg/Lingual/actions/runs?branch=main&per_page=5'
req = urllib.request.Request(url, headers={'User-Agent': 'LinguaFlow-CI'})

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        runs = data.get('workflow_runs', [])
        if not runs:
            print("No runs found for branch main.")
            sys.exit(0)
        
        for r in runs:
            run_id = r.get("id")
            head_sha = r.get("head_sha", "")[:7]
            status = r.get("status")
            conclusion = r.get("conclusion")
            name = r.get("name")
            html_url = r.get("html_url")
            print(f"[{status}] Run ID: {run_id} | SHA: {head_sha} | Name: {name} | Conclusion: {conclusion}")
            print(f"       URL: {html_url}")
except Exception as e:
    print(f"Error fetching CI status: {e}")
    sys.exit(1)
