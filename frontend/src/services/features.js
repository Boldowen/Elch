import { useEffect, useState } from 'react';
import { api } from './api';

// Mirrors the backend defaults so a failed request hides flag-gated screens
// instead of showing ones whose endpoints answer FEATURE_DISABLED.
const DEFAULTS = { community: false, reviews: true, guideRanking: false, imageUpload: false, onlinePayment: false };

let cached = null;
let pending = null;

function loadFeatures() {
  if (!pending) {
    pending = api.get('/features')
      .then(({ data }) => { cached = { ...DEFAULTS, ...data }; return cached; })
      .catch(() => { pending = null; return DEFAULTS; });
  }
  return pending;
}

export function useFeatures() {
  const [features, setFeatures] = useState(cached || DEFAULTS);
  useEffect(() => {
    let active = true;
    loadFeatures().then((value) => { if (active) setFeatures(value); });
    return () => { active = false; };
  }, []);
  return features;
}
