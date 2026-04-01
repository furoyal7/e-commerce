const http = require('http');

const data = JSON.stringify({
  name: 'Test Product',
  description: 'A test product',
  price: 15.99,
  stock: 10,
  status: 'draft',
  featured: false,
  imageUrl: 'https://via.placeholder.com/400',
  categories: ['General'],
  currency: 'USD'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/products',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    // we don't have a valid jwt, but NestJS guards run AFTER validations usually? Wait, JwtAuthGuard is before ValidationPipe sometimes?
    // Actually AuthGuard usually runs before ValidationPipe. If it's AuthGuard, we get 401 Unauthorized. If ValidationPipe, we get 400 Bad Request.
    // Let's just create an admin JWT using the auth service or test-auth.ts
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`BODY: ${body}`);
  });
});

req.write(data);
req.end();
