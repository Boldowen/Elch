import { assistantRepository } from './assistantRepository';
import { routesRepository } from './routesRepository';

// Compatibility facade for existing callers. New feature code should import the
// focused repositories directly.
export const routePlanningRepository = {
  routes: (...args) => routesRepository.list(...args),
  route: (...args) => routesRepository.detail(...args),
  validate: (...args) => routesRepository.validate(...args),
  ask: (...args) => assistantRepository.ask(...args),
};
