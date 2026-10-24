import json
import datetime

data = {
    "id": "result-lingual-data-wave1-redeploy-api-001",
    "task_id": "lingual-data-wave1-redeploy-api-001",
    "from": "agent",
    "to": "muse",
    "type": "result",
    "status": "done",
    "subject": "[HOAN TAT] Redeploy API build moi len tunnel pebble-implosion-art.ngrok-free.dev",
    "body": (
        "XAC NHAN REDEPLOY API BUILD MOI LEN TUNNEL NGROK:\n\n"
        "1. Nguyen nhan loi HTML truoc do:\n"
        "Sau khi IDE server restart, tien trinh ngrok daemon cho tunnel pebble-implosion-art.ngrok-free.dev "
        "va reverse proxy Caddy (port 8081) bi dung tam thoi. Do do, ngrok tra ve trang loi mac dinh ERR_NGROK_3200 "
        "(HTML: 'The endpoint pebble-implosion-art.ngrok-free.dev is offline').\n\n"
        "2. Da thuc hien Rebuild & Khoi phuc he thong:\n"
        "- API Rebuild: Chay pnpm --filter @linguaflow/api build (tsc thanh cong 0 loi tren commit 56c897a).\n"
        "- Reverse Proxy Caddy: Da start lai tren port 8081 dinh tuyen /api/* -> 4000, /* -> 3000.\n"
        "- Web Dev Server: Da start lai tren port 3000 (Next.js 15.1.0).\n"
        "- Tunnel Ngrok: Da khoi dong lai daemon ngrok voi token phu tren port 8081 -> URL: https://pebble-implosion-art.ngrok-free.dev (Online 100%).\n\n"
        "3. Ket qua verify DoD qua TUNNEL PUBLIC (https://pebble-implosion-art.ngrok-free.dev):\n"
        "- GET /api/v1/sentence-bank?limit=1:\n"
        "  * Status: HTTP 200 OK\n"
        "  * Content-Type: application/json; charset=utf-8\n"
        "  * Body: {\"items\":[...],\"total\":21911}\n"
        "  * DoD: Total = 21911 (KHOP CHINH XAC 100%)\n\n"
        "- GET /api/v1/invalid-route-probe (kiem tra route 404):\n"
        "  * Status: HTTP 404 Not Found\n"
        "  * Content-Type: application/json; charset=utf-8\n"
        "  * Body: {\"error\":\"API endpoint not found\",\"path\":\"/api/v1/invalid-route-probe\",\"method\":\"GET\",\"status\":404}\n"
        "  * Khong con tra HTML, tra JSON 404 chuan REST API."
    ),
    "data": {
        "tunnel_url": "https://pebble-implosion-art.ngrok-free.dev",
        "commit": "56c897a",
        "curl_sentence_bank": {
            "url": "https://pebble-implosion-art.ngrok-free.dev/api/v1/sentence-bank?limit=1",
            "status": 200,
            "content_type": "application/json; charset=utf-8",
            "total": 21911
        },
        "curl_404_test": {
            "url": "https://pebble-implosion-art.ngrok-free.dev/api/v1/invalid-route-probe",
            "status": 404,
            "content_type": "application/json; charset=utf-8",
            "body": {
                "error": "API endpoint not found",
                "path": "/api/v1/invalid-route-probe",
                "method": "GET",
                "status": 404
            }
        }
    },
    "ts": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "needs_user_approval": False,
    "needs_decision": []
}

filepath = r"C:\Mod\muse-mailbox\inbox\20261021-redeploy-api-done.json"
with open(filepath, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Exported successfully to {filepath}")
