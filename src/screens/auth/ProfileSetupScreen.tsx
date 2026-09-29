import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type, radius } from '../../theme';
import { authPhoto } from '../../theme/images';
import { Button, Input, Chip } from '../../components';
import { districts } from '../../data/districts';
import { useAuthStore } from '../../store/useAuthStore';

const HERO_HEIGHT = 160;

export function ProfileSetupScreen() {
  const mobile = useAuthStore((s) => s.mobile);
  const saveProfile = useAuthStore((s) => s.saveProfile);

  const [name, setName] = useState('');
  const [sameAsWhatsapp, setSameAsWhatsapp] = useState(true);
  const [whatsapp, setWhatsapp] = useState(mobile);
  const [district, setDistrict] = useState('Salem');
  const [location, setLocation] = useState('');
  const [nameError, setNameError] = useState('');

  const handleSave = () => {
    if (name.trim().length < 2) {
      setNameError('Please enter your name');
      return;
    }
    saveProfile({
      name: name.trim(),
      mobile,
      whatsapp: sameAsWhatsapp ? mobile : whatsapp,
      district,
      location: location.trim(),
    });
  };

  return (
    <View style={styles.root}>
      <Image source={{ uri: authPhoto(1000, 500) }} style={styles.hero} />
      <ScrollView style={styles.sheet} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.iconCircle}>
          <Ionicons name="person-circle" size={28} color={colors.primary} />
        </View>
        <Text style={[type.h1, { color: colors.ink, marginTop: spacing.xl }]}>Complete Your Profile</Text>
        <Text style={[type.body, { color: colors.muted, marginTop: 6 }]}>
          Just the essentials — providers use this to reach you about your event.
        </Text>

        <Input
          label="Full Name"
          icon="person-outline"
          value={name}
          onChangeText={(v) => {
            setName(v);
            setNameError('');
          }}
          placeholder="e.g. Kavitha Ramesh"
          error={nameError}
          containerStyle={{ marginTop: spacing.xxl }}
        />

        <Input label="Mobile Number" icon="call-outline" value={`+91 ${mobile}`} editable={false} />

        <Pressable style={styles.checkboxRow} onPress={() => setSameAsWhatsapp((v) => !v)}>
          <Ionicons
            name={sameAsWhatsapp ? 'checkbox' : 'square-outline'}
            size={20}
            color={sameAsWhatsapp ? colors.primary : colors.muted}
          />
          <Text style={[type.bodyMedium, { color: colors.ink, marginLeft: 8 }]}>
            WhatsApp number is same as mobile number
          </Text>
        </Pressable>

        {!sameAsWhatsapp && (
          <Input
            label="WhatsApp Number"
            icon="logo-whatsapp"
            keyboardType="number-pad"
            maxLength={10}
            value={whatsapp}
            onChangeText={(v) => setWhatsapp(v.replace(/\D/g, ''))}
            placeholder="98765 43210"
          />
        )}

        <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>District</Text>
        <View style={styles.chipWrap}>
          {districts.map((d) => (
            <Chip key={d.id} label={d.name} selected={district === d.name} onPress={() => setDistrict(d.name)} style={{ marginRight: 8, marginBottom: 8 }} />
          ))}
        </View>

        <Input
          label="Area / Locality (optional)"
          icon="location-outline"
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Fairlands"
          containerStyle={{ marginTop: spacing.md }}
        />

        <Button label="Save & Continue" fullWidth size="lg" onPress={handleSave} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: { position: 'absolute', top: 0, left: 0, right: 0, height: HERO_HEIGHT, backgroundColor: colors.divider },
  sheet: {
    flex: 1,
    marginTop: HERO_HEIGHT - radius.xxl,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.huge },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: -6, marginBottom: spacing.lg },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
});
