const http = require('http');

const PORT = process.env.PORT || 3002;

const orders = [
  { id: 1, product: 'Laptop', quantity: 1, status: 'confirmed' },
  { id: 2, product: 'Headphones', quantity: 2, status: 'pending' }
];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health') {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: 'healthy' }));
  }

  if (req.url === '/orders') {
    res.writeHead(200);
    return res.end(JSON.stringify(orders));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ message: 'Route not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Order service running on port ${PORT}`);
});