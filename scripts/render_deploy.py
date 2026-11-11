#!/usr/bin/env python3
"""Deploy the exact CI-tested commit to a Git-backed Render service."""
import json
import os
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

API_BASE = "https://api.render.com/v1"
FAILED = {"build_failed", "update_failed", "pre_deploy_failed", "canceled", "deactivated"}

def api_request(url, api_key, payload=None):
    headers = {"Accept": "application/json", "Authorization": f"Bearer {api_key}"}
    body = None
    method = "GET"
    if payload is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(payload).encode("utf-8")
        method = "POST"
    request = Request(url, headers=headers, data=body, method=method)
    with urlopen(request, timeout=30) as response:
        return json.load(response)

def main():
    key = os.environ.get("RENDER_API_KEY", "").strip()
    service_id = os.environ.get("RENDER_SERVICE_ID", "").strip()
    expected_sha = os.environ.get("EXPECTED_SHA", "").strip()
    base_url = os.environ.get("RENDER_PUBLIC_URL", "").strip().rstrip("/")
    if not all((key, service_id, expected_sha, base_url)):
        print("Missing RENDER_API_KEY, RENDER_SERVICE_ID, EXPECTED_SHA or RENDER_PUBLIC_URL", file=sys.stderr)
        return 2
    if len(expected_sha) != 40 or any(c not in "0123456789abcdef" for c in expected_sha.lower()):
        print("EXPECTED_SHA must be a full Git commit SHA", file=sys.stderr)
        return 2
    if not base_url.startswith("https://"):
        print("RENDER_PUBLIC_URL must use HTTPS", file=sys.stderr)
        return 2
    endpoint = f"{API_BASE}/services/{service_id}/deploys"
    created = api_request(endpoint, key, {"commitId": expected_sha, "clearCache": "do_not_clear"})
    deploy_id = created.get("id")
    if not deploy_id:
        print("Render API did not return a deploy ID", file=sys.stderr)
        return 1
    print(f"Triggered deploy: {deploy_id}, expected SHA: {expected_sha}")
    deadline = time.monotonic() + 900
    while time.monotonic() < deadline:
        result = api_request(f"{endpoint}/{deploy_id}", key)
        status = result.get("status")
        deployed_sha = (result.get("commit") or {}).get("id")
        print("Render deploy status:", status)
        if deployed_sha and deployed_sha.lower() != expected_sha.lower():
            print("Render commit SHA does not match tested commit", file=sys.stderr)
            return 1
        if status == "live":
            if not deployed_sha:
                print("Live deploy did not expose a commit SHA", file=sys.stderr)
                return 1
            health = Request(f"{base_url}/actuator/health", headers={"Accept": "application/json"})
            with urlopen(health, timeout=30) as response:
                if response.status != 200 or json.load(response).get("status") != "UP":
                    print("Health check did not report UP", file=sys.stderr)
                    return 1
            print(f"Health UP. Published SHA matches tested SHA: {expected_sha}")
            return 0
        if status in FAILED:
            print(f"Render deployment failed: {status}", file=sys.stderr)
            return 1
        time.sleep(15)
    print("Render deployment timed out without reaching live", file=sys.stderr)
    return 1

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (HTTPError, URLError, ValueError, TimeoutError) as exc:
        print(f"Unable to confirm deployment: {type(exc).__name__}: {exc}", file=sys.stderr)
        raise SystemExit(1)
