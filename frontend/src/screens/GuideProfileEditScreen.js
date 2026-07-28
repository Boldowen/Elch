import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, ScreenHeader } from '../components/ui';
import { guidesRepository } from '../repositories/guidesRepository';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';

function languageText(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === 'string'
          ? item
          : `${item.name || ''}:${item.proficiency || 'Conversational'}`,
      )
      .join(', ');
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).map(([name, level]) => `${name}:${level}`).join(', ');
  }
  return '';
}

function list(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export default function GuideProfileEditScreen({ navigation }) {
  const { session, updateName } = useAuth();
  const [name, setName] = useState(session?.user?.name || '');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Mongolia');
  const [bio, setBio] = useState('');
  const [price, setPrice] = useState('');
  const [languages, setLanguages] = useState('');
  const [expertise, setExpertise] = useState('');
  const [availability, setAvailability] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await guidesRepository.mine();
        setCity(me.city || '');
        setCountry(me.country || 'Mongolia');
        setBio(me.bio || '');
        setPrice(me.price != null ? String(me.price) : '');
        setLanguages(languageText(me.languages));
        setExpertise((me.expertise || []).join(', '));
        setAvailability((me.availability || []).join(', '));
      } catch {
        // The dashboard handles missing applications.
      }
    })();
  }, []);

  const save = async () => {
    const expertiseList = list(expertise);
    const availabilityList = list(availability);
    const languageEntries = list(languages).map((item) => {
      const [language, level = 'Conversational'] = item.split(':');
      return [language.trim(), level.trim()];
    });
    if (bio.trim().length < 40 || expertiseList.length < 2 || !languageEntries.length) {
      Alert.alert(
        'Complete your profile',
        'Add a 40-character bio, one language, and at least two expertise areas.',
      );
      return;
    }
    setLoading(true);
    try {
      await guidesRepository.updateProfile({
        country: country.trim(),
        city: city.trim(),
        bio: bio.trim(),
        languages: Object.fromEntries(languageEntries),
        expertise: expertiseList,
        availability: availabilityList,
        pricingType: price.trim() ? 'HOURLY' : 'NONE',
        price: price.trim() || undefined,
      });
      if (name.trim() && name.trim() !== session?.user?.name) {
        await updateName(name.trim());
      }
      Alert.alert('Saved', 'Your guide profile was updated.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Could not save', apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Edit guide profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <AppInput label="Display name" value={name} onChangeText={setName} autoCapitalize="words" />
        <AppInput label="Country" value={country} onChangeText={setCountry} />
        <AppInput label="City" value={city} onChangeText={setCity} />
        <AppInput label="Bio" value={bio} onChangeText={setBio} autoCapitalize="sentences" multiline />
        <AppInput
          label="Languages"
          value={languages}
          onChangeText={setLanguages}
          placeholder="Mongolian:Native, English:Fluent"
        />
        <AppInput label="Expertise" value={expertise} onChangeText={setExpertise} />
        <AppInput label="Availability" value={availability} onChangeText={setAvailability} />
        <AppInput
          label="Hourly price (USD)"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />
        <AppButton title="Save" onPress={save} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg, paddingBottom: 40 },
});
