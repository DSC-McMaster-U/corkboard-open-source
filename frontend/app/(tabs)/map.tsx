import { useState } from "react";
import { View, Text, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomPanel from '@/components/bottom-panel/bottom-panel'; 
import EventModal from '@/components/event-modal'; 

// import { } from 'expo-router';

const HAMILTON = { latitude: 43.2557, longitude: -79.8711, latitudeDelta: 0.08, longitudeDelta: 0.08 };

type EventData = {
  show_name: string;
  artist: string;
  date: string;
  time: string;
  location: string;
  genre: string;
  image: string;
  description: string;
  lat: number;
  lng: number;
};

const venues: EventData[] = [
  {
    show_name: "The Art of Loving",
    artist: "Olivia Dean",
    date: "Dec 3",
    time: "8:00pm",
    location: "FirstOntario Hall",
    genre: "Pop",
    image: "https://hips.hearstapps.com/hmg-prod/images/lead-press-2-68e815b83e780.jpg?crop=1.00xw:0.653xh;0,0.0410xh&resize=1120:*",
    description: "This is a description.",
    lat: 43.2564,
    lng: -79.8717,
  },
  {
    show_name: "No Hard Feelings",
    artist: "The Beaches",
    date: "Dec 6",
    time: "8:00pm",
    location: "TD Coliseum",
    genre: "Rock",
    image: "https://i.scdn.co/image/ab6761610000e5ebc011b6c30a684a084618e20b",
    description: "This is a description.",
    lat: 43.2590,
    lng: -79.8723,
  },
];

export default function MapScreen() {
  const [range, setRange] = useState<[number, number]>([10, 70]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
          {venues.map((v, idx) => (
            <Marker
            key={v.show_name}
            coordinate={{ latitude: v.lat, longitude: v.lng }}
            title={v.show_name}
            description={`${v.date} • ${v.time}`}
          >
            <Callout
              onPress={() => {
                setSelectedEvent(v);
                setModalVisible(true);
              }}
            >
              <View style={{ width: 130 }}>
                <Text style={{ fontWeight: "600" }}>{v.show_name}</Text>
                <Text>{v.artist}</Text>
                <Text style={{ marginTop: 6, textDecorationLine: "underline" }}>More details</Text>
              </View>
            </Callout>
          </Marker>
          ))}
        </MapView>

        <EventModal visible={modalVisible} onClose={() => setModalVisible(false)} data={selectedEvent}/>
    
        {/* Bottom panel */}
        <BottomPanel range={range} setRange={setRange} />
      </View>
      
    </SafeAreaView>
  );
}
