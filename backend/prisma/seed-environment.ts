export function assertSeedEnvironment(environment = process.env.NODE_ENV) {
  if (environment !== 'development' && environment !== 'test') {
    throw new Error('Demo seed requires NODE_ENV=development or NODE_ENV=test. Seeding staging/production is forbidden.');
  }
}
