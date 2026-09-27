export function mapUser(j = {}) {
  return {
    id: String(j.id ?? ''),
    name: String(j.name ?? ''),
    email: String(j.email ?? ''),
    phone: String(j.phone ?? ''),
    roles: (j.roles || []).map(String),
    avatarUrl: j.avatarUrl ? String(j.avatarUrl) : null,
    emailVerifiedAt: j.emailVerifiedAt ? String(j.emailVerifiedAt) : null,
    get isGuide() {
      return this.roles.includes('GUIDE');
    },
  };
}

export function mapSession(j = {}) {
  return {
    user: mapUser(j.user || {}),
    accessToken: String(j.accessToken ?? ''),
    refreshToken: String(j.refreshToken ?? ''),
  };
}

export function mapListing(json = {}) {
  const images = json.images || [];
  const host = json.host || {};
  return {
    id: String(json.id ?? ''),
    title: String(json.title ?? ''),
    location: String(json.location ?? ''),
    images: images.map((item) =>
      item && typeof item === 'object' ? String(item.url) : String(item),
    ),
    rating: Number(json.rating) || 0,
    reviews: Number(json.reviewCount ?? json.reviews ?? 0) || 0,
    price: Number.isInteger(json.basePriceMinor) ? json.basePriceMinor / 100 : Number(json.price) || 0,
    basePriceMinor: Number(json.basePriceMinor) || 0,
    currency: String(json.currency ?? 'USD'),
    priceUnit: ({ PER_NIGHT: 'night', PER_HOUR: 'hour', PER_DAY: 'day', PER_PERSON: 'person', PER_GROUP: 'group', PACKAGE: 'package' })[json.priceUnit] || String(json.priceUnit ?? 'night'),
    dates: String(json.datesLabel ?? json.dates ?? ''),
    tags: (json.tags || []).map(String),
    category: String(json.category ?? '').toLowerCase(),
    description: String(json.description ?? ''),
    amenities: (json.amenities || []).map(String),
    hostName: String(host.name ?? json.hostName ?? 'Local host'),
    hostPhoto: String(host.avatarUrl ?? json.hostPhoto ?? ''),
    superhost: Boolean(host.isVerified ?? json.superhost ?? false),
    isCached: Boolean(json.isCached),
  };
}

export function mapGuide(json = {}) {
  const user = json.user || {};
  const list = (value) => (Array.isArray(value) ? value : []);
  const numberOrNull = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };
  const packages = (json.packages || []).map((p) => ({
    id: String(p.id ?? ''),
    title: String(p.title ?? ''),
    days: Number(p.days) || 1,
    price: Number(p.price) || 0,
  }));
  return {
    id: String(json.id ?? user.id ?? json.userId ?? ''),
    userId: String(json.userId ?? user.id ?? ''),
    name: String(user.name ?? json.name ?? 'Local guide'),
    photo: String(user.avatarUrl ?? json.photo ?? ''),
    rating: Number(json.rating) || 0,
    reviews: Number(json.reviewCount ?? json.reviews ?? 0) || 0,
    languages: Array.isArray(json.languages)
      ? json.languages.map((l) =>
          typeof l === 'string'
            ? l
            : `${String(l.name ?? '')}${l.proficiency ? ` (${l.proficiency})` : ''}`,
        )
      : json.languages && typeof json.languages === 'object'
        ? Object.entries(json.languages).map(
            ([language, proficiency]) => `${language} (${proficiency})`,
          )
        : [],
    specialties: [...new Set([
      ...list(json.expertise || json.specialties).map(String),
      ...list(json.specialtySkills).map(String),
    ])],
    price: Number(json.price) || 0,
    experience: Number(json.experienceYears ?? json.experience ?? 0) || 0,
    availableToday: Boolean(json.availableToday ?? true),
    bio: String(json.bio ?? ''),
    location: [json.city, json.country].filter(Boolean).join(', ') ||
      String(json.location ?? ''),
    packages,
    verified: Boolean(json.verified),
    status: json.status,
    legalRole: String(json.legalRole ?? 'UNVERIFIED'),
    availability: list(json.availability).map(String),
    completedTrips: Number(json.completedTrips) || 0,
    evidence: list(json.evidence).filter(Boolean).map((item) => ({
      type: String(item.type ?? ''),
      issuer: String(item.issuer ?? ''),
      status: String(item.status ?? ''),
      verifiedAt: item.verifiedAt ? String(item.verifiedAt) : null,
      expiresAt: item.expiresAt ? String(item.expiresAt) : null,
    })),
    languageAssessments: list(json.languageAssessments).filter(Boolean).map((item) => ({
      language: String(item.language ?? ''),
      officialEvidenceType: item.officialEvidenceType ? String(item.officialEvidenceType) : null,
      aiEstimatedCefr: item.aiEstimatedCefr ? String(item.aiEstimatedCefr) : null,
      aiConfidence: numberOrNull(item.aiConfidence),
      humanVerifiedCefr: item.humanVerifiedCefr ? String(item.humanVerifiedCefr) : null,
      status: String(item.assessmentStatus ?? 'NOT_ASSESSED'),
      createdAt: item.createdAt ? String(item.createdAt) : null,
    })),
    knowledgeAssessment: json.knowledgeAssessments?.[0] ? {
      score: numberOrNull(json.knowledgeAssessments[0].totalScore),
      passed: Boolean(json.knowledgeAssessments[0].pass),
      evaluatorType: String(json.knowledgeAssessments[0].evaluatorType ?? ''),
    } : null,
    skillAssessment: json.skillAssessments?.[0] ? {
      score: numberOrNull(json.skillAssessments[0].totalScore),
      humanReviewStatus: String(json.skillAssessments[0].humanReviewStatus ?? 'NOT_REQUESTED'),
    } : null,
    routeCompetencies: list(json.routeCompetencies).filter(Boolean).map((item) => ({
      routeFamily: String(item.routeFamily ?? ''),
      score: numberOrNull(item.score),
      status: String(item.status ?? 'NOT_ASSESSED'),
      passedAt: item.passedAt ? String(item.passedAt) : null,
      expiresAt: item.expiresAt ? String(item.expiresAt) : null,
    })),
    firstAid: json.firstAidRecords?.[0] ? {
      certificateStatus: String(json.firstAidRecords[0].certificateStatus ?? 'NOT_PROVIDED'),
      theoryScore: numberOrNull(json.firstAidRecords[0].theoryScore),
      practicalVerificationStatus: String(json.firstAidRecords[0].practicalVerificationStatus ?? 'NOT_ASSESSED'),
      expiresAt: json.firstAidRecords[0].expiresAt ? String(json.firstAidRecords[0].expiresAt) : null,
    } : null,
  };
}

