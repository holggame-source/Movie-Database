import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface AlternateFieldListProps {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
}

export function AlternateFieldList({ label, placeholder, values, onChange }: AlternateFieldListProps) {
  const handleAdd = () => {
    onChange([...values, '']);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, text: string) => {
    const updated = [...values];
    updated[index] = text;
    onChange(updated);
  };

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>
        {label}
      </Text>

      {values.map((value, index) => (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <TextInput
              value={value}
              onChangeText={(text) => handleUpdate(index, text)}
              placeholder={placeholder}
              placeholderTextColor={Colors.textSecondary}
              style={{
                fontFamily: Fonts.regular,
                fontSize: 15,
                color: Colors.textPrimary,
                backgroundColor: Colors.inputBg,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: Colors.inputBorder,
              }}
            />
          </View>
          <Pressable
            onPress={() => handleRemove(index)}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: Colors.danger + '20',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="close" size={18} color={Colors.danger} />
          </Pressable>
        </View>
      ))}

      <Pressable
        onPress={handleAdd}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 10,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: Colors.accent + '50',
          borderStyle: 'dashed',
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Ionicons name="add-circle-outline" size={18} color={Colors.accent} />
        <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.accent }}>
          {label} hinzufügen
        </Text>
      </Pressable>
    </View>
  );
}
