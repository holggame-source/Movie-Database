import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface FilterButtonProps {
  onPress: () => void;
  activeCount: number;
}

export function FilterButton({ onPress, activeCount }: FilterButtonProps) {
  const isActive = activeCount > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderCurve: 'continuous',
        backgroundColor: isActive ? Colors.accent + '20' : Colors.inputBg,
        borderWidth: 1,
        borderColor: isActive ? Colors.accent + '60' : Colors.inputBorder,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Ionicons name="options-outline" size={16} color={isActive ? Colors.accent : Colors.textSecondary} />
      <Text
        style={{
          fontFamily: Fonts.medium,
          fontSize: 13,
          color: isActive ? Colors.accent : Colors.textSecondary,
        }}
      >
        Filter
      </Text>
      {isActive && (
        <View
          style={{
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: Colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.semiBold,
              fontSize: 11,
              color: Colors.textPrimary,
              fontVariant: ['tabular-nums'],
            }}
          >
            {activeCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
