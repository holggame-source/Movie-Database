import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [error, setError] = useState<string>('Lädt...');

  useEffect(() => {
    const run = async () => {
      try {
        setError('Schritt 1: GestureHandler...');
        const { GestureHandlerRootView } = await import('react-native-gesture-handler');
        
        setError('Schritt 2: SafeArea...');
        const { SafeAreaProvider } = await import('react-native-safe-area-context');
        
        setError('Schritt 3: Colors...');
        const { Colors } = await import('@/constants/Colors');
        
        setError('Schritt 4: Store...');
        const store = await import('@/store');
        
        setError('✅ Alles OK - starte App...');
        await SplashScreen.hideAsync();
        
      } catch (e: any) {
        setError('❌ FEHLER: ' + e.message);
        await SplashScreen.hideAsync();
      }
    };
    run();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 20 }}>
      <ScrollView>
        <Text style={{ color: '#fff', fontSize: 16 }}>{error}</Text>
      </ScrollView>
    </View>
  );
}
