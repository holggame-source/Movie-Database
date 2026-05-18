import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { AlternateFieldList } from '@/components/alternate-field-list';

export default function AddActressScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const addActress = useAppStore((s) => s.addActress);

  const [name, setName] = useState('');
  const [alternateNames, setAlternateNames] = useState<string[]>([]);
  const [birthday, setBirthday] = useState('');
  const [nationality, setNationality] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [bio, setBio] = useState('');

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Fehler', 'Bild konnte nicht geladen werden');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Fehler', 'Bitte einen Namen eingeben');
      return;
    }
    const filteredAlternateNames = alternateNames.map((n) => n.trim()).filter(Boolean);
    addActress({
      name: name.trim(),
      alternateNames: filteredAlternateNames.length > 0 ? filteredAlternateNames : undefined,
      birthday: birthday.trim() || undefined,
      nationality: nationality.trim() || undefined,
      photoUri,
      bio: bio.trim() || undefined,
    });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={{ fontFamily: Fonts.bold, fontSize: 22, color: Colors.textPrimary, flex: 1 }}>
          Darstellerin hinzufügen
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo picker */}
        <Pressable onPress={pickImage} style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              overflow: 'hidden',
              backgroundColor: Colors.card,
              borderWidth: 2,
              borderColor: Colors.cardBorder,
              borderStyle: 'dashed',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            ) : (
              <View style={{ alignItems: 'center', gap: 6 }}>
                <Ionicons name="camera-outline" size={32} color={Colors.textSecondary} />
                <Text style={{ fontFamily: Fonts.regular, fontSize: 11, color: Colors.textSecondary }}>
                  Foto
                </Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Name */}
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name eingeben"
            placeholderTextColor={Colors.textSecondary}
            style={{
              fontFamily: Fonts.regular,
              fontSize: 15,
              color: Colors.textPrimary,
              backgroundColor: Colors.inputBg,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: Colors.inputBorder,
            }}
          />
        </View>

        {/* Alternate Names */}
        <AlternateFieldList
          label="Alternativer Name"
          placeholder="Alternativer Name eingeben"
          values={alternateNames}
          onChange={setAlternateNames}
        />

        {/* Birthday */}
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Geburtstag</Text>
          <TextInput
            value={birthday}
            onChangeText={setBirthday}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textSecondary}
            style={{
              fontFamily: Fonts.regular,
              fontSize: 15,
              color: Colors.textPrimary,
              backgroundColor: Colors.inputBg,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: Colors.inputBorder,
            }}
          />
        </View>

        {/* Nationality */}
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Nationalität</Text>
          <TextInput
            value={nationality}
            onChangeText={setNationality}
            placeholder="z.B. USA, Deutschland..."
            placeholderTextColor={Colors.textSecondary}
            style={{
              fontFamily: Fonts.regular,
              fontSize: 15,
              color: Colors.textPrimary,
              backgroundColor: Colors.inputBg,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: Colors.inputBorder,
            }}
          />
        </View>

        {/* Bio */}
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Bio / Notizen</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Biografie oder Notizen..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              fontFamily: Fonts.regular,
              fontSize: 15,
              color: Colors.textPrimary,
              backgroundColor: Colors.inputBg,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: Colors.inputBorder,
              minHeight: 100,
            }}
          />
        </View>

        {/* Save button */}
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => ({
            backgroundColor: Colors.accent,
            borderRadius: 12,
            borderCurve: 'continuous',
            paddingVertical: 16,
            alignItems: 'center',
            opacity: pressed ? 0.85 : 1,
            marginTop: 8,
          })}
        >
          <Text style={{ fontFamily: Fonts.semiBold, fontSize: 16, color: Colors.textPrimary }}>
            Speichern
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
