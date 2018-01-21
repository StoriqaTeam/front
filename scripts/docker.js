const fs = require('fs');

fs.stat('.env.docker', (err, stat) => {
  if (stat && stat.isFile()) {
    console.log('Renaming .env.docker to .env.development');
    fs.rename('.env.docker', '.env.development', (err) => console.log(err));
  }
});
