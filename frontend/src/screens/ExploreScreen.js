import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categoryBlocks } from '../data/images';
import { useHideTabBarOnScroll } from '../navigation/useHideTabBarOnScroll';
import { colors, radius, spacing } from '../theme';
import { useT } from '../localization';

function CategoryBlock({ category, onPress }) {
  const arrowOnRight = category.side === 'right';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${category.title}. ${category.subtitle}`}
      style={({ pressed }) => [
        styles.categoryBlock,
        arrowOnRight ? styles.roundRight : styles.roundLeft,
        pressed && styles.categoryPressed,
      ]}
    >
      <Image source={category.image} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={styles.categoryShade} />
      <View
        style={[
          styles.categoryCopy,
          arrowOnRight ? styles.copyArrowRight : styles.copyArrowLeft,
        ]}
      >
        <View style={styles.tagRow}>
          {category.chips.map((chip) => (
            <View key={chip} style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{chip}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.categoryTitle}>{category.title}</Text>
        <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
        <Text style={styles.categoryCount}>{category.count}</Text>
      </View>
      <View
        style={[
          styles.categoryArrow,
          arrowOnRight ? styles.arrowRight : styles.arrowLeft,
        ]}
      >
        <Ionicons
          name={arrowOnRight ? 'arrow-forward' : 'arrow-back'}
          size={22}
          color={colors.white}
        />
      </View>
    </Pressable>
  );
}

export default function ExploreScreen({ navigation }) {
  const { t } = useT();
  const onScroll = useHideTabBarOnScroll();
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('nav.explore')}</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={19} color={colors.inkSoft} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search places, camps, guides..."
            placeholderTextColor={colors.inkSoft}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.categoryList}>
          {categoryBlocks.map((category) => (
            <CategoryBlock
              key={category.key}
              category={category}
              onPress={() =>
                category.key === 'guides'
                  ? navigation.navigate('Guides')
                  : navigation.navigate('CategoryListing', { key: category.key })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  title: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: '600',
    color: colors.ink,
    letterSpacing: -0.48,
  },
  searchBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: { flex: 1, height: '100%', fontSize: 14, color: colors.ink },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 116,
  },
  categoryList: { gap: spacing.lg },
  categoryBlock: {
    height: 144,
    overflow: 'hidden',
    backgroundColor: colors.ink,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  roundRight: {
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderTopRightRadius: 72,
    borderBottomRightRadius: 72,
  },
  roundLeft: {
    borderTopLeftRadius: 72,
    borderBottomLeftRadius: 72,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  categoryPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  categoryShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  categoryCopy: { flex: 1, justifyContent: 'flex-end', paddingVertical: 18 },
  copyArrowRight: { paddingLeft: 20, paddingRight: 86 },
  copyArrowLeft: { paddingLeft: 86, paddingRight: 20 },
  tagRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  categoryTag: {
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  categoryTagText: { color: colors.white, fontSize: 11 },
  categoryTitle: { color: colors.white, fontSize: 22, fontWeight: '600' },
  categorySubtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    marginTop: 1,
  },
  categoryCount: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 12,
    marginTop: 2,
  },
  categoryArrow: {
    position: 'absolute',
    top: 48,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  arrowRight: { right: 20 },
  arrowLeft: { left: 20 },
});
