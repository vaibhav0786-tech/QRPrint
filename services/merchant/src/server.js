import http from 'node:http';
const port = Number(process.env.MERCHANT_PORT || 4310);
http.createServer((request, response) => { if (request.url === '/health') { response.writeHead(200, {'content-type':'application/json'}); response.end(JSON.stringify({ status: 'ok', printerIntegration: 'unconfigured' })); return; } response.writeHead(404); response.end(); }).listen(port);
