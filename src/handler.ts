import { APIGatewayProxyEvent } from 'aws-lambda';
import { performance } from 'perf_hooks';
const exec = require('child_process').exec;
import { runCLI } from 'jest';

const handler = async (event: APIGatewayProxyEvent) => {
  const time1 = performance.now();

  const { results } = await runCLI(
    {
      roots: ['./src/'],
      testRegex: '\\.test\\.(ts|js)$',
    } as any,
    ['.']
  );
  const time2 = performance.now();
  console.log(time2 - time1);

  return { statusCode: 200, body: JSON.stringify(results) };
};

export default handler;
