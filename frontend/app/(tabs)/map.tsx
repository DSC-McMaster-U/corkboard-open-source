import { useState, useEffect, use } from "react";
import { View, Text, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomPanel from '@/components/bottom-panel/bottom-panel'; 
import EventModal from '@/components/event-modal'; 
import { apiFetch } from "@/api/api";
import { EventData, EventList } from "@/constants/types";
import { formatEventDateTime } from "@/scripts/helpers";
// import { } from 'expo-router';

const HAMILTON = { latitude: 43.2557, longitude: -79.8711, latitudeDelta: 0.08, longitudeDelta: 0.08 };

const venues = [
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
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventLimit = 4;

  // this will fetch venues from the backend when the page is loaded or range changes
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<EventList>(`/events?limit=${eventLimit}&min_cost=${range[0]}&max_cost=${range[1]}`,
          { signal: controller.signal}
        );
        if (isMounted) {
          //console.log("Events received:", res.events);
          setEvents(res.events || []);
        }
      } catch (err: any) {
        if (isMounted && err.name !== "AbortError") {
          setError(err.message || "Failed to fetch events");
          console.error("Error fetching events:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Debounce: wait 300ms after range changes before fetching
    const timer = setTimeout(fetchEvents, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
      isMounted = false;
    };
  }, [range]);

  // Helper function to generate random coordinates around Hamilton
  const getRandomCoordinate = (base: number, offset: number) => base + Math.random() * offset;

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
          {events.map((e, idx) => (
            <Marker
            key={e.id}
            coordinate={{
              latitude: getRandomCoordinate(43.25, 0.01),
              longitude: getRandomCoordinate(-79.88, 0.01),
            }}
            title={e.title}
            description={`${formatEventDateTime(e.start_time)} • ${e.description}`}
          >
            <Callout
              onPress={() => {
                setSelectedEvent(e);
                setModalVisible(true);
              }}
            >
              <View style={{ width: 130 }}>
                <Text style={{ fontWeight: "600" }}>{e.title}</Text>
                <Text>{/*e.artist*/ "placeholder"}</Text>
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
