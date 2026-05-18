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
import { StarRating } from '@/components/star-rating';
import { AlternateFieldList } from '@/components/alternate-field-list';
import type { FilmType } from '@/store/types';

export default function AddFilmScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const addFilm = useAppStore((s) => s.addFilm);
  const categories = useAppStore((s) => s.categories);
  const actresses = useAppStore((s) => s.actresses);

  const [title, setTitle] = useState('');
  const [alternateTitles, setAlternateTitles] = useState<string[]>([]);
  const [filmType, setFilmType] = useState<FilmType>('movie');
  const [year, setYear] = useState('');
  const [studio, setStudio] = useState('');
  const [posterUri, setPosterUri] = useState<string | undefined>();
  const [rating, setRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedActresses, setSelectedActresses] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setPosterUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Fehler', 'Bild konnte nicht geladen werden');
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleActress = (id: string) => {
    setSelectedActresses((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Fehler', 'Bitte einen Titel eingeben');
      return;
    }
    const filteredAlternateTitles = alternateTitles.map((t) => t.trim()).filter(Boolean);
    addFilm({
      title: title.trim(),
      alternateTitles: filteredAlternateTitles.length > 0 ? filteredAlternateTitles : undefined,
      type: filmType,
      year: year ? parseInt(year, 10) : undefined,
      studio: studio.trim() || undefined,
      posterUri,
      rating: rating || undefined,
      isFavorite: false,
      categoryIds: selectedCategories,
      actressIds: selectedActresses,
      notes: notes.trim() || undefined,
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
          Film hinzufügen
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Poster picker */}
        <Pressable onPress={pickImage} style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 140,
              height: 190,
              borderRadius: 12,
              borderCurve: 'continuous',
              overflow: 'hidden',
              backgroundColor: Colors.card,
              borderWidth: 2,
              borderColor: Colors.cardBorder,
              borderStyle: 'dashed',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {posterUri ? (
              <Image source={{ uri: posterUri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            ) : (
              <View style={{ alignItems: 'center', gap: 8 }}>
                <Ionicons name="image-outline" size={36} color={Colors.textSecondary} />
                <Text style={{ fontFamily: Fonts.regular, fontSize: 12, color: Colors.textSecondary }}>
                  Poster auswählen
                </Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Type selector */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Typ</Text>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.inputBg,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: Colors.inputBorder,
              padding: 3,
            }}
          >
            <Pressable
              onPress={() => setFilmType('movie')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: filmType === 'movie' ? Colors.accent : 'transparent',
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 14,
                  color: filmType === 'movie' ? Colors.textPrimary : Colors.textSecondary,
                }}
              >
                Film
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFilmType('scene')}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: filmType === 'scene' ? '#7B68EE' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 14,
                  color: filmType === 'scene' ? Colors.textPrimary : Colors.textSecondary,
                }}
              >
                Szene
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Title & Year row */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 2, gap: 4 }}>
            <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Titel</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Film Title"
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
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Jahr</Text>
            <TextInput
              value={year}
              onChangeText={setYear}
              placeholder="YYYY"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="number-pad"
              maxLength={4}
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
        </View>

        {/* Alternate Titles */}
        <AlternateFieldList
          label="Alternativer Titel"
          placeholder="Alternativer Titel eingeben"
          values={alternateTitles}
          onChange={setAlternateTitles}
        />

        {/* Studio */}
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Studio</Text>
          <TextInput
            value={studio}
            onChangeText={setStudio}
            placeholder="Studio Name"
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

        {/* Rating */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Bewertung</Text>
          <StarRating rating={rating} size={28} editable onChange={setRating} />
        </View>

        {/* Categories */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Kategorien</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {categories.map((cat) => (
              <Pressable key={cat.id} onPress={() => toggleCategory(cat.id)}>
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 14,
                    backgroundColor: selectedCategories.includes(cat.id) ? cat.color : 'transparent',
                    borderWidth: 1.5,
                    borderColor: selectedCategories.includes(cat.id) ? cat.color : cat.color + '60',
                    borderCurve: 'continuous',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 13,
                      color: selectedCategories.includes(cat.id) ? Colors.textPrimary : cat.color,
                    }}
                  >
                    {cat.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Actresses */}
        {actresses.length > 0 && (
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Darstellerinnen</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {actresses.map((a) => (
                <Pressable key={a.id} onPress={() => toggleActress(a.id)}>
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 14,
                      backgroundColor: selectedActresses.includes(a.id) ? Colors.accent : 'transparent',
                      borderWidth: 1.5,
                      borderColor: selectedActresses.includes(a.id) ? Colors.accent : Colors.accent + '60',
                      borderCurve: 'continuous',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.medium,
                        fontSize: 13,
                        color: selectedActresses.includes(a.id) ? Colors.textPrimary : Colors.accent,
                      }}
                    >
                      {a.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Notes */}
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>Notizen</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notizen..."
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
