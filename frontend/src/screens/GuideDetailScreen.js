import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, ScreenHeader, StateBox } from '../components/ui';
import { guidesRepository } from '../repositories/guidesRepository';
import { conversationsRepository } from '../repositories/conversationsRepository';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';

export default function GuideDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const { session } = useAuth();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setGuide(await guidesRepository.one(id));
      } catch (e) {
        setError(apiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const chat = async () => {
    if (!session) {
      navigation.navigate('Auth', { mode: 'login' });
      return;
    }
    try {
      const userId = guide.userId || guide.id;
      const convId = await conversationsRepository.direct(userId);
      navigation.navigate('Chat', { id: convId, title: guide.name, peerId: userId });
    } catch (e) {
      Alert.alert('Error', apiErrorMessage(e));
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Guide" onBack={() => navigation.goBack()} />
      <StateBox loading={loading} error={error} empty={!guide}>
        {guide ? (
          <ScrollView contentContainerStyle={styles.body}>
            <Image source={guide.photo || undefined} style={styles.photo} />
            <Text style={styles.name}>{guide.name}</Text>
            <Text style={styles.meta}>
              {guide.location} · ★ {guide.rating} ({guide.reviews})
            </Text>
            <Text style={styles.meta}>
              {guide.experience} years · ${guide.price}/hr
              {guide.verified ? ' · Verified' : ''}
            </Text>
            <Text style={styles.section}>About</Text>
            <Text style={styles.bio}>{guide.bio || 'Local expert guide.'}</Text>
            <Text style={styles.section}>Languages</Text>
            <Text style={styles.bio}>{guide.languages.join(', ') || '—'}</Text>
            <Text style={styles.section}>Specialties</Text>
            <Text style={styles.bio}>
              {guide.specialties.join(', ') || '—'}
            </Text>
            <AppButton
              title="Request this guide"
              onPress={() => {
                if (!session) {
                  navigation.navigate('Auth', { mode: 'login' });
                  return;
                }
                navigation.navigate('Booking', {
                  kind: 'guide',
                  id: guide.userId || guide.id,
                  title: guide.name,
                  price: guide.price,
                  unit: 'hour',
                });
              }}
              style={{ marginTop: 24 }}
            />
            <AppButton
              title="Message guide"
              variant="secondary"
              onPress={chat}
              style={{ marginTop: 10 }}
            />
          </ScrollView>
        ) : null}
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg, paddingBottom: 40 },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    backgroundColor: colors.secondary,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.ink,
  },
  meta: {
    textAlign: 'center',
    color: colors.inkSoft,
    marginTop: 4,
    fontSize: 14,
  },
  section: {
    marginTop: 22,
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  bio: { marginTop: 8, fontSize: 15, lineHeight: 22, color: colors.ink },
});
