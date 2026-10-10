const http = require('http');

const PORT = process.env.PORT || 3000;

const services = {
  '/products': process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
  '/orders': process.env.ORDER_SERVICE_URL || 'http://localhost:3002'
};

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'healthy' }));
  }

  const route = Object.keys(services).find(
    path => req.url === path || req.url.startsWith(`${path}/`)
  );

  if (!route) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Route not found' }));
  }

  const target = new URL(req.url, services[route]);

  const proxyReq = http.request(target, {
    method: req.method,
    headers: req.headers
  }, proxyRes => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
    }
    res.end(JSON.stringify({ message: 'Service unavailable' }));
  });

  req.pipe(proxyReq);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${PORT}`);
});