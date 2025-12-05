import { defineConfig } from 'orval';

export default defineConfig({
  studyscore: {
    input: {
      target: 'http://localhost:8080/api/v3/api-docs',
    },
    output: {
      mode: 'tags-split',
      target: 'src/generated/api',
      client: 'react-query',
      override: {
        mutator: {
          path: 'src/lib/api-client.ts',
          name: 'customInstance',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});