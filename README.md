# UNO Online

Node.js/Express/Socket.io-UNO mit flüchtigem Spielzustand im RAM. Geeignet für den Betrieb als **AMP Generic Module** auf Debian; Container/Podman werden nicht benötigt.

## Installation und Betrieb

```sh
git clone https://github.com/LSD-Monkey/personalUNO.git
cd personalUNO
cp .env.example .env
npm ci
npm start
```

`HOST` (Standard `127.0.0.1`) und `PORT` (Beispiel `34789`) werden aus `.env` gelesen. `/health` liefert einen einfachen Health-Check. Der Prozess loggt nach stdout und behandelt SIGTERM/SIGINT für AMP sauber.

## TLS / Reverse Proxy

Für TLS direkt in Node `SSL_ENABLED=true` und lesbare `SSL_KEY_PATH`/`SSL_CERT_PATH` setzen. Bei fehlenden Zertifikaten nutzt der Server standardmäßig HTTP (`SSL_FALLBACK_HTTP=true`); für strikt benötigtes TLS auf `false` setzen. In der Praxis TLS besser am Reverse Proxy terminieren und WebSocket-Upgrades für `/socket.io/` aktivieren.

## AMP

Siehe [`docs/AMP.md`](docs/AMP.md) für Generic-Modul, Update, Port, Node-Version, Umgebungsvariablen und Ready-Meldung.

## Tests

`npm test`; Smoke-Test: `npm run smoke` (Server muss laufen).
