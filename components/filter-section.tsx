import { View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontFamily: Fonts.semiBold, fontSize: 14, color: Colors.textSecondary }}>
        {title}
      </Text>
      {children}
    </View>
  );
}
