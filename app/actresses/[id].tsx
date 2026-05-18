import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { StarRating } from '@/components/star-rating';

export default function ActressDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const actress = useAppStore((s) => s.actresses.find((a) => a.id === id));
  const films = useAppStore((s) => s.films);
  const deleteActress = useAppStore((s) => s.deleteActress);

  if (!actress) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: Fonts.medium, fontSize: 16, color: Colors.textSecondary }}>
          Darstellerin nicht gefunden
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 14, color: Colors.accent }}>Zurück</Text>
        </Pressable>
      </View>
    );
  }

  const actressFilms = films.filter((f) => f.actressIds.includes(actress.id));

  const handleDelete = () => {
    Alert.alert(
      'Darstellerin löschen',
      `"${actress.name}" wirklich löschen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            deleteActress(actress.id);
            router.back();
          },
        },
      ]
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile photo */}
        <View style={{ width: '100%', height: 320, backgroundColor: Colors.card }}>
          {actress.photoUri ? (
            <Image
              source={{ uri: actress.photoUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="person" size={64} color={Colors.textSecondary} />
            </View>
          )}
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
          onPress={() => router.push(`/actresses/edit/${actress.id}` as any)}
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
            style={{ fontFamily: Fonts.bold, fontSize: 26, color: Colors.textPrimary }}
            selectable
          >
            {actress.name}
          </Text>

          {/* Alternate Names */}
          {actress.alternateNames && actress.alternateNames.length > 0 && (
            <View style={{ gap: 4, marginTop: -8 }}>
              {actress.alternateNames.map((altName, idx) => (
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
                  {altName}
                </Text>
              ))}
            </View>
          )}

          {/* Info */}
          <View style={{ gap: 8 }}>
            {actress.birthday && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
                <Text style={{ fontFamily: Fonts.regular, fontSize: 14, color: Colors.textSecondary }}>
                  {formatDate(actress.birthday)}
                </Text>
              </View>
            )}
            {actress.nationality && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="globe-outline" size={16} color={Colors.textSecondary} />
                <Text style={{ fontFamily: Fonts.regular, fontSize: 14, color: Colors.textSecondary }}>
                  {actress.nationality}
                </Text>
              </View>
            )}
          </View>

          {/* Bio */}
          {actress.bio && (
            <View style={{ gap: 8 }}>
              <Text style={{ fontFamily: Fonts.semiBold, fontSize: 14, color: Colors.textSecondary }}>
                Bio / Notizen
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
                  style={{ fontFamily: Fonts.regular, fontSize: 14, color: Colors.textPrimary, lineHeight: 20 }}
                  selectable
                >
                  {actress.bio}
                </Text>
              </View>
            </View>
          )}

          {/* Linked films */}
          {actressFilms.length > 0 && (
            <View style={{ gap: 10 }}>
              <Text style={{ fontFamily: Fonts.semiBold, fontSize: 14, color: Colors.textSecondary }}>
                Filme ({actressFilms.length})
              </Text>
              {actressFilms.map((film) => (
                <Pressable
                  key={film.id}
                  onPress={() => router.push(`/films/${film.id}` as any)}
                >
                  {({ pressed }) => (
                    <View
                      style={{
                        backgroundColor: Colors.card,
                        borderRadius: 10,
                        borderCurve: 'continuous',
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        borderWidth: 1,
                        borderColor: Colors.cardBorder,
                        opacity: pressed ? 0.85 : 1,
                      }}
                    >
                      <View
                        style={{
                          width: 44,
                          height: 60,
                          borderRadius: 6,
                          overflow: 'hidden',
                          backgroundColor: Colors.inputBg,
                        }}
                      >
                        {film.posterUri ? (
                          <Image
                            source={{ uri: film.posterUri }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                          />
                        ) : (
                          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="film-outline" size={18} color={Colors.textSecondary} />
                          </View>
                        )}
                      </View>
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text
                          style={{ fontFamily: Fonts.medium, fontSize: 14, color: Colors.textPrimary }}
                          numberOfLines={1}
                        >
                          {film.title}
                        </Text>
                        {film.year && (
                          <Text style={{ fontFamily: Fonts.regular, fontSize: 12, color: Colors.textSecondary }}>
                            {film.year}
                          </Text>
                        )}
                      </View>
                      <StarRating rating={film.rating || 0} size={12} />
                    </View>
                  )}
                </Pressable>
              ))}
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
              onPress={() => router.push(`/actresses/edit/${actress.id}` as any)}
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
