const http = require('http');

const PORT = process.env.PORT || 3001;

const products = [
  { id: 1, name: 'Laptop', price: 750000 },
  { id: 2, name: 'Headphones', price: 45000 },
  { id: 3, name: 'Keyboard', price: 25000 }
];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health') {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: 'healthy' }));
  }

  if (req.url === '/products') {
    res.writeHead(200);
    return res.end(JSON.stringify(products));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ message: 'Route not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Product service running on port ${PORT}`);
});