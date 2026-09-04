import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminAccessBoundary from '../components/admin/AdminAccessBoundary';
import { AppButton, AppInput, Chip, ScreenHeader, StateBox } from '../components/ui';
import { adminRepository } from '../repositories/adminRepository';
import { apiErrorMessage } from '../services/api';
import { formatDateTime, useT } from '../localization';
import { colors, radius, spacing } from '../theme';

const FAMILIES = ['CENTRAL_HERITAGE', 'GOBI', 'KHUVSGUL', 'WESTERN_ALTAI'];
const RISKS = ['R0', 'R1', 'R2', 'R3', 'R4'];
const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEGAL_ROLES = ['UNVERIFIED', 'LICENSED_PROFESSIONAL', 'LICENSED_PROFESSIONAL_GUIDE', 'LOCAL_HOST', 'SPECIALIST_INSTRUCTOR'];
const NODE_TYPES = ['CITY', 'DESTINATION', 'HERITAGE', 'MUSEUM', 'NATURE', 'TRAILHEAD', 'TRANSPORT_HUB', 'ACCOMMODATION', 'OTHER'];
const TRANSPORT = ['ROAD', 'OFF_ROAD', 'TREK', 'BOAT', 'AIR', 'RAIL', 'HORSE', 'OTHER'];
const CODE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const blankRoute = () => ({
  sourceId: '', code: '', name: '', routeFamily: 'CENTRAL_HERITAGE', description: '',
  minimumDays: '3', recommendedDays: '5', riskLevel: 'R2', minimumLanguageLevel: 'B1',
  routeBadge: '', firstAidRequired: false, requiredGuideLegalRole: 'LOCAL_HOST',
  requiredSpecialtySkills: '', active: true,
});

const routeDraft = (route) => ({
  sourceId: route.sourceId || '', code: route.code, name: route.name, routeFamily: route.routeFamily,
  description: route.description, minimumDays: String(route.minimumDays), recommendedDays: String(route.recommendedDays),
  riskLevel: route.riskLevel, minimumLanguageLevel: route.minimumLanguageLevel, routeBadge: route.routeBadge,
  firstAidRequired: route.firstAidRequired, requiredGuideLegalRole: route.requiredGuideLegalRole,
  requiredSpecialtySkills: route.requiredSpecialtySkills.join(', '), active: route.active,
});

const blankNode = () => ({
  sourceId: '', code: '', nameMn: '', nameEn: '', region: '', latitude: '', longitude: '',
  altitude: '', nodeType: 'DESTINATION', sequenceHint: '', minimumVisitMinutes: '', active: true,
});

const nodeDraft = (node) => ({
  sourceId: node.sourceId || '', code: node.code, nameMn: node.nameMn, nameEn: node.nameEn,
  region: node.region, latitude: String(node.latitude), longitude: String(node.longitude),
  altitude: node.altitude === null ? '' : String(node.altitude), nodeType: node.nodeType,
  sequenceHint: node.sequenceHint === null ? '' : String(node.sequenceHint),
  minimumVisitMinutes: node.minimumVisitMinutes === null ? '' : String(node.minimumVisitMinutes), active: node.active,
});

const blankEdge = (route) => ({
  sourceId: '', code: '', from: route.nodes[0]?.code || '', to: route.nodes[1]?.code || '',
  transportMode: 'ROAD', distanceKm: '', estimatedTravelMinutes: '', estimatedCostMinor: '',
  estimatedCostCurrency: 'USD', terrain: '', riskLevel: route.riskLevel, openMonths: '6, 7, 8',
  bidirectional: true, requiresRoadCheck: true, requiresWeatherCheck: true,
  requiresPermitCheck: false, requiresGuide: route.riskLevel === 'R3' || route.riskLevel === 'R4',
  requiredGuideCompetencies: '', emergencyPlanRequired: route.riskLevel === 'R3' || route.riskLevel === 'R4',
  active: true, lastVerifiedAt: new Date().toISOString().slice(0, 10),
});

