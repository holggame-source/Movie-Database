import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { StarRating } from '@/components/star-rating';
import { CategoryChip } from '@/components/category-chip';

export default function FilmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const film = useAppStore((s) => s.films.find((f) => f.id === id));
  const categories = useAppStore((s) => s.categories);
  const actresses = useAppStore((s) => s.actresses);
  const deleteFilm = useAppStore((s) => s.deleteFilm);
  const updateFilm = useAppStore((s) => s.updateFilm);

  if (!film) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: Fonts.medium, fontSize: 16, color: Colors.textSecondary }}>
          Film nicht gefunden
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 14, color: Colors.accent }}>Zurück</Text>
        </Pressable>
      </View>
    );
  }

  const filmCategories = categories.filter((c) => film.categoryIds.includes(c.id));
  const filmActresses = actresses.filter((a) => film.actressIds.includes(a.id));

  const handleDelete = () => {
    Alert.alert(
      'Film löschen',
      `"${film.title}" wirklich löschen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            deleteFilm(film.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header image */}
        <View style={{ width: '100%', height: 320, backgroundColor: Colors.card }}>
          {film.posterUri ? (
            <Image
              source={{ uri: film.posterUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="film-outline" size={64} color={Colors.textSecondary} />
            </View>
          )}

          {/* Gradient overlay */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              backgroundColor: 'transparent',
            }}
          />
        </View>

        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: insets.top + 8,
            left: 16,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>

        {/* Edit button */}
        <Pressable
          onPress={() => router.push(`/films/edit/${film.id}` as any)}
          style={{
            position: 'absolute',
            top: insets.top + 8,
            right: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 14,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: '#FFFFFF' }}>Edit</Text>
        </Pressable>

        {/* Content */}
        <View style={{ padding: 20, gap: 16 }}>
          <Text
            style={{
              fontFamily: Fonts.bold,
              fontSize: 26,
              color: Colors.textPrimary,
            }}
            selectable
          >
            {film.title}
          </Text>

          {/* Alternate Titles */}
          {film.alternateTitles && film.alternateTitles.length > 0 && (
            <View style={{ gap: 4, marginTop: -8 }}>
              {film.alternateTitles.map((altTitle, idx) => (
                <Text
                  key={idx}
                  style={{
                    fontFamily: Fonts.regular,
                    fontSize: 14,
                    color: Colors.textSecondary,
                    fontStyle: 'italic',
                  }}
                  selectable
                >
                  {altTitle}
                </Text>
              ))}
            </View>
          )}

          {/* Type, Year & Studio */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: film.type === 'scene' ? '#7B68EE20' : '#00CED120',
                borderWidth: 1,
                borderColor: film.type === 'scene' ? '#7B68EE50' : '#00CED150',
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 12,
                  color: film.type === 'scene' ? '#7B68EE' : '#00CED1',
                }}
              >
                {film.type === 'scene' ? 'Szene' : 'Film'}
              </Text>
            </View>
            {film.year && (
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 13,
                  color: Colors.accent,
                  backgroundColor: Colors.accent + '20',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                {film.year}
              </Text>
            )}
            {film.studio && (
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: Colors.textSecondary,
                }}
                selectable
              >
                {film.studio}
              </Text>
            )}
          </View>

          {/* Rating */}
          <StarRating
            rating={film.rating || 0}
            size={24}
            editable
            onChange={(r) => updateFilm(film.id, { rating: r })}
          />

          {/* Categories */}
          {filmCategories.length > 0 && (
            <View style={{ gap: 8 }}>
              <Text style={{ fontFamily: Fonts.semiBold, fontSize: 14, color: Colors.textSecondary }}>
                Kategorien
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {filmCategories.map((cat) => (
                  <CategoryChip key={cat.id} name={cat.name} color={cat.color} small />
                ))}
              </View>
            </View>
          )}

          {/* Actresses */}
          {filmActresses.length > 0 && (
            <View style={{ gap: 8 }}>
              <Text style={{ fontFamily: Fonts.semiBold, fontSize: 14, color: Colors.textSecondary }}>
                Darstellerinnen
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ gap: 12 }}
              >
                {filmActresses.map((actress) => (
                  <Pressable
                    key={actress.id}
                    onPress={() => router.push(`/actresses/${actress.id}` as any)}
                    style={{ alignItems: 'center', gap: 6 }}
                  >
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        overflow: 'hidden',
                        backgroundColor: Colors.inputBg,
                        borderWidth: 2,
                        borderColor: Colors.accent + '40',
                      }}
                    >
                      {actress.photoUri ? (
                        <Image
                          source={{ uri: actress.photoUri }}
                          style={{ width: '100%', height: '100%' }}
                          contentFit="cover"
                        />
                      ) : (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="person" size={22} color={Colors.textSecondary} />
                        </View>
                      )}
                    </View>
                    <Text
                      style={{
                        fontFamily: Fonts.regular,
                        fontSize: 11,
                        color: Colors.textPrimary,
                        maxWidth: 70,
                        textAlign: 'center',
                      }}
                      numberOfLines={1}
                    >
                      {actress.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Notes */}
          {film.notes && (
            <View style={{ gap: 8 }}>
              <Text style={{ fontFamily: Fonts.semiBold, fontSize: 14, color: Colors.textSecondary }}>
                Notes / Comments
              </Text>
              <View
                style={{
                  backgroundColor: Colors.card,
                  borderRadius: 12,
                  borderCurve: 'continuous',
                  padding: 14,
                  borderWidth: 1,
                  borderColor: Colors.cardBorder,
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.regular,
                    fontSize: 14,
                    color: Colors.textPrimary,
                    lineHeight: 20,
                  }}
                  selectable
                >
                  {film.notes}
                </Text>
              </View>
            </View>
          )}

          {/* Action buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <Pressable
              onPress={handleDelete}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                borderCurve: 'continuous',
                borderWidth: 1.5,
                borderColor: Colors.danger,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: Fonts.semiBold, fontSize: 15, color: Colors.danger }}>
                Löschen
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push(`/films/edit/${film.id}` as any)}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                borderCurve: 'continuous',
                backgroundColor: Colors.accent,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: Fonts.semiBold, fontSize: 15, color: Colors.textPrimary }}>
                Bearbeiten
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
