module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Dont run test suites in parallel, so we can reuse the same port between
  // the suites.
  maxWorkers: 1,
  globalSetup: './src/globalTestSetup.ts',
};