const edgeDraft = (edge) => ({
  sourceId: edge.sourceId || '', code: edge.code, from: edge.from, to: edge.to,
  transportMode: edge.transportMode, distanceKm: String(edge.distanceKm),
  estimatedTravelMinutes: String(edge.estimatedTravelMinutes),
  estimatedCostMinor: edge.estimatedCostMinor === null ? '' : String(edge.estimatedCostMinor),
  estimatedCostCurrency: edge.estimatedCostCurrency || 'USD', terrain: edge.terrain || '',
  riskLevel: edge.riskLevel, openMonths: edge.openMonths.join(', '), bidirectional: edge.bidirectional,
  requiresRoadCheck: edge.requiresRoadCheck, requiresWeatherCheck: edge.requiresWeatherCheck,
  requiresPermitCheck: edge.requiresPermitCheck, requiresGuide: edge.requiresGuide,
  requiredGuideCompetencies: edge.requiredGuideCompetencies.join(', '),
  emergencyPlanRequired: edge.emergencyPlanRequired, active: edge.active,
  lastVerifiedAt: (edge.lastVerifiedAt || new Date().toISOString()).slice(0, 10),
});

function csv(value) {
  return [...new Set(String(value || '').split(',').map((item) => item.trim()).filter(Boolean))];
}

function wholeNumber(value) {
  const result = Number(value);
  return Number.isInteger(result) ? result : null;
}

function decimal(value) {
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

function isoDate(value) {
  const result = new Date(`${String(value || '').trim()}T00:00:00.000Z`);
  return Number.isNaN(result.getTime()) ? null : result.toISOString();
}

function Chips({ values, value, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      {values.map((option) => <Chip key={option} label={option} active={value === option} onPress={() => onChange(option)} />)}
    </ScrollView>
  );
}

function ChoiceField({ label, values, value, onChange }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><Chips values={values} value={value} onChange={onChange} /></View>;
}

function BooleanField({ label, value, onChange, t }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.booleanRow}>
        <Chip label={t('common.yes')} active={value} onPress={() => onChange(true)} />
        <Chip label={t('common.no')} active={!value} onPress={() => onChange(false)} />
      </View>
    </View>
  );
}

function SourceField({ value, onChange, sources, required, t }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{t('routeGraph.source')}{required ? ' *' : ''}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {!required ? <Chip label={t('routeGraph.noSource')} active={!value} onPress={() => onChange('')} /> : null}
        {sources.map((source) => (
          <Chip key={source.id} label={source.title || source.organization} active={value === source.id} onPress={() => onChange(source.id)} />
        ))}
      </ScrollView>
      {!sources.length ? <AppInput value={value} onChangeText={onChange} placeholder={t('routeGraph.sourceId')} autoCapitalize="none" style={styles.compactInput} /> : null}
    </View>
  );
}

function ErrorPanel({ error, onRetry, t }) {
  return (
    <View style={styles.center} accessibilityLiveRegion="assertive">
      <Ionicons name="cloud-offline-outline" size={36} color={colors.warning} />
      <Text style={styles.centerTitle}>{t('routeGraph.loadFailed')}</Text>
      <Text style={styles.centerCopy}>{error}</Text>
      <AppButton title={t('common.retry')} onPress={onRetry} style={styles.retry} />
    </View>
  );
}

