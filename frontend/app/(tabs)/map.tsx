import { useState } from "react";
import { View, Text, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomPanel from '@/components/bottom-panel/bottom-panel'; 

// import { } from 'expo-router';

const HAMILTON = { latitude: 43.2557, longitude: -79.8711, latitudeDelta: 0.08, longitudeDelta: 0.08 };

const zoomFromRegion = (r:{longitudeDelta:number}) =>
  Math.log2(360 / r.longitudeDelta);

const venues = [
  { id: "1", name: "The Art of Loving", lat: 43.2564, lng: -79.8717 },
  { id: "2", name: "Short n' Sweet", lat: 43.2574, lng: -79.8721 },
];

export default function MapScreen() {
  const [range, setRange] = useState<[number, number]>([10, 70]);

  return (
    <SafeAreaView className='bg-[#AE6E4E] flex-1' edges={[ 'top', 'left', 'right' ]}>
      <StatusBar barStyle="light-content" backgroundColor="#411900" />

      {/* Temporary header */}
      <View className="h-16 px-4 justify-end pb-3 bg-[#AE6E4E]">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-white">Shows near you</Text>
          <View className="w-8 h-8 rounded-full bg-blue-300" />
        </View>
      </View>
      
      <View className="flex-1">
        {/* Map */}
        <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE} initialRegion={HAMILTON}>
        {venues.map(v => (
            <Marker
              key={v.id}
              coordinate={{ latitude: v.lat, longitude: v.lng }}
              title={v.name}
            />
          ))}
        </MapView>
    
        {/* Bottom panel */}
        <BottomPanel range={range} setRange={setRange} />
      </View>
      
    </SafeAreaView>
  );
}
