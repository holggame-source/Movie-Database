import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { StarRating } from './star-rating';
import { useAppStore } from '@/store/useAppStore';
import type { Film } from '@/store/types';

interface FilmCardProps {
  film: Film;
}

export function FilmCard({ film }: FilmCardProps) {
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const categories = useAppStore((s) => s.categories);

  const filmCategories = categories.filter((c) => film.categoryIds.includes(c.id));

  return (
    <View
      style={{
        backgroundColor: Colors.card,
        borderRadius: 14,
        borderCurve: 'continuous',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      }}
    >
      <Link href={`/films/${film.id}` as any} asChild>
        <Pressable>
          {({ pressed }) => (
            <View style={{ flexDirection: 'row', padding: 12, gap: 12, opacity: pressed ? 0.85 : 1 }}>
              <View
                style={{
                  width: 80,
                  height: 110,
                  borderRadius: 8,
                  borderCurve: 'continuous',
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
                    <Ionicons name="film-outline" size={32} color={Colors.textSecondary} />
                  </View>
                )}
              </View>

              <View style={{ flex: 1, justifyContent: 'center', gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text
                    style={{
                      fontFamily: Fonts.semiBold,
                      fontSize: 16,
                      color: Colors.textPrimary,
                      flexShrink: 1,
                    }}
                    numberOfLines={2}
                  >
                    {film.title}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                      backgroundColor: film.type === 'scene' ? '#7B68EE25' : '#00CED125',
                      borderWidth: 1,
                      borderColor: film.type === 'scene' ? '#7B68EE50' : '#00CED150',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.medium,
                        fontSize: 10,
                        color: film.type === 'scene' ? '#7B68EE' : '#00CED1',
                      }}
                    >
                      {film.type === 'scene' ? 'Szene' : 'Film'}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {film.year && (
                    <Text
                      style={{
                        fontFamily: Fonts.regular,
                        fontSize: 12,
                        color: Colors.accent,
                        backgroundColor: Colors.accent + '20',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
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
                        fontSize: 12,
                        color: Colors.textSecondary,
                      }}
                      numberOfLines={1}
                    >
                      {film.studio}
                    </Text>
                  )}
                </View>

                <StarRating rating={film.rating || 0} size={16} />

                {filmCategories.length > 0 && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
                    {filmCategories.slice(0, 3).map((cat) => (
                      <View
                        key={cat.id}
                        style={{
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 4,
                          backgroundColor: cat.color + '25',
                        }}
                      >
                        <Text style={{ fontFamily: Fonts.regular, fontSize: 10, color: cat.color }}>
                          {cat.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(film.id);
                }}
                hitSlop={12}
                style={{ padding: 4, alignSelf: 'flex-start' }}
              >
                <Ionicons
                  name={film.isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={film.isFavorite ? Colors.accent : Colors.textSecondary}
                />
              </Pressable>
            </View>
          )}
        </Pressable>
      </Link>
    </View>
  );
}
