import { View, Text, TouchableOpacity} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from "react";
import { Link } from 'expo-router';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

const Avatar = () => (
  <Link href="/profile" asChild>
    <TouchableOpacity className="w-10 h-10 rounded-full bg-[#ffffff] items-center justify-center">
      <Text>👤</Text>
    </TouchableOpacity>
  </Link>
);

export default function MapScreen() {
  const snapPoints = useMemo( () => ['25%', '50%'], []); 

  return (
    <View className="flex-1">
      
      {/* Map background */}
      <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE}/>
   
      {/* OVERLAYS */}
      {/* Header card */}
      <View className="absolute inset-x-0 top-0 bg-[#AE6E4E] h-28 px-4 pb-3 justify-end">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-2xl font-bold">Shows near you</Text>
          <Avatar />
        </View>
      </View>

      {/* Bottom panel */}
      <BottomSheet snapPoints={snapPoints} 
        backgroundStyle={{ backgroundColor: '#F6D0AE' }}
        handleIndicatorStyle={{ backgroundColor: '#FFF0E2' }} >
        <BottomSheetView style={{ padding: 16 }} >
          <Text>TODO</Text>
        </BottomSheetView>
      </BottomSheet>

    </View>
  );
}
