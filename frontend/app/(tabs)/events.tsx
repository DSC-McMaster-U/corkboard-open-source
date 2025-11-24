import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import EventModal from '@/components/event-modal';
import BottomPanel from '@/components/bottom-panel/bottom-panel'; 
import type { EventData, EventList } from "@/constants/types";
import { formatEventDateTimeToDate, formatEventDateTimeToTime } from "@/scripts/helpers";
import { apiFetch , getImageUrl } from "@/api/api";
import { SafeAreaView } from 'react-native-safe-area-context';


type InfoBoxProps = {
  event: EventData;
  onPress: () => void;
}

const PLACEHOLDER_IMAGE =
  "https://i.scdn.co/image/ab6761610000e5ebc011b6c30a684a084618e20b";


function InfoBox({ event, onPress }: InfoBoxProps) {

  const imageUri = event.image ? getImageUrl(event.image) : PLACEHOLDER_IMAGE;

  return (

    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          width: 360,
          height: 135,
          backgroundColor: '#3e0000',
          borderRadius: 8,
          marginVertical: 4,
          position: 'relative',
        }}
      >

        {/* Show Name */}
        <Text
          style={{ position: 'absolute', top: 10, left: 15, fontSize: 18, fontWeight: 'bold', color: 'white'}}>
          {event.title}
        </Text>

        {/* Artist */}
        <Text style={{ position: 'absolute', top: 27, left: 15, fontSize: 16, color: 'white'}}>
          {event.artist ? event.artist : "Unspecified artist"}
        </Text>

        {/* Location */}
        <View style={{ position: 'absolute', bottom: 63, left: 15, flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="map-marker" size={15} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>
            {event.venues.name ? event.venues.name : "Unspecified venue"}
          </Text>
        </View>

        {/* Date */}
        <View style={{ position: 'absolute', bottom: 44, left: 13, flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="calendar" size={14} color="white" />
          <Text style={{fontSize: 14, color: 'white', marginLeft: 5}}>{formatEventDateTimeToDate(event.start_time)}</Text>
        </View>

        {/* Time */}
        <View style={{ position: 'absolute', bottom: 25, left: 13, flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="clock-o" size={14} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>{formatEventDateTimeToTime(event.start_time)}</Text>
        </View>

        {/* Genre */}
        <View style={{ position: 'absolute', bottom: 7, left: 11, flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="music" size={14} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6}}>
            {event.event_genres && event.event_genres.length > 0
              ? event.event_genres.map((eg) => eg.genres.name).join(", ")
              : "Unspecified"
            }
          </Text>
        </View>

        {/* Photo rectangle */}
        <Image
          source={{ uri: imageUri }} 
          style={{ width: 98, height: 92, borderRadius: 3, position: 'absolute', top: 22, right: 14 }}
        />
      </View>
    </TouchableOpacity>
  );
}



export default function EventsScreen() {

  const [range, setRange] = useState<[number, number]>([10, 70]);  // set up state for ticket price slider bar
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // store event object that user clicks
  const [modalVisible, setModalVisible] = useState(false); // modal state to open/close event popup
  const [eventList, setEvents] = useState<EventData[]>([]); // store events from backend
  const [loading, setLoading] = useState(true);  // tracks if data is still being fetched
  const [error, setError] = useState<string | null>(null); // track errors during data fetching

  const eventLimit = 4;

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
            console.log("Fetched events:", res.events);
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


  return (

    <SafeAreaView className='bg-[#AE6E4E] flex-1' edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#411900" />

      {/* Temporary header */}
      <View className="h-16 px-4 justify-end pb-3 bg-[#AE6E4E]">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-white">Shows near you</Text>
          <View className="w-8 h-8 rounded-full bg-blue-300" />
        </View>
      </View>

      <View className="flex-1 bg-[#FFF0E2]">
        <ScrollView contentContainerStyle={{paddingTop: 20, paddingBottom: 150, alignItems: 'center'}}>
          
          {eventList.map((event) => (
            <InfoBox
              key={event.id} 
              event={event}   
              onPress={() => {
                setSelectedEvent(event);
                setModalVisible(true);
              }}
            />
          ))}
        </ScrollView>
        
        <EventModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          data={selectedEvent}
        />
      
      {/* Bottom panel */}
        <BottomPanel range={range} setRange={setRange}/>
      </View>
    </SafeAreaView>

  );
}
