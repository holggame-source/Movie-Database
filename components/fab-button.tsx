import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface FabButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function FabButton({ onPress, icon = 'add' }: FabButtonProps) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: Colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
          boxShadow: '0 4px 20px rgba(233, 69, 96, 0.4)',
        })}
      >
        <Ionicons name={icon} size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
