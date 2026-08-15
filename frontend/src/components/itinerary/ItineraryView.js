import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import SourceList from '../assistant/SourceList';
import RiskBadge from './RiskBadge';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function displayPoiName(poi, language) {
  if (!poi) return '';
  return language === 'mn' ? poi.nameMn || poi.nameEn : poi.nameEn || poi.nameMn;
}

function edgeBetween(edges, from, to) {
  return edges.find((edge) =>
    (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from),
  );
}

function seasonLabel(months) {
  if (!months?.length) return '—';
  if (months.length === 12) return 'All year';
  return months.map((month) => MONTHS[month - 1]).filter(Boolean).join(', ');
}

export default function ItineraryView({ route, language = 'en', labels }) {
  if (!route) return null;
  const poiById = new Map(route.pois.map((poi) => [poi.id, poi]));
  const orderedPois = route.poiIds.map((id) => poiById.get(id)).filter(Boolean);

  return (
    <View style={styles.root}>
      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <Text style={styles.title}>{route.name}</Text>
          <Text style={styles.description}>{route.description}</Text>
        </View>
        <RiskBadge risk={route.riskClass} label={labels.risk} />
      </View>

      {route.guideRequirements ? (
        <View style={styles.requirements}>
          <View style={styles.requirementTitleRow}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.brand} />
            <Text style={styles.requirementTitle}>{labels.guideRequirements}</Text>
          </View>
          <Text style={styles.requirementText}>
            {labels.language} {route.guideRequirements.minimumLanguageLevel || '—'} · {labels.role} {route.guideRequirements.legalRole.replaceAll('_', ' ').toLowerCase()}
          </Text>
          <Text style={styles.requirementText}>
            {labels.skills}: {route.guideRequirements.specialtySkills.join(', ') || '—'}
          </Text>
          {route.guideRequirements.firstAidRequired ? (
            <Text style={styles.firstAid}>{labels.firstAidRequired}</Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.timeline}>
        {orderedPois.map((poi, index) => {
          const previous = index > 0 ? orderedPois[index - 1] : null;
          const incoming = previous ? edgeBetween(route.edges, previous.id, poi.id) : null;
          return (
            <View key={poi.id} style={styles.day}>
              <View style={styles.dayRail}>
                <View style={styles.dayDot}><Text style={styles.dayNumber}>{index + 1}</Text></View>
                {index < orderedPois.length - 1 ? <View style={styles.line} /> : null}
              </View>
              <View style={styles.dayBody}>
                <Text style={styles.dayEyebrow}>{labels.day} {index + 1}</Text>
                <Text style={styles.poiName}>{displayPoiName(poi, language)}</Text>
                <Text style={styles.poiMeta}>{poi.region} · {poi.type.replaceAll('_', ' ').toLowerCase()}</Text>
                <Text style={styles.activity}>{labels.activityTime}: 2 {labels.hours}</Text>
                {incoming ? (
                  <View style={styles.segment}>
                    <View style={styles.segmentTop}>
                      <Ionicons name="navigate-outline" size={16} color={colors.inkSoft} />
                      <Text style={styles.segmentTitle}>{labels.travelSegment}</Text>
                      <View style={styles.spacer} />
                      <RiskBadge risk={incoming.riskClass} />
                    </View>
                    <Text style={styles.segmentText}>
                      {incoming.mode.replaceAll('_', ' ').toLowerCase()} · {incoming.distanceKm} km · {Math.round(incoming.nominalMinutes / 60 * 10) / 10} {labels.hours}
                    </Text>
                    <Text style={styles.segmentText}>{labels.season}: {seasonLabel(incoming.openMonths)}</Text>
                    <Text style={styles.segmentText}>{labels.skills}: {incoming.requiredSkills.join(', ') || '—'}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      <SourceList sources={route.sources} title={labels.sources} verifiedLabel={labels.verified} />
      {route.disclaimer ? <Text style={styles.disclaimer}>{route.disclaimer}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  titleCopy: { flex: 1 },
  title: { color: colors.ink, fontSize: 20, fontWeight: '800' },
  description: { color: colors.inkSoft, fontSize: 13, lineHeight: 19, marginTop: 4 },
  requirements: { gap: 5, padding: 13, borderRadius: radius.md, backgroundColor: '#FFF7F8' },
  requirementTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  requirementTitle: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  requirementText: { color: colors.ink, fontSize: 12, lineHeight: 18 },
  firstAid: { color: '#B42318', fontSize: 12, fontWeight: '700' },
  timeline: { gap: 0 },
  day: { flexDirection: 'row', minHeight: 112 },
  dayRail: { width: 38, alignItems: 'center' },
  dayDot: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  dayNumber: { color: colors.white, fontSize: 12, fontWeight: '800' },
  line: { width: 2, flex: 1, backgroundColor: colors.border },
  dayBody: { flex: 1, paddingLeft: 8, paddingBottom: 16 },
  dayEyebrow: { color: colors.brand, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  poiName: { color: colors.ink, fontSize: 16, fontWeight: '700', marginTop: 2 },
  poiMeta: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
  activity: { color: colors.ink, fontSize: 12, marginTop: 6 },
  segment: { gap: 4, marginTop: 9, padding: 10, borderRadius: radius.sm, backgroundColor: colors.secondary },
  segmentTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  segmentTitle: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  segmentText: { color: colors.inkSoft, fontSize: 11, lineHeight: 16 },
  spacer: { flex: 1 },
  disclaimer: { color: colors.inkSoft, fontSize: 11, lineHeight: 17 },
});
