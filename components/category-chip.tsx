import { View, Text, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface CategoryChipProps {
  name: string;
  color: string;
  selected?: boolean;
  onPress?: () => void;
  small?: boolean;
}

export function CategoryChip({ name, color, selected = false, onPress, small = false }: CategoryChipProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          paddingHorizontal: small ? 10 : 14,
          paddingVertical: small ? 4 : 7,
          borderRadius: 16,
          backgroundColor: selected ? color : 'transparent',
          borderWidth: 1.5,
          borderColor: selected ? color : color + '60',
          borderCurve: 'continuous',
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.medium,
            fontSize: small ? 11 : 13,
            color: selected ? Colors.textPrimary : color,
          }}
        >
          {name}
        </Text>
      </View>
    </Pressable>
  );
}