export function mapSocialPost(json = {}) {
  const images = json.images || [];
  const authorRaw = json.author || {};
  const author = {
    id: String(authorRaw.id ?? ''),
    name: String(authorRaw.name ?? 'Traveler'),
    avatarUrl: String(authorRaw.avatarUrl ?? ''),
    home: String(authorRaw.home ?? authorRaw.location ?? ''),
    following: Boolean(authorRaw.following),
    followsYou: Boolean(authorRaw.followsYou),
  };
  return {
    id: String(json.id ?? ''),
    author,
    text: String(json.text ?? ''),
    location: String(json.location ?? ''),
    timeLabel: String(json.timeLabel ?? 'now'),
    imageUrl: images.length
      ? String(images[0]?.url ?? images[0] ?? '')
      : json.imageUrl
        ? String(json.imageUrl)
        : null,
    likeCount: Number(json._count?.likes ?? json.likeCount ?? 0) || 0,
    liked: Boolean(json.liked),
    comments: (json.comments || []).map((c) => ({
      id: String(c.id ?? ''),
      author: {
        id: String(c.author?.id ?? ''),
        name: String(c.author?.name ?? 'Traveler'),
        avatarUrl: String(c.author?.avatarUrl ?? ''),
      },
      text: String(c.text ?? ''),
      timeLabel: String(c.timeLabel ?? 'now'),
    })),
  };
}

export function mapConversation(json = {}, currentUserId) {
  const participants = json.participants || [];
  let peer = null;
  for (const p of participants) {
    const user = p.user;
    if (user && String(user.id) !== String(currentUserId)) {
      peer = user;
      break;
    }
  }
  const latest = (json.messages || [])[0];
  const mine = participants.find((participant) => String(participant.userId) === String(currentUserId));
  return {
    id: String(json.id ?? ''),
    guide: String(peer?.name ?? 'Traveler'),
    photo: String(peer?.avatarUrl ?? ''),
    last:
      latest?.body ||
      (latest?.mediaUrl ? 'Photo' : 'Start a conversation'),
    time: timeLabel(json.updatedAt),
    peerId: peer?.id ? String(peer.id) : null,
    muted: Boolean(mine?.mutedAt),
  };
}

export function mapMessage(json = {}, currentUserId) {
  const sentAt = json.sentAt ? new Date(json.sentAt) : null;
  const time = sentAt
    ? `${String(sentAt.getHours()).padStart(2, '0')}:${String(sentAt.getMinutes()).padStart(2, '0')}`
    : '';
  return {
    id: String(json.id ?? ''),
    me: String(json.senderId) === String(currentUserId),
    time,
    text: json.body ? String(json.body) : null,
    image: json.mediaUrl ? String(json.mediaUrl) : null,
    read: true,
  };
}

function timeLabel(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  const age = Date.now() - date.getTime();
  if (age < 60000) return 'Now';
  if (age < 3600000) return `${Math.floor(age / 60000)}m`;
  if (age < 86400000) return `${Math.floor(age / 3600000)}h`;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
