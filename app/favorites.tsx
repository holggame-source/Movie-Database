import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { FilmCard } from '@/components/film-card';
import { EmptyState } from '@/components/empty-state';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const films = useAppStore((s) => s.films);

  const favoriteFilms = films.filter((f) => f.isFavorite);

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
        <Ionicons name="heart" size={22} color={Colors.accent} />
        <Text style={{ fontFamily: Fonts.bold, fontSize: 22, color: Colors.textPrimary, flex: 1 }}>
          Favoriten
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          gap: 12,
          flexGrow: favoriteFilms.length === 0 ? 1 : undefined,
        }}
        showsVerticalScrollIndicator={false}
      >
        {favoriteFilms.length === 0 ? (
          <EmptyState
            icon="heart-outline"
            title="Keine Favoriten"
            subtitle="Markiere Filme als Favoriten, um sie hier zu sehen"
          />
        ) : (
          favoriteFilms.map((film) => <FilmCard key={film.id} film={film} />)
        )}
      </ScrollView>
    </View>
  );
}
