import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, ActivityIndicator } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import EventModal from '@/components/event-modal';
import BottomPanel from '@/components/bottom-panel/bottom-panel'; 
import type { EventData, EventList } from "@/constants/types";
import { formatEventDateTimeToDate, formatEventDateTimeToTime } from "@/scripts/formatDateHelper";
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
  const venueName = event.venues?.name || "Unspecified venue";
  const artist = event.artist || "Unspecified artist";
  const genresText = event.event_genres && event.event_genres.length > 0
    ? event.event_genres.map((eg) => eg.genres.name).join(", ")
    : "Unspecified";

  return (
    <TouchableOpacity onPress={onPress} className='w-full px-4 mb-3'>
      <View className='w-full flex-row bg-[#3e0000] rounded-xl p-3'>
        {/* left side - text content */}
        <View className='flex-1 justify-between'>
          {/* Title + Artist */}
          <View>
            <Text className='text-white text-lg font-bold' numberOfLines={2}>
              {event.title}
            </Text>
            <Text className='text-neutral-200 text-base mt-0' numberOfLines={1}>
              {artist}
            </Text>
          </View>

          {/* Venue */}
          <View className='flex-row items-center mt-0.5'>
            <FontAwesome name="map-marker" size={14} color="#fff" />
            <Text className='text-white text-sm ml-1.5' numberOfLines={1}>
              {venueName}
            </Text>
          </View>

          {/* Date + time chips */}
          <View className="flex-row items-center mt-0.5">
            <View className="flex-row items-center bg-white/10 rounded-full px-2 py-0.5 mr-1.5">
              <FontAwesome name="calendar" size={11} color="#fff" />
              <Text className="text-white text-xs ml-1">
                {formatEventDateTimeToDate(event.start_time)}
              </Text>
            </View>
            <View className="flex-row items-center bg-white/10 rounded-full px-2 py-0.5">
              <FontAwesome name="clock-o" size={11} color="#fff" />
              <Text className="text-white text-xs ml-1">
                {formatEventDateTimeToTime(event.start_time)}
              </Text>
            </View>
          </View>

          {/* Genres */}
          <View className="mt-1">
            <View className="flex-row items-center">
              <FontAwesome name="music" size={12} color="#fff" />
              <Text
                className="text-white text-xs ml-1.5"
                numberOfLines={1}
              >
                {genresText}
              </Text>
            </View>
          </View>

          {/* Ticket price */}
          {event.cost !== undefined && (
            <View className="flex-row items-center mt-1">
              <FontAwesome name="ticket" size={11} color="#fff" />
              <Text className="text-white text-xs ml-1">
                ${event.cost.toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {/* right side - image */}
        <Image source={{ uri: imageUri }} className='w-[32%] h-full rounded-md' resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );
}

//         {/* Show Name */}
//         <Text
//           style={{ position: 'absolute', top: 10, left: 15, fontSize: 18, fontWeight: 'bold', color: 'white'}}>
//           {event.title}
//         </Text>

//         {/* Artist */}
//         <Text style={{ position: 'absolute', top: 27, left: 15, fontSize: 16, color: 'white'}}>
//           {event.artist ? event.artist : "Unspecified artist"}
//         </Text>

//         {/* Location */}
//         <View style={{ position: 'absolute', bottom: 63, left: 15, flexDirection: 'row', alignItems: 'center' }}>
//           <FontAwesome name="map-marker" size={15} color="white" />
//           <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>
//             {event.venues.name ? event.venues.name : "Unspecified venue"}
//           </Text>
//         </View>

//         {/* Date */}
//         <View style={{ position: 'absolute', bottom: 44, left: 13, flexDirection: 'row', alignItems: 'center' }}>
//           <FontAwesome name="calendar" size={14} color="white" />
//           <Text style={{fontSize: 14, color: 'white', marginLeft: 5}}>{formatEventDateTimeToDate(event.start_time)}</Text>
//         </View>

//         {/* Time */}
//         <View style={{ position: 'absolute', bottom: 25, left: 13, flexDirection: 'row', alignItems: 'center'}}>
//           <FontAwesome name="clock-o" size={14} color="white" />
//           <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>{formatEventDateTimeToTime(event.start_time)}</Text>
//         </View>

//         {/* Genre */}
//         <View style={{ position: 'absolute', bottom: 7, left: 11, flexDirection: 'row', alignItems: 'center' }}>
//           <FontAwesome name="music" size={14} color="white" />
//           <Text style={{ fontSize: 14, color: 'white', marginLeft: 6}}>
//             {event.event_genres && event.event_genres.length > 0
//               ? event.event_genres.map((eg) => eg.genres.name).join(", ")
//               : "Unspecified"
//             }
//           </Text>
//         </View>

//         {/* Photo rectangle */}
//         <Image
//           source={{ uri: imageUri }} 
//           style={{ width: 98, height: 92, borderRadius: 3, position: 'absolute', top: 22, right: 14 }}
//         />
//       </View>
//     </TouchableOpacity>
//   );
// }



export default function EventsScreen() {

  const [range, setRange] = useState<[number, number]>([10, 70]);  // set up state for ticket price slider bar
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // store event object that user clicks
  const [modalVisible, setModalVisible] = useState(false); // modal state to open/close event popup
  const [eventList, setEvents] = useState<EventData[]>([]); // store events from backend
  const [loading, setLoading] = useState(true);  // tracks if data is still being fetched
  const [error, setError] = useState<string | null>(null); // track errors during data fetching

  const eventLimit = 20;

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
            const venueShows = (res.events ?? [])
            .sort((a, b) => {
              const ta = new Date(a.start_time ?? 0).getTime();
              const tb = new Date(b.start_time ?? 0).getTime();

              // push invalid/missing dates to the end
              if (!Number.isFinite(ta) && !Number.isFinite(tb)) return 0;
              if (!Number.isFinite(ta)) return 1;
              if (!Number.isFinite(tb)) return -1;

              return ta - tb;
            });
            setEvents(venueShows);
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
          <Text className="text-xl font-semibold text-white">Corkboard - Shows Near You</Text>
          <View className="w-8 h-8 rounded-full bg-blue-300" />
        </View>
      </View>

      <View className="flex-1 bg-[#FFF0E2]">
        <View className="px-4 py-2 bg-[#FFF0E2] pt-2">
          <View className="self-start bg-[#E3C9AF] px-3 py-1 rounded-full">
            <Text className="text-[12px] font-semibold text-[#411900]">
              {`Showing ${eventList.length} ${eventList.length === 1 ? "event" : "events"}`}{' '}
              <Text className="text-[#6a3f1d]">{`· $${range[0]}–$${range[1]}`}</Text>
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{paddingTop: 4, paddingBottom: 120 }}>
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
        {/* Loading overlay */}
        {loading && (
          <View className="absolute inset-0 justify-center items-center bg-black/40">
            <ActivityIndicator size="large" />
            <Text className="text-white mt-2">Loading events...</Text>
          </View>
        )}

        {/* Error banner */}
        {error && !loading && (
          <View className="absolute inset-x-4 top-5 rounded-lg bg-red-800/90 px-3 py-2">
            <Text className="text-white text-center text-sm">{error}</Text>
          </View>
        )}

        {/* No results banner */}
        {!loading && !error && eventList.length === 0 && (
          <View className="absolute inset-x-4 top-5 rounded-lg bg-black/70 px-3 py-2">
            <Text className="text-white text-center text-sm">
              No events found for this price range.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>

  );
}
