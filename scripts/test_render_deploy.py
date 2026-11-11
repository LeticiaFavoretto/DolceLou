"""Unit tests of the Render deployment gate; no real network calls."""
import io
import os
import unittest
from unittest.mock import patch
import render_deploy

class RenderDeployTests(unittest.TestCase):
    SHA = "a" * 40
    CONFIG = {
        "RENDER_API_KEY": "not-a-real-token",
        "RENDER_SERVICE_ID": "srv-example",
        "RENDER_PUBLIC_URL": "https://example.onrender.com",
        "EXPECTED_SHA": SHA,
    }

    def test_missing_configuration_blocks_deploy(self):
        with patch.dict(os.environ, {}, clear=True):
            self.assertEqual(render_deploy.main(), 2)

    def test_failed_render_status_fails_job(self):
        with patch.dict(os.environ, self.CONFIG, clear=True), patch.object(
            render_deploy, "api_request", side_effect=[{"id": "dep-a"}, {"status": "build_failed"}]
        ) as request:
            self.assertEqual(render_deploy.main(), 1)
            self.assertEqual(request.call_count, 2)

    def test_wrong_commit_blocks_success(self):
        with patch.dict(os.environ, self.CONFIG, clear=True), patch.object(
            render_deploy, "api_request", side_effect=[
                {"id": "dep-a"}, {"status": "live", "commit": {"id": "b" * 40}}
            ]
        ):
            self.assertEqual(render_deploy.main(), 1)

    def test_live_matching_commit_requires_healthy_service(self):
        health_response = io.BytesIO(b'{"status":"UP"}')
        health_response.status = 200
        with patch.dict(os.environ, self.CONFIG, clear=True), patch.object(
            render_deploy, "api_request", side_effect=[
                {"id": "dep-a"}, {"status": "live", "commit": {"id": self.SHA}}
            ]
        ), patch.object(render_deploy, "urlopen", return_value=health_response):
            self.assertEqual(render_deploy.main(), 0)

    def test_live_matching_commit_with_unhealthy_service_fails(self):
        health_response = io.BytesIO(b'{"status":"DOWN"}')
        health_response.status = 200
        with patch.dict(os.environ, self.CONFIG, clear=True), patch.object(
            render_deploy, "api_request", side_effect=[
                {"id": "dep-a"}, {"status": "live", "commit": {"id": self.SHA}}
            ]
        ), patch.object(render_deploy, "urlopen", return_value=health_response):
            self.assertEqual(render_deploy.main(), 1)

if __name__ == "__main__":
    unittest.main()
