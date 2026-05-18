import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { SearchBar } from '@/components/search-bar';
import { FilmCard } from '@/components/film-card';
import { EmptyState } from '@/components/empty-state';
import { FabButton } from '@/components/fab-button';
import { FilterButton } from '@/components/filter-button';
import { FilterBottomSheet } from '@/components/filter-bottom-sheet';
import { FilterSection } from '@/components/filter-section';
import { StarRating } from '@/components/star-rating';
import type { FilmType } from '@/store/types';

export default function FilmsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const films = useAppStore((s) => s.films);
  const categories = useAppStore((s) => s.categories);

  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState<FilmType | null>(null);
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [filterStudio, setFilterStudio] = useState<string | null>(null);
  const [filterYearMin, setFilterYearMin] = useState('');
  const [filterYearMax, setFilterYearMax] = useState('');

  // Get unique studios from existing films
  const availableStudios = useMemo(() => {
    const studios = new Set<string>();
    films.forEach((f) => {
      if (f.studio) studios.add(f.studio);
    });
    return Array.from(studios).sort();
  }, [films]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterType) count++;
    if (filterMinRating > 0) count++;
    if (filterCategories.length > 0) count++;
    if (filterFavorite) count++;
    if (filterStudio) count++;
    if (filterYearMin || filterYearMax) count++;
    return count;
  }, [filterType, filterMinRating, filterCategories, filterFavorite, filterStudio, filterYearMin, filterYearMax]);

  const resetFilters = () => {
    setFilterType(null);
    setFilterMinRating(0);
    setFilterCategories([]);
    setFilterFavorite(false);
    setFilterStudio(null);
    setFilterYearMin('');
    setFilterYearMax('');
  };

  const toggleFilterCategory = (id: string) => {
    setFilterCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const filteredFilms = useMemo(() => {
    let result = films;

    // Search (title + alternate titles)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((f) =>
        f.title.toLowerCase().includes(q) ||
        (f.alternateTitles?.some((alt) => alt.toLowerCase().includes(q)) ?? false)
      );
    }

    // Type filter
    if (filterType) {
      result = result.filter((f) => f.type === filterType);
    }

    // Min rating filter
    if (filterMinRating > 0) {
      result = result.filter((f) => (f.rating || 0) >= filterMinRating);
    }

    // Category filter (AND: film must have ALL selected categories)
    if (filterCategories.length > 0) {
      result = result.filter((f) =>
        filterCategories.every((catId) => f.categoryIds.includes(catId))
      );
    }

    // Favorite filter
    if (filterFavorite) {
      result = result.filter((f) => f.isFavorite);
    }

    // Studio filter
    if (filterStudio) {
      result = result.filter((f) => f.studio === filterStudio);
    }

    // Year range filter
    if (filterYearMin) {
      const min = parseInt(filterYearMin, 10);
      if (!isNaN(min)) {
        result = result.filter((f) => (f.year || 0) >= min);
      }
    }
    if (filterYearMax) {
      const max = parseInt(filterYearMax, 10);
      if (!isNaN(max)) {
        result = result.filter((f) => (f.year || 9999) <= max);
      }
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [films, search, filterType, filterMinRating, filterCategories, filterFavorite, filterStudio, filterYearMin, filterYearMax]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontFamily: Fonts.bold, fontSize: 28, color: Colors.textPrimary }}>
          Filme
        </Text>
        <Pressable onPress={() => router.push('/favorites' as any)} hitSlop={12}>
          <Ionicons name="heart" size={24} color={Colors.accent} />
        </Pressable>
      </View>

      {/* Search + Filter row */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Suche..." />
        </View>
        <FilterButton onPress={() => setShowFilter(true)} activeCount={activeFilterCount} />
      </View>

      {/* Film list */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filteredFilms.length === 0 ? (
          <EmptyState
            icon="film-outline"
            title="Keine Filme"
            subtitle={activeFilterCount > 0 ? 'Versuche andere Filter' : 'Füge deinen ersten Film hinzu'}
          />
        ) : (
          filteredFilms.map((film) => <FilmCard key={film.id} film={film} />)
        )}
      </ScrollView>

      <FabButton onPress={() => router.push('/films/add' as any)} />

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onReset={resetFilters}
        activeCount={activeFilterCount}
      >
        {/* Type filter */}
        <FilterSection title="Typ">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {([null, 'movie', 'scene'] as const).map((type) => {
              const label = type === null ? 'Alle' : type === 'movie' ? 'Film' : 'Szene';
              const isSelected = filterType === type;
              return (
                <Pressable
                  key={type ?? 'all'}
                  onPress={() => setFilterType(type)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderCurve: 'continuous',
                    backgroundColor: isSelected ? Colors.accent : Colors.inputBg,
                    borderWidth: 1,
                    borderColor: isSelected ? Colors.accent : Colors.inputBorder,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 13,
                      color: isSelected ? Colors.textPrimary : Colors.textSecondary,
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </FilterSection>

        {/* Rating filter */}
        <FilterSection title="Mindestbewertung">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <StarRating rating={filterMinRating} size={28} editable onChange={setFilterMinRating} />
            {filterMinRating > 0 && (
              <Pressable
                onPress={() => setFilterMinRating(0)}
                hitSlop={8}
                style={({ pressed }) => ({
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  backgroundColor: Colors.danger + '20',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Ionicons name="close" size={14} color={Colors.danger} />
              </Pressable>
            )}
          </View>
        </FilterSection>

        {/* Category filter */}
        <FilterSection title="Kategorien">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {categories.map((cat) => {
              const isSelected = filterCategories.includes(cat.id);
              return (
                <Pressable key={cat.id} onPress={() => toggleFilterCategory(cat.id)}>
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 14,
                      borderCurve: 'continuous',
                      backgroundColor: isSelected ? cat.color : 'transparent',
                      borderWidth: 1.5,
                      borderColor: isSelected ? cat.color : cat.color + '60',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.medium,
                        fontSize: 13,
                        color: isSelected ? Colors.textPrimary : cat.color,
                      }}
                    >
                      {cat.name}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </FilterSection>

        {/* Favorite filter */}
        <FilterSection title="Favoriten">
          <Pressable
            onPress={() => setFilterFavorite(!filterFavorite)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 10,
              borderCurve: 'continuous',
              backgroundColor: filterFavorite ? Colors.accent + '20' : Colors.inputBg,
              borderWidth: 1,
              borderColor: filterFavorite ? Colors.accent + '60' : Colors.inputBorder,
              alignSelf: 'flex-start',
            }}
          >
            <Ionicons
              name={filterFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={filterFavorite ? Colors.accent : Colors.textSecondary}
            />
            <Text
              style={{
                fontFamily: Fonts.medium,
                fontSize: 13,
                color: filterFavorite ? Colors.accent : Colors.textSecondary,
              }}
            >
              Nur Favoriten
            </Text>
          </Pressable>
        </FilterSection>

        {/* Studio filter */}
        {availableStudios.length > 0 && (
          <FilterSection title="Studio">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ gap: 8 }}
            >
              <Pressable
                onPress={() => setFilterStudio(null)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 10,
                  borderCurve: 'continuous',
                  backgroundColor: !filterStudio ? Colors.accent : Colors.inputBg,
                  borderWidth: 1,
                  borderColor: !filterStudio ? Colors.accent : Colors.inputBorder,
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 13,
                    color: !filterStudio ? Colors.textPrimary : Colors.textSecondary,
                  }}
                >
                  Alle
                </Text>
              </Pressable>
              {availableStudios.map((studio) => {
                const isSelected = filterStudio === studio;
                return (
                  <Pressable
                    key={studio}
                    onPress={() => setFilterStudio(isSelected ? null : studio)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                      borderRadius: 10,
                      borderCurve: 'continuous',
                      backgroundColor: isSelected ? Colors.accent : Colors.inputBg,
                      borderWidth: 1,
                      borderColor: isSelected ? Colors.accent : Colors.inputBorder,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.medium,
                        fontSize: 13,
                        color: isSelected ? Colors.textPrimary : Colors.textSecondary,
                      }}
                    >
                      {studio}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </FilterSection>
        )}

        {/* Year range filter */}
        <FilterSection title="Jahr">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontFamily: Fonts.regular, fontSize: 11, color: Colors.textSecondary }}>Von</Text>
              <TextInput
                value={filterYearMin}
                onChangeText={setFilterYearMin}
                placeholder="Min"
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
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: Colors.inputBorder,
                }}
              />
            </View>
            <Text style={{ fontFamily: Fonts.regular, fontSize: 14, color: Colors.textSecondary, marginTop: 16 }}>–</Text>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontFamily: Fonts.regular, fontSize: 11, color: Colors.textSecondary }}>Bis</Text>
              <TextInput
                value={filterYearMax}
                onChangeText={setFilterYearMax}
                placeholder="Max"
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
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: Colors.inputBorder,
                }}
              />
            </View>
          </View>
        </FilterSection>
      </FilterBottomSheet>
    </View>
  );
}
