import { RouteGraphData } from './route.types.js';

const months = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

export const ROUTE_GRAPH: RouteGraphData = {
  disclaimer:
    'Research prototype only. Road, weather, price, permit and access conditions must be re-verified for the travel date.',
  sources: [
    { id: 'mto-central', title: 'Mongolia tourism information: Central Mongolia', url: 'https://www.mongolia.travel/', authority: 2, lastVerifiedAt: '2026-08-10', verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW' },
    { id: 'omnogovi', title: 'Umnugovi tourism information', url: 'https://www.omnogovi.gov.mn/', authority: 4, lastVerifiedAt: '2026-08-10', verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW' },
    { id: 'khuvsgul', title: 'Khuvsgul province tourism information', url: 'https://khovsgol.gov.mn/', authority: 4, lastVerifiedAt: '2026-08-10', verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW' },
    { id: 'unesco-orkhon', title: 'Orkhon Valley Cultural Landscape', url: 'https://whc.unesco.org/en/list/1081/', authority: 3, lastVerifiedAt: '2026-08-10', verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW' },
    { id: 'unesco-altai', title: 'Petroglyphic Complexes of the Mongolian Altai', url: 'https://whc.unesco.org/en/list/1382/', authority: 3, lastVerifiedAt: '2026-08-10', verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW' },
  ],
  pois: [
    { id: 'ulaanbaatar', nameMn: 'Улаанбаатар', nameEn: 'Ulaanbaatar', region: 'Ulaanbaatar', type: 'CITY', latitude: 47.9185, longitude: 106.9177, sourceId: 'mto-central' },
    { id: 'kharkhorin', nameMn: 'Хархорин', nameEn: 'Kharkhorin', region: 'Uvurkhangai', type: 'HERITAGE', latitude: 47.1975, longitude: 102.8238, sourceId: 'unesco-orkhon' },
    { id: 'orkhon-valley', nameMn: 'Орхоны хөндий', nameEn: 'Orkhon Valley', region: 'Uvurkhangai', type: 'HERITAGE', latitude: 46.832, longitude: 102.824, sourceId: 'unesco-orkhon' },
    { id: 'dalanzadgad', nameMn: 'Даланзадгад', nameEn: 'Dalanzadgad', region: 'Umnugovi', type: 'CITY', latitude: 43.5708, longitude: 104.425, sourceId: 'omnogovi' },
    { id: 'yolyn-am', nameMn: 'Ёлын ам', nameEn: 'Yolyn Am', region: 'Umnugovi', type: 'NATURE', latitude: 43.479, longitude: 104.063, sourceId: 'omnogovi' },
    { id: 'khongoryn-els', nameMn: 'Хонгорын элс', nameEn: 'Khongoryn Els', region: 'Umnugovi', type: 'NATURE', latitude: 43.772, longitude: 102.273, sourceId: 'omnogovi' },
    { id: 'bayanzag', nameMn: 'Баянзаг', nameEn: 'Bayanzag', region: 'Umnugovi', type: 'HERITAGE', latitude: 44.139, longitude: 103.701, sourceId: 'omnogovi' },
    { id: 'moron', nameMn: 'Мөрөн', nameEn: 'Moron', region: 'Khuvsgul', type: 'CITY', latitude: 49.634, longitude: 100.162, sourceId: 'khuvsgul' },
    { id: 'khatgal', nameMn: 'Хатгал', nameEn: 'Khatgal', region: 'Khuvsgul', type: 'CITY', latitude: 50.436, longitude: 100.154, sourceId: 'khuvsgul' },
    { id: 'khuvsgul-lake', nameMn: 'Хөвсгөл нуур', nameEn: 'Khuvsgul Lake', region: 'Khuvsgul', type: 'NATURE', latitude: 51.1, longitude: 100.5, sourceId: 'khuvsgul' },
    { id: 'olgii', nameMn: 'Өлгий', nameEn: 'Olgii', region: 'Bayan-Ulgii', type: 'CITY', latitude: 48.968, longitude: 89.968, sourceId: 'unesco-altai' },
    { id: 'tsagaan-salaa', nameMn: 'Цагаан Салаа-Бага Ойгор', nameEn: 'Tsagaan Salaa-Baga Oigor', region: 'Bayan-Ulgii', type: 'HERITAGE', latitude: 49.4, longitude: 88.4, sourceId: 'unesco-altai' },
    { id: 'upper-tsagaan-gol', nameMn: 'Цагаан голын дээд хэсэг', nameEn: 'Upper Tsagaan Gol', region: 'Bayan-Ulgii', type: 'TRAILHEAD', latitude: 49.1, longitude: 88.1, sourceId: 'unesco-altai' },
    { id: 'aral-tolgoi', nameMn: 'Арал толгой', nameEn: 'Aral Tolgoi', region: 'Bayan-Ulgii', type: 'HERITAGE', latitude: 48.65, longitude: 88.6, sourceId: 'unesco-altai' },
  ],
  edges: [
    { id: 'ub-kharkhorin', from: 'ulaanbaatar', to: 'kharkhorin', mode: 'ROAD', distanceKm: 360, nominalMinutes: 360, openMonths: months(1, 12), riskClass: 'R1', requiredSkills: ['central-heritage'], estimatedCostMinor: 9000, sourceId: 'mto-central' },
    { id: 'kharkhorin-orkhon', from: 'kharkhorin', to: 'orkhon-valley', mode: 'OFF_ROAD', distanceKm: 120, nominalMinutes: 240, openMonths: months(5, 10), riskClass: 'R2', requiredSkills: ['central-heritage', 'first-aid'], estimatedCostMinor: 7000, sourceId: 'unesco-orkhon' },
    { id: 'dalanzadgad-yol', from: 'dalanzadgad', to: 'yolyn-am', mode: 'ROAD', distanceKm: 45, nominalMinutes: 75, openMonths: months(4, 10), riskClass: 'R1', requiredSkills: ['gobi'], estimatedCostMinor: 3000, sourceId: 'omnogovi' },
    { id: 'yol-khongor', from: 'yolyn-am', to: 'khongoryn-els', mode: 'OFF_ROAD', distanceKm: 180, nominalMinutes: 300, openMonths: months(5, 10), riskClass: 'R2', requiredSkills: ['gobi', 'first-aid'], estimatedCostMinor: 9000, sourceId: 'omnogovi' },
    { id: 'khongor-bayanzag', from: 'khongoryn-els', to: 'bayanzag', mode: 'OFF_ROAD', distanceKm: 150, nominalMinutes: 270, openMonths: months(5, 10), riskClass: 'R2', requiredSkills: ['gobi', 'first-aid'], estimatedCostMinor: 8000, sourceId: 'omnogovi' },
    { id: 'moron-khatgal', from: 'moron', to: 'khatgal', mode: 'ROAD', distanceKm: 100, nominalMinutes: 120, openMonths: months(1, 12), riskClass: 'R1', requiredSkills: ['khuvsgul'], estimatedCostMinor: 4000, sourceId: 'khuvsgul' },
    { id: 'khatgal-lake', from: 'khatgal', to: 'khuvsgul-lake', mode: 'BOAT', distanceKm: 35, nominalMinutes: 120, openMonths: months(6, 9), riskClass: 'R2', requiredSkills: ['khuvsgul', 'water-safety', 'first-aid'], estimatedCostMinor: 5000, sourceId: 'khuvsgul' },
    { id: 'olgii-tsagaan', from: 'olgii', to: 'tsagaan-salaa', mode: 'OFF_ROAD', distanceKm: 230, nominalMinutes: 480, openMonths: months(6, 9), riskClass: 'R2', requiredSkills: ['western-altai', 'first-aid'], estimatedCostMinor: 12000, sourceId: 'unesco-altai' },
    { id: 'tsagaan-upper', from: 'tsagaan-salaa', to: 'upper-tsagaan-gol', mode: 'TREK', distanceKm: 28, nominalMinutes: 480, openMonths: months(6, 9), riskClass: 'R3', requiredSkills: ['western-altai', 'trekking', 'first-aid'], estimatedCostMinor: 6000, sourceId: 'unesco-altai' },
    { id: 'upper-aral', from: 'upper-tsagaan-gol', to: 'aral-tolgoi', mode: 'TREK', distanceKm: 22, nominalMinutes: 420, openMonths: months(6, 9), riskClass: 'R3', requiredSkills: ['western-altai', 'trekking', 'first-aid'], estimatedCostMinor: 6000, sourceId: 'unesco-altai' },
  ],
  routes: [
    { id: 'central-heritage', name: 'Central Mongolia Heritage', description: 'Ulaanbaatar, Kharkhorin and Orkhon Valley research route.', recommendedDays: { min: 4, max: 7 }, poiIds: ['ulaanbaatar', 'kharkhorin', 'orkhon-valley'], riskClass: 'R2', guideRequirements: { minimumLanguageLevel: 'B2', routeBadge: 'central-heritage', firstAidRequired: true, legalRole: 'LICENSED_PROFESSIONAL_GUIDE', specialtySkills: ['heritage-interpretation'] } },
    { id: 'gobi', name: 'Gobi Paleontology & Desert', description: 'Desert, geology and paleontology research route.', recommendedDays: { min: 6, max: 9 }, poiIds: ['dalanzadgad', 'yolyn-am', 'khongoryn-els', 'bayanzag'], riskClass: 'R2', guideRequirements: { minimumLanguageLevel: 'B2', routeBadge: 'gobi', firstAidRequired: true, legalRole: 'LICENSED_PROFESSIONAL_GUIDE', specialtySkills: ['remote-navigation', 'heat-safety'] } },
    { id: 'khuvsgul', name: 'Khuvsgul Lake & Taiga', description: 'Lake, taiga and northern Mongolia research route.', recommendedDays: { min: 4, max: 7 }, poiIds: ['moron', 'khatgal', 'khuvsgul-lake'], riskClass: 'R2', guideRequirements: { minimumLanguageLevel: 'B2', routeBadge: 'khuvsgul', firstAidRequired: true, legalRole: 'LICENSED_PROFESSIONAL_GUIDE', specialtySkills: ['water-safety', 'cold-exposure'] } },
    { id: 'western-altai', name: 'Western Altai Heritage & Trekking', description: 'Altai archaeology and trekking research route.', recommendedDays: { min: 7, max: 12 }, poiIds: ['olgii', 'tsagaan-salaa', 'upper-tsagaan-gol', 'aral-tolgoi'], riskClass: 'R3', guideRequirements: { minimumLanguageLevel: 'B2', routeBadge: 'western-altai', firstAidRequired: true, legalRole: 'SPECIALIST_INSTRUCTOR', specialtySkills: ['trekking', 'altitude-safety'] } },
  ],
};
