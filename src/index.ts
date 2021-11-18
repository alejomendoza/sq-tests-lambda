import express from 'express';
import { runCLI } from 'jest';

const PORT = process.env.PORT || 5000;

express()
  .get('/', async (req, res) => {
    const { results } = await runCLI(
      {
        roots: ['./src/tests/'],
        testRegex: '\\.test\\.(js|ts)$',
      } as any,
      ['.']
    );

    return res.send({ results });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
