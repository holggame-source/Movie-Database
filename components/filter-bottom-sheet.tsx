import { useRef, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onReset: () => void;
  activeCount: number;
  children: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function FilterBottomSheet({ visible, onClose, onReset, activeCount, children }: FilterBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 25,
          stiffness: 300,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity]);

  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
      {/* Backdrop */}
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity }}>
        <Pressable
          onPress={onClose}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}
        />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: SCREEN_HEIGHT * 0.75,
          backgroundColor: Colors.card,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          transform: [{ translateY }],
          borderWidth: 1,
          borderBottomWidth: 0,
          borderColor: Colors.cardBorder,
        }}
      >
        {/* Handle */}
        <View style={{ alignItems: 'center', paddingTop: 12 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.textSecondary + '40' }} />
        </View>

        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 12,
          }}
        >
          <Text style={{ fontFamily: Fonts.bold, fontSize: 20, color: Colors.textPrimary }}>
            Filter
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {activeCount > 0 && (
              <Pressable
                onPress={onReset}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: Colors.danger + '20',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Ionicons name="refresh" size={14} color={Colors.danger} />
                <Text style={{ fontFamily: Fonts.medium, fontSize: 12, color: Colors.danger }}>
                  Zurücksetzen
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={({ pressed }) => ({
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: Colors.inputBg,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons name="close" size={18} color={Colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20, gap: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
