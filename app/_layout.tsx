import { Stack } from 'expo-router';
import { AuthProvider } from './AuthContext';

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
        </AuthProvider>
    );
}