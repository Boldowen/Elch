import { jest } from '@jest/globals';
import { GuidesService } from '../src/modules/guides/guides.service.js';

describe('GuidesService public projection', () => {
  it('uses an explicit safe select for public guide lists', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const service = new GuidesService({
      guideProfile: { findMany },
    } as never);

    await service.findAll();

    const query = findMany.mock.calls[0]?.[0] as { select?: Record<string, unknown> };
    expect(query.select).toBeDefined();
    expect(query.select).not.toHaveProperty('referenceContact');
    expect(query.select).not.toHaveProperty('assessmentScore');
    expect(query.select).not.toHaveProperty('cancellationCount');
    expect(query.select).not.toHaveProperty('reliabilityScore');
    expect(query.select?.evidence).toEqual(expect.objectContaining({
      select: expect.not.objectContaining({ referenceContact: true, referenceName: true }),
    }));
  });

  it('does not fall back to an unrestricted include on the public detail endpoint', async () => {
    const findFirst = jest.fn().mockResolvedValue({ id: 'guide-1' });
    const service = new GuidesService({
      guideProfile: { findFirst },
    } as never);

    await service.findOne('guide-1');

    const query = findFirst.mock.calls[0]?.[0] as {
      select?: Record<string, unknown>;
      include?: Record<string, unknown>;
    };
    expect(query.select).toBeDefined();
    expect(query.include).toBeUndefined();
    expect(query.select).not.toHaveProperty('referenceContact');
  });
});
