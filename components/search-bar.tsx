import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Suche...' }: SearchBarProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBg,
        borderRadius: 12,
        borderCurve: 'continuous',
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
      }}
    >
      <Ionicons name="search" size={18} color={Colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        style={{
          flex: 1,
          fontFamily: Fonts.regular,
          fontSize: 15,
          color: Colors.textPrimary,
          padding: 0,
        }}
      />
    </View>
  );
}
