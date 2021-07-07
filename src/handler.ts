import { APIGatewayProxyEvent } from 'aws-lambda';
import { performance } from 'perf_hooks';
const exec = require('child_process').exec;

function runTests() {
  return new Promise(function (resolve, reject) {
    exec('jest', (error: any, stdout: any, stderr: any) => {
      if (error) {
        return resolve({ statusCode: 500, body: error.message });
      }
      if (stderr) {
        return resolve({ statusCode: 500, body: stderr });
      }
      return resolve({ statusCode: 200, body: stdout });
    });
  });
}

const handler = async (event: APIGatewayProxyEvent) => {
  const time1 = performance.now();
  const response = await runTests();
  const time2 = performance.now();
  console.log(time2 - time1);

  return response;
};

export default handler;
