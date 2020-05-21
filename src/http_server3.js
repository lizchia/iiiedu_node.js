import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
    fs.writeFile(__dirname + '/header01.json',
        JSON.stringify(req.headers),
        error => {
            if (error) {
                console.log(error)
            } else {
                res.end('ok')
            }
        })
});
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end(`<p>${req.url}</p><h2>Hello</h2> `);
server.listen(3000);
