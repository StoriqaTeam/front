// get gateway url and write it in .env files

const { exec } = require('child_process');
const fs = require('fs');

const updateEnvFile = (graphqQLEndpoint) => {
  fs.readFile(__dirname + '/../.env.dev-manual', "utf8", (err, data) => {
    const dataArray = data.split('\n');
    let buffer = [];
    for (let i = 0; i < dataArray.length; i++) {
      const line = dataArray[i];
      if (line.startsWith('REACT_APP_GRAPHQL_ENDPOINT')) {
        buffer.push(`REACT_APP_GRAPHQL_ENDPOINT=${graphqQLEndpoint}`);
      } else if (line.startsWith('REACT_APP_SERVER_GRAPHQL_ENDPOINT')) {
        buffer.push(`REACT_APP_SERVER_GRAPHQL_ENDPOINT=${graphqQLEndpoint}`);
      } else {
        buffer.push(line);
      }
    }
    const output = fs.createWriteStream(__dirname + '/../.env.development');
    for (let i = 0; i < buffer.length; i++) {
      output.write(buffer[i]+'\r\n');
    }
  });
};

const run = () => {
  exec('minikube service list | grep gateway | awk \'{print $6}\'  | grep http', (err, stdout, stderr) => {
    if (err) {
      console.error('Error while locating gateway URL\nMake sure kubernetes is running', { err });
      process.exit(1);
      return;
    }

    if (stdout.length === 0) {
      console.error(stderr);
      process.exit(1);
      return;
    }
    const graphqQLEndpoint = stdout.replace('\n', '')+'/graphql';
    console.log(graphqQLEndpoint);
    updateEnvFile(graphqQLEndpoint);
  });
};

run();
