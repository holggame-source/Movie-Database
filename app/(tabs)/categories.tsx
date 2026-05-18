import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { SearchBar } from '@/components/search-bar';
import { FabButton } from '@/components/fab-button';
import { EmptyState } from '@/components/empty-state';

type SortOption = 'a-z' | 'z-a' | 'films' | 'actresses';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'a-z', label: 'A–Z' },
  { key: 'z-a', label: 'Z–A' },
  { key: 'films', label: 'Filme' },
  { key: 'actresses', label: 'Darst.' },
];

const PRESET_COLORS = [
  '#E94560', '#FF6B35', '#7B68EE', '#00CED1', '#32CD32',
  '#FF69B4', '#DA70D6', '#FFD700', '#87CEEB', '#FF4500',
];

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const categories = useAppStore((s) => s.categories);
  const films = useAppStore((s) => s.films);
  const addCategory = useAppStore((s) => s.addCategory);
  const deleteCategory = useAppStore((s) => s.deleteCategory);
  const updateCategory = useAppStore((s) => s.updateCategory);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Filter and sort states
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('a-z');

  // Compute film/actress counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, { filmCount: number; actressCount: number }> = {};
    categories.forEach((cat) => {
      const catFilms = films.filter((f) => f.categoryIds.includes(cat.id));
      const actressSet = new Set(catFilms.flatMap((f) => f.actressIds));
      counts[cat.id] = { filmCount: catFilms.length, actressCount: actressSet.size };
    });
    return counts;
  }, [categories, films]);

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }

    // Sort
    switch (sortBy) {
      case 'a-z':
        result.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        break;
      case 'z-a':
        result.sort((a, b) => b.name.localeCompare(a.name, 'de'));
        break;
      case 'films':
        result.sort((a, b) => (categoryCounts[b.id]?.filmCount || 0) - (categoryCounts[a.id]?.filmCount || 0));
        break;
      case 'actresses':
        result.sort((a, b) => (categoryCounts[b.id]?.actressCount || 0) - (categoryCounts[a.id]?.actressCount || 0));
        break;
    }

    return result;
  }, [categories, search, sortBy, categoryCounts]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory({ name: newName.trim(), color: newColor });
    setNewName('');
    setNewColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    setShowAdd(false);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Kategorie löschen',
      `"${name}" wirklich löschen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: () => deleteCategory(id) },
      ]
    );
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      updateCategory(id, { name: editName.trim() });
    }
    setEditingId(null);
    setEditName('');
  };

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
          Kategorien
        </Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Kategorie suchen..." />
      </View>

      {/* Sort options */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: Fonts.medium, fontSize: 12, color: Colors.textSecondary }}>
            Sortierung:
          </Text>
          {SORT_OPTIONS.map((option) => {
            const isSelected = sortBy === option.key;
            return (
              <Pressable
                key={option.key}
                onPress={() => setSortBy(option.key)}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 8,
                  borderCurve: 'continuous',
                  backgroundColor: isSelected ? Colors.accent : Colors.inputBg,
                  borderWidth: 1,
                  borderColor: isSelected ? Colors.accent : Colors.inputBorder,
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 12,
                    color: isSelected ? Colors.textPrimary : Colors.textSecondary,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Add category form */}
      {showAdd && (
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 16,
            backgroundColor: Colors.card,
            borderRadius: 14,
            borderCurve: 'continuous',
            padding: 16,
            gap: 12,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
          }}
        >
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Kategoriename"
            placeholderTextColor={Colors.textSecondary}
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
            autoFocus
          />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {PRESET_COLORS.map((color) => (
              <Pressable
                key={color}
                onPress={() => setNewColor(color)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: color,
                  borderWidth: newColor === color ? 3 : 0,
                  borderColor: Colors.textPrimary,
                }}
              />
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
            <Pressable
              onPress={() => setShowAdd(false)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontFamily: Fonts.medium, fontSize: 14, color: Colors.textSecondary }}>
                Abbrechen
              </Text>
            </Pressable>
            <Pressable
              onPress={handleAdd}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: Colors.accent,
              }}
            >
              <Text style={{ fontFamily: Fonts.medium, fontSize: 14, color: Colors.textPrimary }}>
                Hinzufügen
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Category list */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filteredCategories.length === 0 ? (
          <EmptyState
            icon="pricetags-outline"
            title={search.trim() ? 'Keine Ergebnisse' : 'Keine Kategorien'}
            subtitle={search.trim() ? 'Versuche einen anderen Suchbegriff' : 'Erstelle deine erste Kategorie'}
          />
        ) : (
          filteredCategories.map((cat) => {
            const counts = categoryCounts[cat.id] || { filmCount: 0, actressCount: 0 };

            return (
              <View
                key={cat.id}
                style={{
                  backgroundColor: Colors.card,
                  borderRadius: 12,
                  borderCurve: 'continuous',
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  borderWidth: 1,
                  borderColor: Colors.cardBorder,
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: cat.color,
                  }}
                />

                {editingId === cat.id ? (
                  <TextInput
                    value={editName}
                    onChangeText={setEditName}
                    onBlur={() => handleSaveEdit(cat.id)}
                    onSubmitEditing={() => handleSaveEdit(cat.id)}
                    autoFocus
                    style={{
                      flex: 1,
                      fontFamily: Fonts.medium,
                      fontSize: 15,
                      color: Colors.textPrimary,
                      backgroundColor: Colors.inputBg,
                      borderRadius: 6,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                    }}
                  />
                ) : (
                  <Pressable
                    onPress={() => {
                      setEditingId(cat.id);
                      setEditName(cat.name);
                    }}
                    style={{ flex: 1 }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.medium,
                        fontSize: 15,
                        color: Colors.textPrimary,
                      }}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                )}

                <Text
                  style={{
                    fontFamily: Fonts.regular,
                    fontSize: 12,
                    color: Colors.textSecondary,
                  }}
                >
                  {counts.filmCount} Filme · {counts.actressCount} Darst.
                </Text>

                <Pressable onPress={() => handleDelete(cat.id, cat.name)} hitSlop={12}>
                  <Ionicons name="trash-outline" size={18} color={Colors.textSecondary} />
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>

      <FabButton onPress={() => setShowAdd(true)} />
    </View>
  );
}
