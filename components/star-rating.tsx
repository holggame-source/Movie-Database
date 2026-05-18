import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface StarRatingProps {
  rating: number;
  size?: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ rating, size = 18, editable = false, onChange }: StarRatingProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => editable && onChange?.(star)}
          hitSlop={editable ? 8 : 0}
          disabled={!editable}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? Colors.star : Colors.starEmpty}
          />
        </Pressable>
      ))}
    </View>
  );
}
