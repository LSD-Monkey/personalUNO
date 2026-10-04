# Ausführungsbericht personalUNO (04.10.2026)

## Architektur
Node.js/CommonJS-Anwendung mit Express für statische Dateien und `/health` sowie Socket.io für Räume und Spielereignisse. Spielzustand liegt vollständig im RAM (`RoomManager` → `Game` → `Player`/`Deck`); Neustarts verlieren laufende Räume. Optional kann Node selbst HTTPs terminieren, empfohlen ist TLS am Reverse Proxy. `HOST` und `PORT` steuern den Listener.

## Dateien

**Entfernt:** `Containerfile`, `compose.yaml`, `port.txt`, `scripts/start.sh`, `scripts/stop.sh`, `scripts/status.sh`, `scripts/logs.sh`.

**Neu/geändert:** `.env.example`, `docs/AMP.md`, `README.md`, `package.json` (Node-Engine >=20), `src/server.js` (HOST, HTTP-Fallback, Listener), `src/Game.js` (Validierung, Disconnect/Timer/Deck-Regeln), `tests/game.test.js` (Regel- und Edge-Case-Tests), `tests/smoke.js` (Health-Smoke-Test).

## Befunde und Status

- **kritisch – Servervalidierung:** Nicht-am-Zug, nicht verbundene Spieler, ungültige Indizes und nicht besessene Karten konnten teils nicht eindeutig behandelt werden. **Behoben** in `Game.play/draw/callUno`.
- **kritisch – Wild-/+4-Validierung:** Farbpayloads wurden nicht vollständig geprüft; +4-Regel musste vor Spielzug geprüft werden. **Behoben**.
- **mittel – laufende Timer:** UNO-Penalty-Timer konnten nach Rundende/Entfernung weiterleben. **Behoben** durch Timer-Cleanup.
- **mittel – Disconnect/Turn:** Disconnects konnten den aktuellen Index auf einen nicht verbundenen Spieler zeigen. **Behoben** durch Turn-Normalisierung.
- **mittel – leerer Nachziehstapel:** Recycle der Ablage war vorhanden, aber nicht durch Tests abgesichert. **Test ergänzt und verifiziert**.
- **gering – Podman-Betrieb:** Für AMP ungeeignete Container-Skripte und Dokumentation. **Entfernt/ersetzt**.
- **offen/gering – weitere Client-Events:** Der Client enthält historische UI-Events (`getMyHand`, Chat, Kick, neue Runde), für die der Server im Ausgangscode keinen Handler besitzt. Nicht Teil der geforderten URL-/Socket-API-Änderung; kein Verhalten neu erfunden.

## Tests und Validierung

- `node --test`: **8 Tests, 8 passed, 0 failed**.
- Tests decken Deckgröße, 2-Spieler-Reverse, +4-Regel, Out-of-turn/nicht-besessene Karte, letzte Karte/Rundenende, leeren Draw-Pile, Disconnect mit nur verbleibendem Spieler und ungültige Wild-Farbe ab.
- `npm test`/`npm ci` konnten in dieser Sandbox nicht ausgeführt werden, weil die bereitgestellte globale npm-Installation defekt ist (`Cannot find module '../lib/cli.js'`). Außerdem sind deshalb keine `node_modules` vorhanden; der echte HTTP-Smoke-Test scheiterte erwartungsgemäß an fehlendem `dotenv`. Auf einem normalen AMP-Host sind `npm ci`, danach `npm test` und `npm run smoke` auszuführen.

## AMP-Konfiguration

1. Node.js 20+ installieren (siehe `package.json` `engines`).
2. AMP Generic Module: Arbeitsverzeichnis auf den Checkout setzen, Startbefehl `npm start`.
3. `npm ci` einmalig nach Checkout und bei jedem Update.
4. Umgebungsvariablen aus `.env.example` setzen: `NODE_ENV=production`, `HOST=127.0.0.1`, `PORT=34789`; bei Proxy `SSL_ENABLED=false`.
5. Port `34789` im AMP-Modul reservieren; bei direkter Erreichbarkeit Firewall/Router entsprechend konfigurieren.
6. Console-ready Regex: `UNO Online läuft auf`.
7. Update: AMP stoppen, `git pull --ff-only`, `npm ci`, AMP starten.
8. AMP-Stop nutzt SIGTERM; der Server schließt Socket.io/HTTP geordnet.
9. Bei TLS im Reverse Proxy WebSocket-Upgrade für `/socket.io/` weiterleiten. Direktes TLS setzt lesbare Zertifikatspfade und `SSL_ENABLED=true` voraus; fehlende Zertifikate fallen standardmäßig auf HTTP zurück, mit `SSL_FALLBACK_HTTP=false` wird der Start abgebrochen.
