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

const HAMILTON = { latitude: 43.2557, longitude: -79.8711, latitudeDelta: 0.04, longitudeDelta: 0.04 };

export default function MapScreen() {
  const [range, setRange] = useState<[number, number]>([10, 70]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventLimit = 20;

  // this will fetch venues from the backend when the page is loaded or range changes
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<EventList>(`api/events?limit=${eventLimit}&min_cost=${range[0]}&max_cost=${range[1]}`,
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
            coordinate={{ // temp using random coordinates near Hamilton center, latitude and longitude should be NOT NULL in future
              latitude: typeof e.venues?.latitude === 'number'
                ? e.venues.latitude
                : getRandomCoordinate(43.25, 0.01),
              longitude: typeof e.venues?.longitude === 'number'
                ? e.venues.longitude
                : getRandomCoordinate(-79.88, 0.01),
            }}
            title={e.title}
            // description={`${formatEventDateTime(e.start_time)} • ${e.description}`}
            onPress={() => {
              setSelectedEvent(e);
              setModalVisible(true);
            }}
          />
          ))}
        </MapView>

        <EventModal visible={modalVisible} onClose={() => setModalVisible(false)} data={selectedEvent}/>
    
        {/* Bottom panel */}
        <BottomPanel range={range} setRange={setRange} />
      </View>
      
    </SafeAreaView>
  );
}
