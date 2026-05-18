import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { SearchBar } from '@/components/search-bar';
import { ActressCard } from '@/components/actress-card';
import { EmptyState } from '@/components/empty-state';
import { FabButton } from '@/components/fab-button';
import { FilterButton } from '@/components/filter-button';
import { FilterBottomSheet } from '@/components/filter-bottom-sheet';
import { FilterSection } from '@/components/filter-section';

export default function ActressesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const actresses = useAppStore((s) => s.actresses);
  const films = useAppStore((s) => s.films);
  const categories = useAppStore((s) => s.categories);

  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  // Filter states
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterNationality, setFilterNationality] = useState<string | null>(null);

  // Get unique nationalities from existing actresses
  const availableNationalities = useMemo(() => {
    const nationalities = new Set<string>();
    actresses.forEach((a) => {
      if (a.nationality) nationalities.add(a.nationality);
    });
    return Array.from(nationalities).sort();
  }, [actresses]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterCategories.length > 0) count++;
    if (filterNationality) count++;
    return count;
  }, [filterCategories, filterNationality]);

  const resetFilters = () => {
    setFilterCategories([]);
    setFilterNationality(null);
  };

  const toggleFilterCategory = (id: string) => {
    setFilterCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const filteredActresses = useMemo(() => {
    let result = actresses;

    // Search (name + alternate names)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) =>
        a.name.toLowerCase().includes(q) ||
        (a.alternateNames?.some((alt) => alt.toLowerCase().includes(q)) ?? false)
      );
    }

    // Category filter (actress appears in films with ALL selected categories)
    if (filterCategories.length > 0) {
      const actressIdsInCategories = new Set(
        films
          .filter((f) => filterCategories.every((catId) => f.categoryIds.includes(catId)))
          .flatMap((f) => f.actressIds)
      );
      result = result.filter((a) => actressIdsInCategories.has(a.id));
    }

    // Nationality filter
    if (filterNationality) {
      result = result.filter((a) => a.nationality === filterNationality);
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [actresses, films, search, filterCategories, filterNationality]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 12,
        }}
      >
        <Text style={{ fontFamily: Fonts.bold, fontSize: 28, color: Colors.textPrimary }}>
          Darstellerinnen
        </Text>
      </View>

      {/* Search + Filter row */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Suche..." />
        </View>
        <FilterButton onPress={() => setShowFilter(true)} activeCount={activeFilterCount} />
      </View>

      {/* Actress grid */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filteredActresses.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title="Keine Darstellerinnen"
            subtitle={activeFilterCount > 0 ? 'Versuche andere Filter' : 'Füge deine erste Darstellerin hinzu'}
          />
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {filteredActresses.map((actress) => (
              <View key={actress.id} style={{ width: '47%' }}>
                <ActressCard actress={actress} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <FabButton onPress={() => router.push('/actresses/add' as any)} />

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onReset={resetFilters}
        activeCount={activeFilterCount}
      >
        {/* Category filter */}
        <FilterSection title="Kategorie">
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

        {/* Nationality filter */}
        {availableNationalities.length > 0 && (
          <FilterSection title="Nationalität">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ gap: 8 }}
            >
              <Pressable
                onPress={() => setFilterNationality(null)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 10,
                  borderCurve: 'continuous',
                  backgroundColor: !filterNationality ? Colors.accent : Colors.inputBg,
                  borderWidth: 1,
                  borderColor: !filterNationality ? Colors.accent : Colors.inputBorder,
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 13,
                    color: !filterNationality ? Colors.textPrimary : Colors.textSecondary,
                  }}
                >
                  Alle
                </Text>
              </Pressable>
              {availableNationalities.map((nat) => {
                const isSelected = filterNationality === nat;
                return (
                  <Pressable
                    key={nat}
                    onPress={() => setFilterNationality(isSelected ? null : nat)}
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
                      {nat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </FilterSection>
        )}
      </FilterBottomSheet>
    </View>
  );
}
