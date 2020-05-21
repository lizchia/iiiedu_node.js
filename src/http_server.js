const http = require('http');
const server = http.createServer((req, res)=>{
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<p>${req.url}</p><h2>Hello</h2> `);
});
server.listen(3000);
