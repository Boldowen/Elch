import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ui';
import { colors, spacing } from '../theme';

export default function SavedTripsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Saved trips" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <Text style={styles.text}>
          Saved stays and wishlists will appear here. Heart listings from Explore
          to collect them.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.xl },
  text: { color: colors.inkSoft, lineHeight: 22, fontSize: 15 },
});
