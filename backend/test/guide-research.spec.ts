import { GuideResearchService } from '../src/modules/guide-research/guide-research.service.js';

describe('GuideResearchService rubric', () => {
  const service = new GuideResearchService({} as never);

  it('uses the official 50/50 skill and knowledge split', () => {
    const result = service.score({
      performance: { communication: 100, groupSafety: 100, explanationStructure: 100, factualPresentation: 100, touristCare: 100, questionHandling: 100, professionalism: 100 },
      knowledge: { historyArchaeology: 100, religionCulture: 100, geographyNature: 100, lawEthics: 100, societyEconomy: 100 },
      confidence: 0.9,
    });
    expect(result.performanceScore).toBe(50);
    expect(result.knowledgeScore).toBe(50);
    expect(result.totalScore).toBe(100);
    expect(result.preScreenPassed).toBe(true);
  });

  it('enforces the 60% skill gate before aggregate pass', () => {
    const result = service.score({
      performance: { communication: 50, groupSafety: 50, explanationStructure: 50, factualPresentation: 50, touristCare: 50, questionHandling: 50, professionalism: 50 },
      knowledge: { historyArchaeology: 100, religionCulture: 100, geographyNature: 100, lawEthics: 100, societyEconomy: 100 },
    });
    expect(result.totalScore).toBe(75);
    expect(result.passedSkillGate).toBe(false);
    expect(result.preScreenPassed).toBe(false);
  });
});
