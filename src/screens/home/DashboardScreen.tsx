import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, type, radius, shadow } from '../../theme';
import { SearchBar, SectionHeader, ProviderCard, StatusBadge, SummaryCard, TileButton, Chip, Button } from '../../components';
import { categories } from '../../data/categories';
import { providers } from '../../data/providers';
import { districts, salemAreas } from '../../data/districts';
import { ServiceCategoryId } from '../../data/types';
import { calculateDistanceKm, getCoordinatesForArea, GeoPoint } from '../../utils/distance';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/useAuthStore';
import { useEnquiryStore } from '../../store/useEnquiryStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useRequirementStore } from '../../store/useRequirementStore';
import { useProviderStore } from '../../store/useProviderStore';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function DashboardScreen({ navigation }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const saveProfile = useAuthStore((s) => s.saveProfile);
  const enquiries = useEnquiryStore((s) => s.enquiries);
  const fetchEnquiries = useEnquiryStore((s) => s.fetchEnquiries);
  const unread = useNotificationStore((s) => s.unreadCount());
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const setCategory = useRequirementStore((s) => s.setCategory);

  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);
  const [locating, setLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<GeoPoint | null>(null);
  const [detectedArea, setDetectedArea] = useState<string | null>(null);

  // Manual location modal state (manual fallback)
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualArea, setManualArea] = useState(profile.location || 'Fairlands');
  const [manualDistrict, setManualDistrict] = useState(profile.district || 'Salem');

  // Special Combos state & live cloud backend synchronization
  const combos = useProviderStore((s) => s.combos);
  const storeProviders = useProviderStore((s) => s.providers);
  const fetchSpecialCombos = useProviderStore((s) => s.fetchSpecialCombos);
  const fetchProviders = useProviderStore((s) => s.fetchProviders);
  const addSpecialCombo = useProviderStore((s) => s.addSpecialCombo);

  useEffect(() => {
    fetchSpecialCombos();
    fetchProviders();
    fetchEnquiries();
    fetchNotifications();
  }, [fetchSpecialCombos, fetchProviders, fetchEnquiries, fetchNotifications]);
  const [showComboModal, setShowComboModal] = useState(false);
  const [comboName, setComboName] = useState('');
  const [comboCategory, setComboCategory] = useState<ServiceCategoryId>('catering');
  const [comboProviderName, setComboProviderName] = useState('Sri Annapoorna Caterers');
  const [comboDesc, setComboDesc] = useState('');
  const [comboItems, setComboItems] = useState('');
  const [comboPrice, setComboPrice] = useState('');
  const [comboOriginalPrice, setComboOriginalPrice] = useState('');
  const [comboValidity, setComboValidity] = useState('Valid till 30 Nov 2026');
  const [comboImage, setComboImage] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800');

  const handleCreateCombo = () => {
    if (!comboName.trim() || !comboPrice.trim()) {
      Alert.alert('Required Fields', 'Please enter a combo name and price.');
      return;
    }

    const items = comboItems
      ? comboItems.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Special Menu Selection', 'Service Staff Included', 'Welcome Drinks'];

    const matchedProvider = providers.find((p) => p.name.toLowerCase() === comboProviderName.toLowerCase()) || providers[0];

    addSpecialCombo({
      id: `combo-${Date.now()}`,
      providerId: matchedProvider.id,
      providerName: matchedProvider.name,
      category: comboCategory,
      name: comboName.trim(),
      description: comboDesc.trim() || 'Exclusive combo package curated for grand events and family gatherings.',
      includedItems: items,
      price: parseInt(comboPrice, 10) || 15000,
      originalPrice: comboOriginalPrice ? parseInt(comboOriginalPrice, 10) : undefined,
      image: comboImage,
      validUntil: comboValidity || 'Valid for 30 days',
      badge: 'SPECIAL OFFER',
    });

    setShowComboModal(false);
    setComboName('');
    setComboDesc('');
    setComboItems('');
    setComboPrice('');
    setComboOriginalPrice('');
    Alert.alert('Combo Created', `"${comboName}" has been successfully added to Special Combos!`);
  };

  const firstName = profile.name.split(' ')[0] || 'there';

  // Handle Current Location with Browser / Device Permission Prompt (U2)
  const handleUseCurrentLocation = () => {
    if (usingCurrentLocation) {
      // Toggle off / Reset to manual location
      setUsingCurrentLocation(false);
      setUserCoords(null);
      setDetectedArea(null);
      return;
    }

    setLocating(true);

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setUsingCurrentLocation(true);
          setLocating(false);

          // Check proximity to Salem or show coordinate label
          const distToSalem = calculateDistanceKm(lat, lng, 11.6643, 78.1460);
          if (distToSalem <= 25) {
            setDetectedArea(`Current Location (Salem GPS · ${distToSalem < 1 ? 'Central' : `${distToSalem}km`})`);
          } else {
            setDetectedArea(`GPS: ${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`);
          }
        },
        (error) => {
          setLocating(false);
          // If permission is denied, keep manual district/area entry as requested!
          Alert.alert(
            'Location Access Denied',
            `Device location permission was denied (${error.message || 'code: ' + error.code}). Using your manual location (${profile.location || 'Fairlands'}, ${profile.district}) as fallback.`,
            [
              { text: 'Keep Current Location', style: 'cancel' },
              {
                text: 'Edit Manual Location',
                onPress: () => {
                  setManualArea(profile.location || 'Fairlands');
                  setManualDistrict(profile.district || 'Salem');
                  setShowManualModal(true);
                },
              },
            ]
          );
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      setLocating(false);
      Alert.alert(
        'Geolocation Unavailable',
        `Geolocation is not supported by this browser/device. Please enter your location manually.`,
        [
          {
            text: 'Set Manual Location',
            onPress: () => {
              setManualArea(profile.location || 'Fairlands');
              setManualDistrict(profile.district || 'Salem');
              setShowManualModal(true);
            },
          },
        ]
      );
    }
  };

  // Save manual fallback location
  const handleSaveManualLocation = () => {
    saveProfile({
      location: manualArea.trim(),
      district: manualDistrict,
    });
    setUsingCurrentLocation(false);
    setUserCoords(null);
    setDetectedArea(null);
    setShowManualModal(false);
  };

  // Active coordinates: either user GPS or manual fallback coordinates
  const activeCoordinates = useMemo<GeoPoint>(() => {
    if (usingCurrentLocation && userCoords) {
      return userCoords;
    }
    return getCoordinatesForArea(profile.location, profile.district);
  }, [usingCurrentLocation, userCoords, profile.location, profile.district]);

  // Providers with dynamically calculated distances
  const providersWithCalculatedDistance = useMemo(() => {
    const activeList = storeProviders && storeProviders.length > 0 ? storeProviders : providers;
    return activeList.map((p) => {
      const pCoords = p.coordinates || getCoordinatesForArea(p.areas[0], p.district);
      const computedDist = calculateDistanceKm(
        activeCoordinates.lat,
        activeCoordinates.lng,
        pCoords.lat,
        pCoords.lng
      );
      return {
        ...p,
        distanceKm: computedDist,
      };
    });
  }, [activeCoordinates, storeProviders]);

  // Sort Nearby Providers based on distance
  const nearby = useMemo(() => {
    return [...providersWithCalculatedDistance].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6);
  }, [providersWithCalculatedDistance]);

  const popular = [...providersWithCalculatedDistance].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6);
  const topRated = providersWithCalculatedDistance.filter((p) => p.rating >= 4.6).slice(0, 6);
  const activeEnquiries = enquiries.filter((e) => !['completed', 'cancelled'].includes(e.status));
  const awaitingResponse = enquiries.filter((e) => e.status === 'provider_responded').length;
  const visibleActiveEnquiries = activeEnquiries.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.huge }}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={[type.caption, { color: colors.muted }]}>{greetingForHour(new Date().getHours())} 👋</Text>
              <Text style={[type.h1, { color: colors.ink, marginTop: 2 }]}>{firstName}</Text>
            </View>
            <Pressable
              style={styles.bellBtn}
              onPress={() => navigation.navigate('Notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              hitSlop={6}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.ink} />
              {unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unread}</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Current Location Pill, Switcher & Manual Fallback Trigger (U2) */}
          <View style={styles.locationContainer}>
            <Pressable
              style={styles.locationInfo}
              onPress={() => {
                setManualArea(profile.location || 'Fairlands');
                setManualDistrict(profile.district || 'Salem');
                setShowManualModal(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="Change location manually"
            >
              <Ionicons
                name={usingCurrentLocation ? 'navigate' : 'location'}
                size={14}
                color={usingCurrentLocation ? colors.primary : colors.muted}
              />
              <Text style={[type.caption, { color: usingCurrentLocation ? colors.primaryDark : colors.ink, marginLeft: 4, fontWeight: '600', flexShrink: 1 }]} numberOfLines={1}>
                {usingCurrentLocation
                  ? (detectedArea || 'Current GPS Location')
                  : `${profile.location ? `${profile.location}, ` : ''}${profile.district}`}
              </Text>
              <Ionicons name="pencil-outline" size={12} color={colors.muted} style={{ marginLeft: 4 }} />
            </Pressable>

            <Pressable
              style={[styles.locationBtn, usingCurrentLocation && styles.locationBtnActive]}
              onPress={handleUseCurrentLocation}
              accessibilityRole="button"
              accessibilityLabel={usingCurrentLocation ? 'Reset location' : 'Use current location'}
            >
              {locating ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name={usingCurrentLocation ? 'close-circle' : 'locate'}
                    size={13}
                    color={usingCurrentLocation ? colors.primary : colors.ink}
                  />
                  <Text style={[type.tiny, { color: usingCurrentLocation ? colors.primaryDark : colors.ink, fontWeight: '700', marginLeft: 4 }]}>
                    {usingCurrentLocation ? 'Reset' : 'Use current location'}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Manual Location Fallback Modal */}
        <Modal
          visible={showManualModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowManualModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[type.h2, { color: colors.ink }]}>Set Your Location</Text>
                  <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>
                    Manual fallback for discovering nearby event providers
                  </Text>
                </View>
                <Pressable
                  onPress={() => setShowManualModal(false)}
                  style={styles.modalCloseBtn}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={20} color={colors.ink} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.lg }}>
                {/* GPS Trigger inside Modal */}
                <Pressable
                  style={styles.modalGpsBtn}
                  onPress={() => {
                    setShowManualModal(false);
                    handleUseCurrentLocation();
                  }}
                >
                  <Ionicons name="locate" size={18} color={colors.primary} />
                  <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                    <Text style={[type.bodyMedium, { color: colors.primary, fontWeight: '700' }]}>
                      Detect device location (GPS)
                    </Text>
                    <Text style={[type.tiny, { color: colors.muted }]}>
                      Prompts browser or device for exact location
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </Pressable>

                <View style={styles.modalDivider}>
                  <Text style={[type.tiny, { color: colors.muted, backgroundColor: colors.surface, paddingHorizontal: 8 }]}>
                    OR SET MANUALLY
                  </Text>
                </View>

                {/* District Selection */}
                <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700', marginBottom: spacing.xs }]}>
                  District
                </Text>
                <View style={styles.modalChipRow}>
                  {districts.slice(0, 6).map((d) => (
                    <Chip
                      key={d.id}
                      label={d.name}
                      selected={manualDistrict.toLowerCase() === d.name.toLowerCase()}
                      onPress={() => setManualDistrict(d.name)}
                      style={{ marginRight: 6, marginBottom: 6 }}
                    />
                  ))}
                </View>

                {/* Locality Input */}
                <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.xs }]}>
                  Area / Locality
                </Text>
                <View style={styles.modalInputWrap}>
                  <Ionicons name="location-outline" size={18} color={colors.muted} />
                  <TextInput
                    value={manualArea}
                    onChangeText={setManualArea}
                    placeholder="e.g. Fairlands, Junction"
                    placeholderTextColor={colors.faint}
                    style={[type.body, styles.modalInput]}
                  />
                  {manualArea.length > 0 && (
                    <Pressable onPress={() => setManualArea('')} hitSlop={6}>
                      <Ionicons name="close-circle" size={16} color={colors.muted} />
                    </Pressable>
                  )}
                </View>

                {/* Popular Salem Areas Suggestion Chips */}
                <Text style={[type.caption, { color: colors.muted, marginTop: spacing.sm, marginBottom: spacing.xs }]}>
                  Popular Salem Localities:
                </Text>
                <View style={styles.modalChipRow}>
                  {salemAreas.map((area) => (
                    <Chip
                      key={area}
                      label={area}
                      selected={manualArea.toLowerCase() === area.toLowerCase()}
                      onPress={() => {
                        setManualArea(area);
                        setManualDistrict('Salem');
                      }}
                      style={{ marginRight: 6, marginBottom: 6 }}
                    />
                  ))}
                </View>

                <Button
                  label="Apply Location"
                  icon="checkmark"
                  fullWidth
                  size="lg"
                  onPress={handleSaveManualLocation}
                  style={{ marginTop: spacing.xl }}
                />
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Create Special Combo Modal (P6) */}
        <Modal
          visible={showComboModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowComboModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[type.h2, { color: colors.ink }]}>Create Special Combo</Text>
                  <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>
                    Publish an exclusive event package with items, pricing & validity
                  </Text>
                </View>
                <Pressable
                  onPress={() => setShowComboModal(false)}
                  style={styles.modalCloseBtn}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={20} color={colors.ink} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.lg }}>
                {/* Category Picker */}
                <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700', marginBottom: spacing.xs }]}>
                  Service Category
                </Text>
                <View style={styles.modalChipRow}>
                  {categories.map((c) => (
                    <Chip
                      key={c.id}
                      label={c.name}
                      selected={comboCategory === c.id}
                      onPress={() => setComboCategory(c.id as ServiceCategoryId)}
                      style={{ marginRight: 6, marginBottom: 6 }}
                    />
                  ))}
                </View>

                {/* Combo Title */}
                <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700', marginTop: spacing.sm, marginBottom: spacing.xs }]}>
                  Combo Title *
                </Text>
                <View style={styles.modalInputWrap}>
                  <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
                  <TextInput
                    value={comboName}
                    onChangeText={setComboName}
                    placeholder="e.g. Grand Muhurtham Feast (500 pax)"
                    placeholderTextColor={colors.faint}
                    style={[type.body, styles.modalInput]}
                  />
                </View>

                {/* Provider Name */}
                <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700', marginTop: spacing.sm, marginBottom: spacing.xs }]}>
                  Offering Provider
                </Text>
                <View style={styles.modalChipRow}>
                  {providers.slice(0, 4).map((p) => (
                    <Chip
                      key={p.id}
                      label={p.name}
                      selected={comboProviderName === p.name}
                      onPress={() => setComboProviderName(p.name)}
                      style={{ marginRight: 6, marginBottom: 6 }}
                    />
                  ))}
                </View>

                {/* Description */}
                <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700', marginTop: spacing.sm, marginBottom: spacing.xs }]}>
                  Description
                </Text>
                <View style={styles.modalInputWrap}>
                  <Ionicons name="document-text-outline" size={18} color={colors.muted} />
                  <TextInput
                    value={comboDesc}
                    onChangeText={setComboDesc}
                    placeholder="Brief description of what makes this combo special"
                    placeholderTextColor={colors.faint}
                    style={[type.body, styles.modalInput]}
                  />
                </View>

                {/* Included Items */}
                <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700', marginTop: spacing.sm, marginBottom: spacing.xs }]}>
                  Included Items (comma-separated) *
                </Text>
                <View style={styles.modalInputWrap}>
                  <Ionicons name="list-outline" size={18} color={colors.muted} />
                  <TextInput
                    value={comboItems}
                    onChangeText={setComboItems}
                    placeholder="e.g. Welcome Drinks, 4 Sweets, Traditional Thali, Dessert"
                    placeholderTextColor={colors.faint}
                    style={[type.body, styles.modalInput]}
                  />
                </View>

                {/* Price and Original Price */}
                <View style={{ flexDirection: 'row', marginTop: spacing.sm }}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700', marginBottom: spacing.xs }]}>
                      Deal Price (₹) *
                    </Text>
                    <View style={styles.modalInputWrap}>
                      <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700' }]}>₹</Text>
                      <TextInput
                        value={comboPrice}
                        onChangeText={setComboPrice}
                        placeholder="22000"
                        keyboardType="numeric"
                        placeholderTextColor={colors.faint}
                        style={[type.body, styles.modalInput]}
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700', marginBottom: spacing.xs }]}>
                      Regular Price (₹)
                    </Text>
                    <View style={styles.modalInputWrap}>
                      <Text style={[type.bodyMedium, { color: colors.muted }]}>₹</Text>
                      <TextInput
                        value={comboOriginalPrice}
                        onChangeText={setComboOriginalPrice}
                        placeholder="28000"
                        keyboardType="numeric"
                        placeholderTextColor={colors.faint}
                        style={[type.body, styles.modalInput]}
                      />
                    </View>
                  </View>
                </View>

                {/* Validity */}
                <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700', marginTop: spacing.sm, marginBottom: spacing.xs }]}>
                  Validity Period
                </Text>
                <View style={styles.modalInputWrap}>
                  <Ionicons name="calendar-outline" size={18} color={colors.muted} />
                  <TextInput
                    value={comboValidity}
                    onChangeText={setComboValidity}
                    placeholder="Valid till 30 Nov 2026"
                    placeholderTextColor={colors.faint}
                    style={[type.body, styles.modalInput]}
                  />
                </View>

                {/* Photo presets */}
                <Text style={[type.bodyMedium, { color: colors.ink, fontWeight: '700', marginTop: spacing.sm, marginBottom: spacing.xs }]}>
                  Combo Banner Image
                </Text>
                <View style={{ flexDirection: 'row', marginBottom: spacing.md }}>
                  {[
                    { label: 'Feast', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800' },
                    { label: 'Decoration', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
                    { label: 'Bridal', url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800' },
                    { label: 'Audio', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800' },
                  ].map((img) => (
                    <Pressable
                      key={img.label}
                      onPress={() => setComboImage(img.url)}
                      style={{
                        marginRight: 8,
                        borderRadius: radius.md,
                        borderWidth: 2,
                        borderColor: comboImage === img.url ? colors.primary : 'transparent',
                        overflow: 'hidden',
                      }}
                    >
                      <Image source={{ uri: img.url }} style={{ width: 64, height: 44 }} />
                    </Pressable>
                  ))}
                </View>

                <Button
                  label="Publish Special Combo"
                  icon="sparkles"
                  fullWidth
                  size="lg"
                  onPress={handleCreateCombo}
                  style={{ marginTop: spacing.sm }}
                />
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View style={styles.body}>
          <Pressable onPress={() => navigation.navigate('CategorySelect')} accessibilityRole="button" accessibilityLabel="Search providers">
            <View pointerEvents="none">
              <SearchBar value="" onChangeText={() => {}} placeholder="Search catering, decoration, makeup, audio..." editable={false} />
            </View>
          </Pressable>

          <SummaryCard
            icon="document-text"
            label={activeEnquiries.length === 1 ? 'Active Enquiry' : 'Active Enquiries'}
            value={activeEnquiries.length}
            meta={awaitingResponse > 0 ? `${awaitingResponse} awaiting your response` : activeEnquiries.length > 0 ? 'All caught up — no action needed' : 'Start by browsing a category below'}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Enquiries' })}
            style={{ marginTop: spacing.lg }}
          />

          <SectionHeader title="Quick Actions" />
          <View style={styles.tileRow}>
            <TileButton
              icon="add-circle"
              label="New Enquiry"
              iconColor={colors.primary}
              onPress={() => navigation.navigate('CategorySelect')}
              style={{ marginRight: spacing.sm }}
            />
            <TileButton
              icon="document-text"
              label="My Enquiries"
              iconColor={colors.secondary}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Enquiries' })}
            />
          </View>

          <SectionHeader title="Browse by Category" />
          <View style={styles.categoryRow}>
            {categories.map((cat, i) => (
              <TileButton
                key={cat.id}
                icon={cat.icon as any}
                label={cat.name}
                iconColor={cat.color}
                onPress={() => {
                  setCategory(cat.id);
                  navigation.navigate('RequirementForm', { category: cat.id });
                }}
                style={i < categories.length - 1 ? { marginRight: spacing.sm } : undefined}
              />
            ))}
          </View>

          {/* Special Combos Section (P6) */}
          <SectionHeader
            title="Special Combos"
            subtitle="Curated festival & celebration packages at special rates"
            actionLabel="+ Create Combo"
            onAction={() => setShowComboModal(true)}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: spacing.xl, paddingBottom: spacing.sm }}
          >
            {combos.map((combo) => (
              <Pressable
                key={combo.id}
                style={[styles.comboCard, shadow.md]}
                onPress={() => navigation.navigate('ProviderDetail', { providerId: combo.providerId })}
              >
                <Image source={{ uri: combo.image }} style={styles.comboImage} />
                {combo.badge && (
                  <View style={styles.comboBadge}>
                    <Text style={styles.comboBadgeText}>{combo.badge}</Text>
                  </View>
                )}
                <View style={styles.comboContent}>
                  <Text style={[type.caption, { color: colors.secondary, fontWeight: '700' }]} numberOfLines={1}>
                    {combo.providerName}
                  </Text>
                  <Text style={[type.h3, { color: colors.ink, marginTop: 2 }]} numberOfLines={1}>
                    {combo.name}
                  </Text>
                  <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]} numberOfLines={2}>
                    {combo.description}
                  </Text>

                  <View style={styles.comboItemsWrap}>
                    {combo.includedItems.slice(0, 3).map((item, idx) => (
                      <View key={idx} style={styles.comboItemChip}>
                        <Ionicons name="checkmark-circle" size={11} color={colors.primary} />
                        <Text style={[type.tiny, { color: colors.ink, marginLeft: 3 }]}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.comboFooter}>
                    <View>
                      <Text style={[type.tiny, { color: colors.muted }]}>{combo.validUntil}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 2 }}>
                        <Text style={[type.h2, { color: colors.primary }]}>₹{combo.price.toLocaleString('en-IN')}</Text>
                        {combo.originalPrice && (
                          <Text style={[type.caption, { color: colors.muted, textDecorationLine: 'line-through', marginLeft: 6 }]}>
                            ₹{combo.originalPrice.toLocaleString('en-IN')}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.comboBtn}>
                      <Text style={styles.comboBtnText}>View Deal</Text>
                      <Ionicons name="arrow-forward" size={13} color={colors.white} style={{ marginLeft: 3 }} />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <View style={{ height: spacing.lg }} />

          {visibleActiveEnquiries.length > 0 && (
            <>
              <SectionHeader title="Active Enquiries" actionLabel="View all" onAction={() => navigation.navigate('MainTabs', { screen: 'Enquiries' })} />
              {visibleActiveEnquiries.map((e) => (
                <Pressable key={e.id} style={[styles.enquiryCard, shadow.sm]} onPress={() => navigation.navigate('EnquiryDetail', { enquiryId: e.id })}>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.bodyMedium, { color: colors.ink }]} numberOfLines={1}>{e.providerName}</Text>
                    <Text style={[type.caption, { color: colors.muted, marginTop: 2 }]}>{e.eventType} · {e.guestCount} guests</Text>
                  </View>
                  <StatusBadge status={e.status} />
                </Pressable>
              ))}
              <View style={{ height: spacing.lg }} />
            </>
          )}

          <SectionHeader
            title="Nearby Providers"
            subtitle={usingCurrentLocation ? 'Sorted by real-time GPS proximity' : 'Sorted by distance from your area'}
            actionLabel="See all"
            onAction={() => navigation.navigate('CategorySelect')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: spacing.xl }}>
            {nearby.map((p) => (
              <View key={p.id} style={{ marginRight: spacing.md }}>
                <ProviderCard provider={p} horizontal onPress={() => navigation.navigate('ProviderDetail', { providerId: p.id })} />
              </View>
            ))}
          </ScrollView>

          <View style={{ height: spacing.xl }} />
          <SectionHeader title="Highly Rated" actionLabel="See all" onAction={() => navigation.navigate('CategorySelect')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: spacing.xl }}>
            {topRated.map((p) => (
              <View key={p.id} style={{ marginRight: spacing.md }}>
                <ProviderCard provider={p} horizontal onPress={() => navigation.navigate('ProviderDetail', { providerId: p.id })} />
              </View>
            ))}
          </ScrollView>

          <View style={{ height: spacing.xl }} />
          <SectionHeader title="Popular on Aagara Thirupthi" actionLabel="See all" onAction={() => navigation.navigate('CategorySelect')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: spacing.xl }}>
            {popular.map((p) => (
              <View key={p.id} style={{ marginRight: spacing.md }}>
                <ProviderCard provider={p} horizontal onPress={() => navigation.navigate('ProviderDetail', { providerId: p.id })} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  bellBtn: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.divider,
  },
  badge: {
    position: 'absolute', top: -3, right: -3, minWidth: 17, height: 17, borderRadius: 9,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: colors.background,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: '700' },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  locationBtnActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  tileRow: { flexDirection: 'row', marginBottom: spacing.xl },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  enquiryCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.divider,
  },
  comboCard: {
    width: 290,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
    marginRight: spacing.md,
  },
  comboImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.divider,
  },
  comboBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  comboBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  comboContent: {
    padding: spacing.md,
  },
  comboItemsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  comboItemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  comboFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  comboBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  comboBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.huge,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  modalGpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  modalDivider: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    height: 10,
  },
  modalChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  modalInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.xs,
  },
  modalInput: {
    flex: 1,
    color: colors.ink,
    marginLeft: spacing.sm,
    outlineStyle: 'none' as any,
  },
});


