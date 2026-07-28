import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { colors, radius, spacing } from '../theme';
import { useT } from '../localization';

export function BrandMark({ dark = false }) {
  return (
    <View style={styles.brandRow}>
      <View
        style={[
          styles.brandDot,
          { backgroundColor: dark ? colors.introAccent : colors.brand },
        ]}
      />
      <Text style={[styles.brandText, dark && { color: colors.white }]}>
        VenTour
      </Text>
    </View>
  );
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  accessibilityLabel,
  accessibilityHint,
}) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: Boolean(disabled || loading), busy: Boolean(loading) }}
      style={({ pressed }) => [
        styles.btn,
        isPrimary && styles.btnPrimary,
        variant === 'secondary' && styles.btnSecondary,
        isGhost && styles.btnGhost,
        (disabled || loading) && { opacity: 0.55 },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : colors.ink} />
      ) : (
        <Text
          style={[
            styles.btnText,
            isPrimary && { color: '#fff' },
            isGhost && { color: colors.ink },
            variant === 'secondary' && { color: colors.ink },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function AppInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  placeholder,
  autoCapitalize = 'none',
  keyboardType,
  style,
  inputStyle,
  ...rest
}) {
  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={colors.inkSoft}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        accessibilityLabel={label || placeholder}
        style={[styles.input, rest.multiline && styles.inputMultiline, inputStyle]}
        {...rest}
      />
    </View>
  );
}

export function Chip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ListingCard({ item, onPress }) {
  const image = item.images?.[0];
  return (
    <Pressable
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.location}, ${item.price} dollars per ${item.priceUnit}`}
    >
      <Image
        source={image}
        style={styles.cardImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.rating}>★ {item.rating?.toFixed?.(2) ?? item.rating}</Text>
        </View>
        <Text style={styles.muted} numberOfLines={1}>
          {item.location}
        </Text>
        <Text style={styles.price}>
          ${item.price}{' '}
          <Text style={styles.muted}>/ {item.priceUnit}</Text>
        </Text>
      </View>
    </Pressable>
  );
}

export function GuideCard({ item, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.guideCard}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.location}, rating ${item.rating}, ${item.price} dollars per hour`}
    >
      <Image
        source={item.photo || undefined}
        style={styles.guidePhoto}
        contentFit="cover"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.muted}>{item.location}</Text>
        <Text style={styles.muted}>
          ★ {item.rating} · {item.reviews} reviews · ${item.price}/hr
        </Text>
      </View>
    </Pressable>
  );
}

export function StateBox({ loading, error, empty, emptyText, children }) {
  if (loading) {
    return (
      <View style={styles.stateBox} accessibilityLiveRegion="polite">
        <ActivityIndicator color={colors.brand} size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.stateBox} accessibilityLiveRegion="assertive">
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  if (empty) {
    return (
      <View style={styles.stateBox} accessibilityLiveRegion="polite">
        <Text style={styles.muted}>{emptyText || 'Nothing here yet.'}</Text>
      </View>
    );
  }
  return children;
}

export function ScreenHeader({ title, onBack, right }) {
  const { t } = useT();
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      ) : (
        <View style={{ width: 36 }} />
      )}
      <Text style={styles.headerTitle} accessibilityRole="header">{title}</Text>
      <View style={{ minWidth: 36, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandDot: { width: 12, height: 12, borderRadius: 6 },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.3,
  },
  btn: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  btnPrimary: { backgroundColor: colors.brand },
  btnSecondary: { backgroundColor: colors.secondary },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnText: { fontSize: 16, fontWeight: '600' },
  field: { marginBottom: spacing.lg },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: 6,
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.secondary,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.ink,
  },
  inputMultiline: { minHeight: 96, paddingTop: 14, textAlignVertical: 'top' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.secondary,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.ink },
  chipText: { color: colors.ink, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: colors.white },
  card: {
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.secondary,
  },
  cardBody: { paddingTop: 10, paddingBottom: 4 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
  },
  rating: { fontSize: 14, fontWeight: '600', color: colors.ink },
  muted: { color: colors.inkSoft, fontSize: 13, marginTop: 2 },
  price: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  guideCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.secondary,
    marginBottom: 12,
    alignItems: 'center',
  },
  guidePhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.border,
  },
  stateBox: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: { color: colors.brand, textAlign: 'center', paddingHorizontal: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 48,
  },
  backBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 32, lineHeight: 34, color: colors.ink, marginTop: -2 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: colors.ink },
});
