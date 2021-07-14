import { APIGatewayProxyEvent } from 'aws-lambda';
import { runCLI } from 'jest';

const handler = async (event: APIGatewayProxyEvent) => {
  const { results } = await runCLI(
    {
      roots: ['./src/tests/'],
      testRegex: '\\.test\\.js$',
    } as any,
    ['.']
  );

  return { statusCode: 200, body: JSON.stringify(results) };
};

export default handler;