export default function AdminRouteGraphScreen({ navigation }) {
  const { t, language } = useT();
  const [routes, setRoutes] = useState([]);
  const [sources, setSources] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const [graphResult, sourceResult] = await Promise.allSettled([
        adminRepository.routeGraphs(),
        adminRepository.tourismSources({ limit: 100 }),
      ]);
      if (graphResult.status === 'rejected') throw graphResult.reason;
      setRoutes(graphResult.value);
      if (sourceResult.status === 'fulfilled') setSources(sourceResult.value);
      if (selected) {
        const updated = graphResult.value.find((route) => route.code === selected.code);
        if (updated) setSelected(updated);
      }
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selected?.code]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateDraft = (key, value) => setEditor((current) => ({ ...current, draft: { ...current.draft, [key]: value } }));
  const routeReference = selected?.databaseId || selected?.code;

  const saveResult = (route) => {
    setRoutes((current) => {
      const exists = current.some((item) => item.code === route.code || (route.databaseId && item.databaseId === route.databaseId));
      return exists
        ? current.map((item) => item.code === route.code || (route.databaseId && item.databaseId === route.databaseId) ? route : item)
        : [...current, route];
    });
    setSelected(route);
    setEditor(null);
  };

  const validateRoute = (draft) => {
    const minimumDays = wholeNumber(draft.minimumDays);
    const recommendedDays = wholeNumber(draft.recommendedDays);
    if (!CODE_PATTERN.test(draft.code) || draft.name.trim().length < 2 || draft.description.trim().length < 10 || !draft.routeBadge.match(CODE_PATTERN)) return null;
    if (minimumDays === null || recommendedDays === null || minimumDays < 1 || minimumDays > recommendedDays || recommendedDays > 90) return null;
    return {
      ...(draft.sourceId ? { sourceId: draft.sourceId } : {}), code: draft.code, name: draft.name.trim(),
      routeFamily: draft.routeFamily, description: draft.description.trim(), minimumDays, recommendedDays,
      riskLevel: draft.riskLevel, minimumLanguageLevel: draft.minimumLanguageLevel, routeBadge: draft.routeBadge,
      firstAidRequired: draft.firstAidRequired, requiredGuideLegalRole: draft.requiredGuideLegalRole,
      requiredSpecialtySkills: csv(draft.requiredSpecialtySkills), active: draft.active,
    };
  };

  const validateNode = (draft) => {
    const latitude = decimal(draft.latitude);
    const longitude = decimal(draft.longitude);
    const altitude = draft.altitude === '' ? undefined : wholeNumber(draft.altitude);
    const sequenceHint = draft.sequenceHint === '' ? undefined : wholeNumber(draft.sequenceHint);
    const minimumVisitMinutes = draft.minimumVisitMinutes === '' ? undefined : wholeNumber(draft.minimumVisitMinutes);
    if (!CODE_PATTERN.test(draft.code) || !draft.nameMn.trim() || !draft.nameEn.trim() || !draft.region.trim()) return null;
    if (latitude === null || latitude < -90 || latitude > 90 || longitude === null || longitude < -180 || longitude > 180) return null;
    if ((draft.altitude !== '' && altitude === null) || (draft.sequenceHint !== '' && sequenceHint === null) || (draft.minimumVisitMinutes !== '' && minimumVisitMinutes === null)) return null;
    return {
      ...(draft.sourceId ? { sourceId: draft.sourceId } : {}), code: draft.code, nameMn: draft.nameMn.trim(),
      nameEn: draft.nameEn.trim(), region: draft.region.trim(), latitude, longitude,
      ...(altitude === undefined ? {} : { altitude }), nodeType: draft.nodeType,
      ...(sequenceHint === undefined ? {} : { sequenceHint }),
      ...(minimumVisitMinutes === undefined ? {} : { minimumVisitMinutes }), active: draft.active,
    };
  };

  const validateEdge = (draft) => {
    const from = selected.nodes.find((node) => node.code === draft.from);
    const to = selected.nodes.find((node) => node.code === draft.to);
    const distanceKm = decimal(draft.distanceKm);
    const estimatedTravelMinutes = wholeNumber(draft.estimatedTravelMinutes);
    const estimatedCostMinor = draft.estimatedCostMinor === '' ? undefined : wholeNumber(draft.estimatedCostMinor);
    const months = csv(draft.openMonths).map(Number);
    const verified = isoDate(draft.lastVerifiedAt);
    if (!from?.databaseId || !to?.databaseId || from.code === to.code || !draft.sourceId || !CODE_PATTERN.test(draft.code)) return null;
    if (distanceKm === null || distanceKm <= 0 || estimatedTravelMinutes === null || estimatedTravelMinutes < 1 || (estimatedCostMinor !== undefined && (estimatedCostMinor === null || estimatedCostMinor < 0))) return null;
    if (!months.length || months.some((month) => !Number.isInteger(month) || month < 1 || month > 12) || !verified) return null;
    return {
      fromNodeId: from.databaseId, toNodeId: to.databaseId, sourceId: draft.sourceId, code: draft.code,
      transportMode: draft.transportMode, distanceKm, estimatedTravelMinutes,
      ...(estimatedCostMinor === undefined ? {} : { estimatedCostMinor }),
      ...(draft.estimatedCostCurrency.trim() ? { estimatedCostCurrency: draft.estimatedCostCurrency.trim().toUpperCase() } : {}),
      ...(draft.terrain.trim() ? { terrain: draft.terrain.trim() } : {}), riskLevel: draft.riskLevel,
      openMonths: [...new Set(months)], bidirectional: draft.bidirectional, requiresRoadCheck: draft.requiresRoadCheck,
      requiresWeatherCheck: draft.requiresWeatherCheck, requiresPermitCheck: draft.requiresPermitCheck,
      requiresGuide: draft.requiresGuide, requiredGuideCompetencies: csv(draft.requiredGuideCompetencies),
      emergencyPlanRequired: draft.emergencyPlanRequired, active: draft.active, lastVerifiedAt: verified,
    };
  };

  const save = () => {
    let payload = null;
    if (editor.kind === 'route') payload = validateRoute(editor.draft);
    if (editor.kind === 'node') payload = validateNode(editor.draft);
    if (editor.kind === 'edge') payload = validateEdge(editor.draft);
    if (!payload) {
      Alert.alert(t('routeGraph.invalid'), t(`routeGraph.invalid${editor.kind[0].toUpperCase()}${editor.kind.slice(1)}`));
      return;
    }
    Alert.alert(t('routeGraph.confirmTitle'), t('routeGraph.confirmCopy'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.save'),
        onPress: async () => {
          setSaving(true);
          setActionError(null);
          try {
            let result;
            if (editor.kind === 'route') {
              result = editor.record
                ? await adminRepository.updateRouteGraph(editor.record.databaseId || editor.record.code, payload)
                : await adminRepository.createRouteGraph(payload);
            } else if (editor.kind === 'node') {
              result = editor.record
                ? await adminRepository.updateRouteNode(editor.record.databaseId, payload)
                : await adminRepository.createRouteNode(routeReference, payload);
            } else {
              result = editor.record
                ? await adminRepository.updateRouteEdge(editor.record.databaseId, payload)
                : await adminRepository.createRouteEdge(routeReference, payload);
            }
            saveResult(result);
          } catch (nextError) {
            setActionError(apiErrorMessage(nextError));
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  const deactivate = (kind, record) => {
    if (!record.databaseId && kind !== 'route') return;
    Alert.alert(t('routeGraph.deactivateTitle'), t('routeGraph.deactivateCopy'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('routeGraph.deactivate'), style: 'destructive', onPress: async () => {
          setSaving(true);
          setActionError(null);
          try {
            const result = kind === 'route'
              ? await adminRepository.updateRouteGraph(record.databaseId || record.code, { active: false })
              : kind === 'node'
                ? await adminRepository.updateRouteNode(record.databaseId, { active: false })
                : await adminRepository.updateRouteEdge(record.databaseId, { active: false });
            saveResult(result);
          } catch (nextError) {
            setActionError(apiErrorMessage(nextError));
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  const nodeIdsAvailable = useMemo(() => selected?.nodes?.every((node) => Boolean(node.databaseId)) ?? false, [selected]);

  const editorTitle = editor?.record ? t('routeGraph.editRecord') : t('routeGraph.addRecord');

  const renderRouteForm = () => {
    const draft = editor.draft;
    return (
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>{editorTitle} · {t('routeGraph.route')}</Text>
        <SourceField value={draft.sourceId} onChange={(value) => updateDraft('sourceId', value)} sources={sources} t={t} />
        <AppInput label={t('routeGraph.code')} value={draft.code} onChangeText={(value) => updateDraft('code', value.toLowerCase())} autoCapitalize="none" editable={!editor.record} />
        <AppInput label={t('routeGraph.name')} value={draft.name} onChangeText={(value) => updateDraft('name', value)} autoCapitalize="words" />
        <AppInput label={t('routeGraph.description')} value={draft.description} onChangeText={(value) => updateDraft('description', value)} multiline autoCapitalize="sentences" inputStyle={styles.longInput} />
        <View style={styles.twoColumns}>
          <AppInput label={t('routeGraph.minimumDays')} value={draft.minimumDays} onChangeText={(value) => updateDraft('minimumDays', value)} keyboardType="number-pad" style={styles.column} />
          <AppInput label={t('routeGraph.recommendedDays')} value={draft.recommendedDays} onChangeText={(value) => updateDraft('recommendedDays', value)} keyboardType="number-pad" style={styles.column} />
        </View>
        <ChoiceField label={t('routeGraph.family')} values={FAMILIES} value={draft.routeFamily} onChange={(value) => updateDraft('routeFamily', value)} />
        <ChoiceField label={t('routeGraph.risk')} values={RISKS} value={draft.riskLevel} onChange={(value) => updateDraft('riskLevel', value)} />
        <ChoiceField label={t('routeGraph.language')} values={CEFR} value={draft.minimumLanguageLevel} onChange={(value) => updateDraft('minimumLanguageLevel', value)} />
        <ChoiceField label={t('routeGraph.legalRole')} values={LEGAL_ROLES} value={draft.requiredGuideLegalRole} onChange={(value) => updateDraft('requiredGuideLegalRole', value)} />
        <AppInput label={t('routeGraph.badge')} value={draft.routeBadge} onChangeText={(value) => updateDraft('routeBadge', value.toLowerCase())} autoCapitalize="none" />
        <AppInput label={t('routeGraph.specialties')} value={draft.requiredSpecialtySkills} onChangeText={(value) => updateDraft('requiredSpecialtySkills', value)} placeholder={t('routeGraph.commaSeparated')} />
        <BooleanField label={t('routeGraph.firstAid')} value={draft.firstAidRequired} onChange={(value) => updateDraft('firstAidRequired', value)} t={t} />
        <BooleanField label={t('routeGraph.active')} value={draft.active} onChange={(value) => updateDraft('active', value)} t={t} />
      </View>
    );
  };

  const renderNodeForm = () => {
    const draft = editor.draft;
    return (
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>{editorTitle} · {t('routeGraph.node')}</Text>
        <SourceField value={draft.sourceId} onChange={(value) => updateDraft('sourceId', value)} sources={sources} t={t} />
        <AppInput label={t('routeGraph.code')} value={draft.code} onChangeText={(value) => updateDraft('code', value.toLowerCase())} autoCapitalize="none" editable={!editor.record} />
        <AppInput label={t('routeGraph.nameEn')} value={draft.nameEn} onChangeText={(value) => updateDraft('nameEn', value)} autoCapitalize="words" />
        <AppInput label={t('routeGraph.nameMn')} value={draft.nameMn} onChangeText={(value) => updateDraft('nameMn', value)} autoCapitalize="words" />
        <AppInput label={t('routeGraph.region')} value={draft.region} onChangeText={(value) => updateDraft('region', value)} autoCapitalize="words" />
        <View style={styles.twoColumns}>
          <AppInput label={t('routeGraph.latitude')} value={draft.latitude} onChangeText={(value) => updateDraft('latitude', value)} keyboardType="numbers-and-punctuation" style={styles.column} />
          <AppInput label={t('routeGraph.longitude')} value={draft.longitude} onChangeText={(value) => updateDraft('longitude', value)} keyboardType="numbers-and-punctuation" style={styles.column} />
        </View>
        <View style={styles.twoColumns}>
          <AppInput label={t('routeGraph.altitude')} value={draft.altitude} onChangeText={(value) => updateDraft('altitude', value)} keyboardType="number-pad" style={styles.column} />
          <AppInput label={t('routeGraph.sequence')} value={draft.sequenceHint} onChangeText={(value) => updateDraft('sequenceHint', value)} keyboardType="number-pad" style={styles.column} />
        </View>
        <AppInput label={t('routeGraph.visitMinutes')} value={draft.minimumVisitMinutes} onChangeText={(value) => updateDraft('minimumVisitMinutes', value)} keyboardType="number-pad" />
        <ChoiceField label={t('routeGraph.nodeType')} values={NODE_TYPES} value={draft.nodeType} onChange={(value) => updateDraft('nodeType', value)} />
        <BooleanField label={t('routeGraph.active')} value={draft.active} onChange={(value) => updateDraft('active', value)} t={t} />
      </View>
    );
  };

  const renderEdgeForm = () => {
    const draft = editor.draft;
    return (
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>{editorTitle} · {t('routeGraph.edge')}</Text>
        {!nodeIdsAvailable ? <Text style={styles.contractError} accessibilityLiveRegion="assertive">{t('routeGraph.nodeIdsMissing')}</Text> : null}
        <SourceField value={draft.sourceId} onChange={(value) => updateDraft('sourceId', value)} sources={sources} required t={t} />
        <AppInput label={t('routeGraph.code')} value={draft.code} onChangeText={(value) => updateDraft('code', value.toLowerCase())} autoCapitalize="none" editable={!editor.record} />
        <ChoiceField label={t('routeGraph.from')} values={selected.nodes.map((node) => node.code)} value={draft.from} onChange={(value) => updateDraft('from', value)} />
        <ChoiceField label={t('routeGraph.to')} values={selected.nodes.map((node) => node.code)} value={draft.to} onChange={(value) => updateDraft('to', value)} />
        <ChoiceField label={t('routeGraph.transport')} values={TRANSPORT} value={draft.transportMode} onChange={(value) => updateDraft('transportMode', value)} />
        <View style={styles.twoColumns}>
          <AppInput label={t('routeGraph.distance')} value={draft.distanceKm} onChangeText={(value) => updateDraft('distanceKm', value)} keyboardType="decimal-pad" style={styles.column} />
          <AppInput label={t('routeGraph.travelMinutes')} value={draft.estimatedTravelMinutes} onChangeText={(value) => updateDraft('estimatedTravelMinutes', value)} keyboardType="number-pad" style={styles.column} />
        </View>
        <View style={styles.twoColumns}>
          <AppInput label={t('routeGraph.costMinor')} value={draft.estimatedCostMinor} onChangeText={(value) => updateDraft('estimatedCostMinor', value)} keyboardType="number-pad" style={styles.column} />
          <AppInput label={t('routeGraph.currency')} value={draft.estimatedCostCurrency} onChangeText={(value) => updateDraft('estimatedCostCurrency', value.toUpperCase())} maxLength={3} style={styles.column} />
        </View>
        <AppInput label={t('routeGraph.terrain')} value={draft.terrain} onChangeText={(value) => updateDraft('terrain', value)} autoCapitalize="sentences" />
        <ChoiceField label={t('routeGraph.risk')} values={RISKS} value={draft.riskLevel} onChange={(value) => updateDraft('riskLevel', value)} />
        <AppInput label={t('routeGraph.openMonths')} value={draft.openMonths} onChangeText={(value) => updateDraft('openMonths', value)} keyboardType="numbers-and-punctuation" placeholder="1, 2, 3" />
        <AppInput label={t('routeGraph.lastVerified')} value={draft.lastVerifiedAt} onChangeText={(value) => updateDraft('lastVerifiedAt', value)} keyboardType="numbers-and-punctuation" placeholder="YYYY-MM-DD" />
        <AppInput label={t('routeGraph.competencies')} value={draft.requiredGuideCompetencies} onChangeText={(value) => updateDraft('requiredGuideCompetencies', value)} placeholder={t('routeGraph.commaSeparated')} />
        {[
          ['bidirectional', 'routeGraph.bidirectional'], ['requiresRoadCheck', 'routeGraph.requiresRoadCheck'],
          ['requiresWeatherCheck', 'routeGraph.requiresWeatherCheck'], ['requiresPermitCheck', 'routeGraph.requiresPermitCheck'],
          ['requiresGuide', 'routeGraph.requiresGuide'], ['emergencyPlanRequired', 'routeGraph.emergencyPlanRequired'],
          ['active', 'routeGraph.active'],
        ].map(([key, label]) => <BooleanField key={key} label={t(label)} value={draft[key]} onChange={(value) => updateDraft(key, value)} t={t} />)}
      </View>
    );
  };

  const renderEditor = () => (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {editor.kind === 'route' ? renderRouteForm() : editor.kind === 'node' ? renderNodeForm() : renderEdgeForm()}
        {actionError ? <Text style={styles.error} accessibilityLiveRegion="assertive">{actionError}</Text> : null}
        <View style={styles.actions}>
          <AppButton title={t('common.cancel')} variant="secondary" onPress={() => setEditor(null)} disabled={saving} style={styles.action} />
          <AppButton title={t('common.save')} onPress={save} loading={saving} disabled={editor.kind === 'edge' && !nodeIdsAvailable} style={styles.action} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderDetail = () => (
    <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.brand} />}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.rowCopy}>
            <Text style={styles.eyebrow}>{selected.routeFamily} · {selected.riskLevel}</Text>
            <Text style={styles.heroTitle}>{selected.name}</Text>
          </View>
          <View style={[styles.status, !selected.active && styles.statusInactive]}><Text style={styles.statusText}>{selected.active ? t('routeGraph.active') : t('routeGraph.inactive')}</Text></View>
        </View>
        <Text style={styles.heroDescription}>{selected.description}</Text>
        <Text style={styles.heroMeta}>{selected.minimumDays}–{selected.recommendedDays} {t('routeGraph.days')} · {selected.minimumLanguageLevel} · {selected.requiredGuideLegalRole}</Text>
        <Text style={styles.heroMeta}>{t('routeGraph.updated')} {formatDateTime(selected.updatedAt, language) || '—'}</Text>
      </View>
      {actionError ? <Text style={styles.error} accessibilityLiveRegion="assertive">{actionError}</Text> : null}
      <View style={styles.actions}>
        <AppButton title={t('routeGraph.editRoute')} variant="secondary" onPress={() => { setActionError(null); setEditor({ kind: 'route', record: selected, draft: routeDraft(selected) }); }} disabled={saving} style={styles.action} />
        {selected.active ? <AppButton title={t('routeGraph.deactivate')} variant="ghost" onPress={() => deactivate('route', selected)} disabled={saving} style={styles.action} /> : null}
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.rowCopy}><Text style={styles.sectionTitle}>{t('routeGraph.nodes')}</Text><Text style={styles.help}>{selected.nodes.length} {t('routeGraph.records')}</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel={t('routeGraph.addNode')} onPress={() => { setActionError(null); setEditor({ kind: 'node', record: null, draft: blankNode() }); }} style={styles.addButton}><Ionicons name="add" size={21} color={colors.white} /></Pressable>
      </View>
      {selected.nodes.map((node) => (
        <View key={node.databaseId || node.code} style={styles.recordCard}>
          <View style={styles.rowCopy}>
            <Text style={styles.recordTitle}>{node.nameEn} / {node.nameMn}</Text>
            <Text style={styles.help}>{node.code} · {node.nodeType} · {node.region}</Text>
            <Text style={styles.help}>{node.latitude.toFixed(4)}, {node.longitude.toFixed(4)}</Text>
          </View>
          <View style={styles.recordActions}>
            <AppButton title={t('common.edit')} variant="secondary" onPress={() => setEditor({ kind: 'node', record: node, draft: nodeDraft(node) })} disabled={!node.databaseId || saving} style={styles.smallAction} />
            {node.active ? <AppButton title={t('routeGraph.deactivate')} variant="ghost" onPress={() => deactivate('node', node)} disabled={!node.databaseId || saving} style={styles.smallAction} /> : null}
          </View>
        </View>
      ))}

      <View style={styles.sectionHeader}>
        <View style={styles.rowCopy}><Text style={styles.sectionTitle}>{t('routeGraph.edges')}</Text><Text style={styles.help}>{selected.edges.length} {t('routeGraph.records')}</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel={t('routeGraph.addEdge')} accessibilityState={{ disabled: selected.nodes.length < 2 || !nodeIdsAvailable }} disabled={selected.nodes.length < 2 || !nodeIdsAvailable} onPress={() => { setActionError(null); setEditor({ kind: 'edge', record: null, draft: blankEdge(selected) }); }} style={[styles.addButton, (selected.nodes.length < 2 || !nodeIdsAvailable) && styles.addDisabled]}><Ionicons name="add" size={21} color={colors.white} /></Pressable>
      </View>
      {!nodeIdsAvailable && selected.nodes.length ? <Text style={styles.contractError}>{t('routeGraph.nodeIdsMissing')}</Text> : null}
      {selected.edges.map((edge) => (
        <View key={edge.databaseId || edge.code} style={styles.recordCard}>
          <View style={styles.rowCopy}>
            <Text style={styles.recordTitle}>{edge.from} → {edge.to}</Text>
            <Text style={styles.help}>{edge.code} · {edge.transportMode} · {edge.distanceKm} km · {edge.estimatedTravelMinutes} min</Text>
            <Text style={styles.help}>{edge.riskLevel} · {t('routeGraph.months')} {edge.openMonths.join(', ') || '—'}</Text>
          </View>
          <View style={styles.recordActions}>
            <AppButton title={t('common.edit')} variant="secondary" onPress={() => setEditor({ kind: 'edge', record: edge, draft: edgeDraft(edge) })} disabled={!edge.databaseId || saving} style={styles.smallAction} />
            {edge.active ? <AppButton title={t('routeGraph.deactivate')} variant="ghost" onPress={() => deactivate('edge', edge)} disabled={!edge.databaseId || saving} style={styles.smallAction} /> : null}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderList = () => (
    <StateBox loading={loading}>
      {error ? <ErrorPanel error={error} onRetry={() => load()} t={t} /> : (
        <ScrollView contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.brand} />}>
          <View style={styles.notice}>
            <Ionicons name="git-network-outline" size={24} color={colors.brand} />
            <View style={styles.rowCopy}><Text style={styles.recordTitle}>{t('routeGraph.databaseOwned')}</Text><Text style={styles.help}>{t('routeGraph.databaseOwnedCopy')}</Text></View>
          </View>
          <AppButton title={t('routeGraph.createRoute')} onPress={() => { setActionError(null); setEditor({ kind: 'route', record: null, draft: blankRoute() }); }} />
          {!routes.length ? <View style={styles.empty}><Text style={styles.centerTitle}>{t('routeGraph.empty')}</Text><Text style={styles.centerCopy}>{t('routeGraph.emptyCopy')}</Text></View> : null}
          {routes.map((route) => (
            <Pressable key={route.databaseId || route.code} accessibilityRole="button" accessibilityLabel={`${route.name}, ${route.riskLevel}`} accessibilityHint={t('routeGraph.openHint')} onPress={() => { setSelected(route); setActionError(null); }} style={({ pressed }) => [styles.routeCard, pressed && styles.pressed]}>
              <View style={styles.riskCircle}><Text style={styles.riskText}>{route.riskLevel}</Text></View>
              <View style={styles.rowCopy}>
                <Text style={styles.routeTitle}>{route.name}</Text>
                <Text style={styles.help}>{route.routeFamily} · {route.minimumDays}–{route.recommendedDays} {t('routeGraph.days')}</Text>
                <Text style={styles.help}>{route.nodes.length} {t('routeGraph.nodes').toLowerCase()} · {route.edges.length} {t('routeGraph.edges').toLowerCase()} · {route.active ? t('routeGraph.active') : t('routeGraph.inactive')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={19} color={colors.inkSoft} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </StateBox>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('routeGraph.title')} onBack={editor ? () => { if (!saving) setEditor(null); } : selected ? () => setSelected(null) : () => navigation.goBack()} />
      <AdminAccessBoundary>
        {editor ? renderEditor() : selected ? renderDetail() : renderList()}
      </AdminAccessBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  flex: { flex: 1 },
  content: { width: '100%', maxWidth: 960, alignSelf: 'center', padding: spacing.lg, paddingBottom: 64, gap: spacing.md },
  list: { width: '100%', maxWidth: 960, alignSelf: 'center', padding: spacing.lg, paddingBottom: 64, gap: 10 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: '#FECDD3', backgroundColor: '#FFF1F2' },
  rowCopy: { flex: 1 },
  help: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 3 },
  routeCard: { minHeight: 94, flexDirection: 'row', alignItems: 'center', gap: 11, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  riskCircle: { width: 45, height: 45, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F2' },
  riskText: { color: colors.brand, fontWeight: '900' },
  routeTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.72 },
  empty: { alignItems: 'center', padding: 32, borderRadius: radius.lg, backgroundColor: colors.white },
  hero: { padding: 17, gap: 7, borderRadius: radius.xl, backgroundColor: colors.ink },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  eyebrow: { color: '#FDA4AF', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  heroTitle: { color: colors.white, fontSize: 22, fontWeight: '800', marginTop: 4 },
  heroDescription: { color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
  heroMeta: { color: 'rgba(255,255,255,0.62)', fontSize: 12, lineHeight: 18 },
  status: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: '#A7F3D0' },
  statusInactive: { backgroundColor: '#FECACA' },
  statusText: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  action: { flex: 1, minWidth: 150 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  addButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: colors.brand },
  addDisabled: { opacity: 0.45 },
  recordCard: { padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  recordTitle: { color: colors.ink, fontWeight: '800' },
  recordActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  smallAction: { flex: 1, minWidth: 120, height: 44 },
  formCard: { padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  formTitle: { color: colors.ink, fontSize: 20, fontWeight: '800', marginBottom: 16 },
  field: { marginBottom: spacing.lg },
  label: { color: colors.ink, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  chips: { paddingVertical: 3, paddingRight: 8 },
  booleanRow: { flexDirection: 'row' },
  compactInput: { marginTop: 8, marginBottom: 0 },
  longInput: { minHeight: 130 },
  twoColumns: { flexDirection: 'row', gap: 10 },
  column: { flex: 1 },
  error: { color: '#B42318', fontSize: 12, lineHeight: 18, padding: 12, borderRadius: radius.md, backgroundColor: '#FEF2F2' },
  contractError: { color: '#B42318', fontSize: 12, lineHeight: 18, padding: 11, borderRadius: radius.md, backgroundColor: '#FEF2F2', marginBottom: 12 },
  center: { flex: 1, minHeight: 320, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 },
  centerTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  centerCopy: { color: colors.inkSoft, lineHeight: 20, textAlign: 'center', maxWidth: 480 },
  retry: { minWidth: 180, marginTop: 5 },
});
