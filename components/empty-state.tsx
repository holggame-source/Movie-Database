import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: Colors.card,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: Colors.cardBorder,
        }}
      >
        <Ionicons name={icon} size={36} color={Colors.accent} />
      </View>
      <Text
        style={{
          fontFamily: Fonts.semiBold,
          fontSize: 18,
          color: Colors.textPrimary,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontFamily: Fonts.regular,
            fontSize: 14,
            color: Colors.textSecondary,
            textAlign: 'center',
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
