/* eslint-disable */
import https from 'https';
import fs from 'fs';
import path from 'path';

const url = 'https://caddyserver.com/api/download?os=windows&arch=amd64';
const dest = path.join(process.cwd(), 'caddy.exe');

console.log('Downloading Caddy Server... Please wait...');

const file = fs.createWriteStream(dest);

https.get(url, (response) => {
  if (response.statusCode === 302 || response.statusCode === 301) {
    // Handle redirect
    https.get(response.headers.location, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('✅ Caddy successfully downloaded to: ' + dest);
        console.log('Now you can run: .\\caddy.exe run --config Caddyfile.dev');
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      console.error('Error downloading:', err.message);
    });
  } else {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('✅ Caddy successfully downloaded to: ' + dest);
      console.log('Now you can run: .\\caddy.exe run --config Caddyfile.dev');
    });
  }
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error('Error downloading:', err.message);
});
