import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, ScreenHeader } from '../components/ui';
import { guidesRepository } from '../repositories/guidesRepository';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';

function commaList(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function languageMap(value) {
  return Object.fromEntries(
    commaList(value).map((item) => {
      const [language, proficiency = 'Conversational'] = item.split(':');
      return [language.trim(), proficiency.trim()];
    }),
  );
}

export default function GuideRegistrationScreen({ navigation }) {
  const { session } = useAuth();
  const [city, setCity] = useState('Ulaanbaatar');
  const [country, setCountry] = useState('Mongolia');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('0');
  const [price, setPrice] = useState('');
  const [languages, setLanguages] = useState('Mongolian:Native');
  const [expertise, setExpertise] = useState('');
  const [availability, setAvailability] = useState('');
  const [referenceContact, setReferenceContact] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!session) {
      navigation.navigate('Auth', { mode: 'login' });
      return;
    }
    const expertiseList = commaList(expertise);
    const availabilityList = commaList(availability);
    const parsedLanguages = languageMap(languages);
    if (
      bio.trim().length < 40 ||
      expertiseList.length < 2 ||
      !availabilityList.length ||
      !Object.keys(parsedLanguages).length ||
      referenceContact.trim().length < 6 ||
      !accepted
    ) {
      Alert.alert(
        'Complete your application',
        'Add a 40-character bio, at least two expertise areas, languages, availability, a reference, and accept the code of conduct.',
      );
      return;
    }

    setLoading(true);
    try {
      await guidesRepository.apply({
        country: country.trim(),
        city: city.trim(),
        bio: bio.trim(),
        experienceYears: Number(experience) || 0,
        languages: parsedLanguages,
        expertise: expertiseList,
        availability: availabilityList,
        price: price.trim() || null,
        referenceContact: referenceContact.trim(),
        codeOfConductAccepted: true,
      });
      Alert.alert(
        'Application submitted',
        'Your profile is pending identity and quality review. It is not public yet.',
      );
      navigation.navigate('GuideDashboard');
    } catch (e) {
      Alert.alert('Application failed', apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Become a guide" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sub}>
          Applications are manually reviewed before a verified badge is issued.
        </Text>
        <AppInput label="Country" value={country} onChangeText={setCountry} />
        <AppInput label="City" value={city} onChangeText={setCity} />
        <AppInput
          label="Bio (minimum 40 characters)"
          value={bio}
          onChangeText={setBio}
          placeholder="Describe your local knowledge and guiding experience"
          autoCapitalize="sentences"
          multiline
        />
        <AppInput
          label="Years of experience"
          value={experience}
          onChangeText={setExperience}
          keyboardType="number-pad"
        />
        <AppInput
          label="Languages and level"
          value={languages}
          onChangeText={setLanguages}
          placeholder="Mongolian:Native, English:Fluent"
          autoCapitalize="words"
        />
        <Text style={styles.hint}>Use Language:Level, separated by commas.</Text>
        <AppInput
          label="Expertise"
          value={expertise}
          onChangeText={setExpertise}
          placeholder="Horse riding, History, City walks"
          autoCapitalize="words"
        />
        <AppInput
          label="Availability"
          value={availability}
          onChangeText={setAvailability}
          placeholder="Mon morning, Wed afternoon, Sat"
          autoCapitalize="sentences"
        />
        <AppInput
          label="Hourly rate (USD)"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          placeholder="50"
        />
        <AppInput
          label="Reference contact"
          value={referenceContact}
          onChangeText={setReferenceContact}
          placeholder="Name, phone or email"
        />
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
          onPress={() => setAccepted((value) => !value)}
          style={styles.conduct}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxActive]}>
            <Text style={styles.check}>{accepted ? '✓' : ''}</Text>
          </View>
          <Text style={styles.conductText}>
            I accept the guide code of conduct and confirm this information is accurate.
          </Text>
        </Pressable>
        <AppButton title="Submit for review" onPress={submit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg, paddingBottom: 40 },
  sub: { color: colors.inkSoft, marginBottom: 18, fontSize: 14, lineHeight: 20 },
  hint: { color: colors.inkSoft, fontSize: 12, marginTop: -12, marginBottom: 18 },
  conduct: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 20,
    minHeight: 48,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  check: { color: colors.white, fontWeight: '800' },
  conductText: { flex: 1, color: colors.ink, lineHeight: 20 },
});
