import { runCLI } from 'jest';

const handler = async (event: any) => {
  const { results } = await runCLI(
    {
      roots: ['./src/tests/'],
      testRegex: '\\.test\\.(js|ts)$',
    } as any,
    ['.']
  );

  return { statusCode: 200, body: JSON.stringify(results) };
};

export default handler;
