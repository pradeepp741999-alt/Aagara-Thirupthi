import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type } from '../../theme';
import { ScreenHeader, Input, Chip, Button } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/useAuthStore';
import { districts } from '../../data/districts';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const saveProfile = useAuthStore((s) => s.saveProfile);

  const [name, setName] = useState(profile.name);
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp);
  const [altMobile, setAltMobile] = useState(profile.altMobile ?? '');
  const [district, setDistrict] = useState(profile.district);
  const [location, setLocation] = useState(profile.location);

  const handleSave = () => {
    saveProfile({ name, whatsapp, altMobile, district, location });
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.huge }} keyboardShouldPersistTaps="handled">
        <Input label="Full Name" icon="person-outline" value={name} onChangeText={setName} />
        <Input label="Mobile Number" icon="call-outline" value={`+91 ${profile.mobile}`} editable={false} />
        <Input label="WhatsApp Number" icon="logo-whatsapp" keyboardType="number-pad" maxLength={10} value={whatsapp} onChangeText={(v) => setWhatsapp(v.replace(/\D/g, ''))} />
        <Input label="Secondary Mobile (optional)" icon="call-outline" keyboardType="number-pad" maxLength={10} value={altMobile} onChangeText={(v) => setAltMobile(v.replace(/\D/g, ''))} />

        <Text style={[type.bodyMedium, { color: colors.ink, marginBottom: spacing.sm }]}>District</Text>
        <View style={styles.chipWrap}>
          {districts.map((d) => (
            <Chip key={d.id} label={d.name} selected={district === d.name} onPress={() => setDistrict(d.name)} style={{ marginRight: 8, marginBottom: 8 }} />
          ))}
        </View>

        <Input label="Area / Locality" icon="location-outline" value={location} onChangeText={setLocation} containerStyle={{ marginTop: spacing.md }} />

        <Button label="Save Changes" fullWidth size="lg" onPress={handleSave} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
});
