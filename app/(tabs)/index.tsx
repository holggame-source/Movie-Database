import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';

export default function FilmsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const films = useAppStore((s) => s.films);
  const categories = useAppStore((s) => s.categories);
  const [search, setSearch] = useState('');

  const filteredFilms = useMemo(() => {
    let result = films;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((f) => f.title.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [films, search]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 12,
        paddingHorizontal: 20,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text style={{ fontFamily: 'System', fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary }}>
          Filme
        </Text>
        <Pressable onPress={() => router.push('/favorites' as any)} hitSlop={12}>
          <Ionicons name="heart" size={24} color={Colors.accent} />
        </Pressable>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Suche..."
          placeholderTextColor={Colors.textSecondary}
          style={{
            backgroundColor: Colors.inputBg,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 10,
            fontSize: 15,
            color: Colors.textPrimary,
            borderWidth: 1,
            borderColor: Colors.inputBorder,
          }}
        />
      </View>

      {/* Film list */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredFilms.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Ionicons name="film-outline" size={48} color={Colors.textSecondary} />
            <Text style={{ color: Colors.textSecondary, marginTop: 12, fontSize: 16 }}>
              Keine Filme vorhanden
            </Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 13, marginTop: 4 }}>
              Füge deinen ersten Film hinzu
            </Text>
          </View>
        ) : (
          filteredFilms.map((film) => (
            <Pressable
              key={film.id}
              onPress={() => router.push(`/films/${film.id}` as any)}
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.textPrimary }}>
                {film.title}
              </Text>
              {film.year ? (
                <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 4 }}>
                  {film.year}
                </Text>
              ) : null}
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => router.push('/films/add' as any)}
        style={{
          position: 'absolute',
          bottom: insets.bottom + 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: Colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}
}
