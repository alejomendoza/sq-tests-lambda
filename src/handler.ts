import { APIGatewayProxyEvent } from 'aws-lambda';
import { performance } from 'perf_hooks';

const handler = async (event: APIGatewayProxyEvent) => {
  const time1 = performance.now();
  // const response = await runTests();
  const time2 = performance.now();
  console.log(time2 - time1);

  return {};
};

export default handler;
