import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: 1,
          paddingBottom: insets.bottom || 8,
          paddingTop: 8,
          height: 65 + (insets.bottom || 8),
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: Fonts.medium,
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Filme',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="actresses"
        options={{
          title: 'Darstellerinnen',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Kategorien',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetags" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
