# AMP auf Debian

AMP-Modul **Generic** anlegen, Arbeitsverzeichnis auf den Repository-Ordner setzen und als Startbefehl `npm start` verwenden. Node.js 20+ installieren (siehe `package.json`, `engines.node`); AMP muss den `node`-Binary im PATH des Dienstbenutzers sehen.

- Port: `34789` (oder freier Port), passend zu `PORT`; bei Reverse Proxy nur lokal binden (`HOST=127.0.0.1`).
- Umgebungsvariablen: `NODE_ENV=production`, `HOST`, `PORT`, optional `SSL_ENABLED`, `SSL_KEY_PATH`, `SSL_CERT_PATH`, `SSL_FALLBACK_HTTP`.
- Console-ready regex: `UNO Online läuft auf`.
- Update: Dienst stoppen, `git pull --ff-only`, `npm ci`, Dienst starten. `.env` sichern; Zertifikate restriktiv lesbar machen.
- AMP sendet beim Stop SIGTERM; der Server beendet Socket.io und HTTP/HTTPS geordnet.

Hinter nginx/Caddy/Apache empfiehlt sich TLS am Proxy und `SSL_ENABLED=false`. Der Proxy muss WebSocket-Upgrades für `/socket.io/` weiterleiten. Direktes TLS ist möglich, wenn Node den privaten Schlüssel lesen darf. Bei `SSL_FALLBACK_HTTP=false` beendet sich der Prozess bei fehlenden Zertifikaten; mit `true` bleibt er auf HTTP verfügbar.
