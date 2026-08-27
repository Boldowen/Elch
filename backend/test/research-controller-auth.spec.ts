import 'reflect-metadata';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../src/common/decorators/public.decorator.js';
import { ROLES_KEY } from '../src/common/decorators/roles.decorator.js';
import { Role } from '../src/generated/prisma/client.js';
import { GuideAssessmentsController } from '../src/modules/guide-assessments/guide-assessments.controller.js';
import { GuideResearchController } from '../src/modules/guide-research/guide-research.controller.js';
import { ResearchAssistantController } from '../src/modules/research-assistant/research-assistant.controller.js';
import { ResearchController } from '../src/modules/research/research.controller.js';
import { TourismKnowledgeController } from '../src/modules/tourism-knowledge/tourism-knowledge.controller.js';
import { RoutePlanningController } from '../src/modules/route-planning/route-planning.controller.js';

type ControllerClass = { name: string; prototype: object };

const protectedControllers: ControllerClass[] = [
  ResearchAssistantController,
  GuideResearchController,
  TourismKnowledgeController,
  GuideAssessmentsController,
  ResearchController,
];

function controllerMethods(controller: ControllerClass) {
  return Object.getOwnPropertyNames(controller.prototype)
    .filter((name) => name !== 'constructor')
    .map((name) => ({
      name,
      handler: (controller.prototype as Record<string, unknown>)[name] as object,
    }));
}

function rolesFor(controller: ControllerClass, method: string) {
  const handler = (controller.prototype as Record<string, unknown>)[method] as object;
  return new Reflector().getAllAndOverride<Role[]>(ROLES_KEY, [handler, controller]);
}

describe('AI and research controller authorization metadata', () => {
  it.each(protectedControllers)('$name has no public authentication bypass', (controller) => {
    const reflector = new Reflector();
    expect(reflector.get<boolean>(IS_PUBLIC_KEY, controller)).not.toBe(true);
    for (const { name, handler } of controllerMethods(controller)) {
      expect({
        method: `${controller.name}.${name}`,
        isPublic: reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, controller]),
      }).toEqual({ method: `${controller.name}.${name}`, isPublic: undefined });
    }
  });

  it('protects the complete research dashboard controller with ADMIN role metadata', () => {
    for (const { name } of controllerMethods(ResearchController)) {
      expect({ method: name, roles: rolesFor(ResearchController, name) })
        .toEqual({ method: name, roles: [Role.ADMIN] });
    }
  });

  it.each([
    [TourismKnowledgeController, 'createSource'],
    [TourismKnowledgeController, 'ingest'],
    [GuideAssessmentsController, 'queue'],
    [GuideAssessmentsController, 'review'],
    [GuideAssessmentsController, 'createQuestion'],
  ] as const)('$name.$1 carries ADMIN role metadata', (controller, method) => {
    expect(rolesFor(controller, method)).toEqual([Role.ADMIN]);
  });

  it('keeps route catalog reads public but protects planner and validator writes', () => {
    const reflector = new Reflector();
    const metadata = Object.fromEntries(
      controllerMethods(RoutePlanningController).map(({ name, handler }) => [
        name,
        reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, RoutePlanningController]),
      ]),
    );
    expect(metadata).toMatchObject({
      list: true,
      one: true,
      validate: undefined,
      plan: undefined,
    });
  });
});
