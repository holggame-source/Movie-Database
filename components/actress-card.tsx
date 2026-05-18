import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import type { Actress } from '@/store/types';

interface ActressCardProps {
  actress: Actress;
}

export function ActressCard({ actress }: ActressCardProps) {
  const films = useAppStore((s) => s.films);
  const filmCount = films.filter((f) => f.actressIds.includes(actress.id)).length;

  return (
    <View
      style={{
        backgroundColor: Colors.card,
        borderRadius: 14,
        borderCurve: 'continuous',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      }}
    >
      <Link href={`/actresses/${actress.id}` as any} asChild>
        <Pressable>
          {({ pressed }) => (
            <View style={{ alignItems: 'center', padding: 14, gap: 10, opacity: pressed ? 0.85 : 1 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  overflow: 'hidden',
                  backgroundColor: Colors.inputBg,
                  borderWidth: 2,
                  borderColor: Colors.accent + '40',
                }}
              >
                {actress.photoUri ? (
                  <Image
                    source={{ uri: actress.photoUri }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="person" size={32} color={Colors.textSecondary} />
                  </View>
                )}
              </View>

              <Text
                style={{
                  fontFamily: Fonts.semiBold,
                  fontSize: 14,
                  color: Colors.textPrimary,
                  textAlign: 'center',
                }}
                numberOfLines={1}
              >
                {actress.name}
              </Text>

              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 12,
                  color: Colors.textSecondary,
                }}
              >
                {filmCount} {filmCount === 1 ? 'Film' : 'Filme'}
              </Text>
            </View>
          )}
        </Pressable>
      </Link>
    </View>
  );
}
