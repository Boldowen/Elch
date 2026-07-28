import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ui';
import { colors, spacing } from '../theme';

const FAQ = [
  {
    q: 'How do I book a stay?',
    a: 'Open Explore, pick a listing, and tap Book. You need an account.',
  },
  {
    q: 'How do I become a guide?',
    a: 'From Profile, open Become a guide and submit the application. The profile stays private until an administrator completes the manual review.',
  },
  {
    q: 'How do payments work?',
    a: 'During the pilot, payment is made on arrival after the provider accepts the booking. VenTour does not collect card details in the app or chat.',
  },
  {
    q: 'What does verified mean?',
    a: 'Verified means VenTour staff approved the guide application after a manual identity and quality review. It is not a guarantee that travel is risk-free.',
  },
  {
    q: 'What should I do in an emergency?',
    a: 'Open Safety and emergency from Profile. Mongolia emergency numbers are 101 for fire, 102 for police, and 103 for ambulance.',
  },
];

export default function HelpCenterScreen({ navigation }) {
  const [open, setOpen] = useState(0);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Help center" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        {FAQ.map((item, i) => (
          <View key={item.q} style={styles.item}>
            <Pressable
              onPress={() => setOpen(open === i ? -1 : i)}
              accessibilityRole="button"
              accessibilityState={{ expanded: open === i }}
            >
              <Text style={styles.q}>{item.q}</Text>
            </Pressable>
            {open === i ? <Text style={styles.a}>{item.a}</Text> : null}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 14,
  },
  q: { fontWeight: '700', color: colors.ink, fontSize: 15 },
  a: { marginTop: 8, color: colors.inkSoft, lineHeight: 20 },
});
