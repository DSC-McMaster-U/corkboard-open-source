import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import EventModal from '@/components/event-modal';
import BottomPanel from '@/components/bottom-panel/bottom-panel'; 
import type { EventData, EventList } from "@/constants/types";
import { formatEventDateTimeToDate, formatEventDateTimeToTime } from "@/scripts/helpers";
import { apiFetch } from "@/api/api";


type InfoBoxProps = {
  event: EventData;
  onPress: () => void;
}

type InfoBoxType = {show_name: string, artist: string, date: string, time: string, location: string, genre: string, image: string;};


function InfoBox({ event, onPress }: InfoBoxProps) {
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
          {"Artist"}
        </Text>

        {/* Location */}
        <View style={{ position: 'absolute', bottom: 63, left: 15, flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="map-marker" size={15} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>{event.venue_id}</Text>
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
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6}}>{"genre"}</Text>
        </View>

        {/* Photo rectangle */}
        <Image
          source={{ uri: "https://www.adobe.com/creativecloud/photography/type/media_15955bf89f635a586d897b5c35f7a447b495f6ed7.jpg?width=1200&format=pjpg&optimize=medium" }} 
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
          const res = await apiFetch<EventList>(`/events?limit=${eventLimit}&min_cost=${range[0]}&max_cost=${range[1]}`,
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



  /*
  const eventList = [
    {show_name: "The Art of Loving", artist: "Olivia Dean", date: "Dec 3", time: "8:00pm", location: "FirstOntario Hall", genre: "Pop", image: "https://hips.hearstapps.com/hmg-prod/images/lead-press-2-68e815b83e780.jpg?crop=1.00xw:0.653xh;0,0.0410xh&resize=1120:*", description: "This is a description."},
    {show_name: "No Hard Feelings", artist: "The Beaches", date: "Dec 6", time: "8:00pm", location: "TD Coliseum", genre: "Rock", image: "https://i.scdn.co/image/ab6761610000e5ebc011b6c30a684a084618e20b", description: "This is a description."},
    {show_name: "World Tour", artist: "The Neighbourhood", date: "Dec 12", time: "7:00pm", location: "FirstOntario Hall", genre: "Rock", image: "https://media.pitchfork.com/photos/5a9f0c13b848c0268b2016bb/1:1/w_450%2Cc_limit/The%2520Neighbourhood.jpg", description: "This is a description."},
    {show_name: "Unreal Earth Tour", artist: "Hozier", date: "Dec 13", time: "6:00pm", location: "FirstOntario Hall", genre: "Rock", image: "https://s1.ticketm.net/dam/a/9fe/d6cc61a9-9850-4e4b-9a7e-893c63c629fe_RETINA_PORTRAIT_3_2.jpg", description: "This is a description."},
    {show_name: "World Tour", artist: "Jonas Brothers", date: "Dec 14", time: "7:00pm", location: "TD Coliseum", genre: "Pop", image: "https://s1.ticketm.net/dam/a/257/0f1a51cd-670d-41ca-bb6f-775ea30f6257_RETINA_PORTRAIT_3_2.jpg", description: "This is a description."}
  ]
    */

  return (
    <View className="flex-1 flex-col justify-start items-center bg-[#FFF0E2]">
      <ScrollView contentContainerStyle={{paddingTop: 120, paddingBottom: 150, alignItems: 'center'}}>
        
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

  );
}
