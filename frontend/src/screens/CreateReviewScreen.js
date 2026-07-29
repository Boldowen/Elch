import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, ScreenHeader } from '../components/ui';
import { reviewsRepository } from '../repositories/reviewsRepository';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';

export default function CreateReviewScreen({ navigation, route }) {
  const { bookingId, title } = route.params;
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (text.trim().length < 10) { Alert.alert('Add more detail', 'Review text must contain at least 10 characters.'); return; }
    setLoading(true);
    try {
      await reviewsRepository.create(bookingId, rating, text.trim());
      Alert.alert('Review submitted', 'Your verified review is now public.');
      navigation.goBack();
    } catch (error) { Alert.alert('Could not submit review', apiErrorMessage(error)); }
    finally { setLoading(false); }
  };
  return (
    <SafeAreaView style={styles.root}>
      <ScreenHeader title="Write a review" onBack={() => navigation.goBack()} />
      <Text style={styles.title}>{title || 'Completed booking'}</Text>
      <View style={styles.stars}>{[1, 2, 3, 4, 5].map((value) => <Pressable key={value} onPress={() => setRating(value)}><Text style={styles.star}>{value <= rating ? '★' : '☆'}</Text></Pressable>)}</View>
      <AppInput label="Your experience" value={text} onChangeText={setText} multiline style={styles.input} />
      <AppButton title="Submit verified review" onPress={submit} loading={loading} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white, padding: spacing.lg }, title: { color: colors.ink, fontSize: 18, fontWeight: '700', marginBottom: 14 },
  stars: { flexDirection: 'row', gap: 10, marginBottom: 20 }, star: { color: '#E2A100', fontSize: 34 }, input: { minHeight: 130 },
});
