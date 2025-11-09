import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import EventModal from '@/components/event-modal';
import BottomPanel from '@/components/bottom-panel/bottom-panel'; 


type InfoBoxType = {show_name: string, artist: string, date: string, time: string, location: string, genre: string, image: string;};

function InfoBox({show_name, artist, date, time, location, genre, image, onPress}: InfoBoxType & { onPress: () => void }) {
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
          {show_name}
        </Text>

        {/* Artist */}
        <Text style={{ position: 'absolute', top: 27, left: 15, fontSize: 16, color: 'white'}}>
          {artist}
        </Text>

        {/* Location */}
        <View style={{ position: 'absolute', bottom: 63, left: 15, flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="map-marker" size={15} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>{location}</Text>
        </View>

        {/* Date */}
        <View style={{ position: 'absolute', bottom: 44, left: 13, flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="calendar" size={14} color="white" />
          <Text style={{fontSize: 14, color: 'white', marginLeft: 5}}>{date}</Text>
        </View>

        {/* Time */}
        <View style={{ position: 'absolute', bottom: 25, left: 13, flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="clock-o" size={14} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>{time}</Text>
        </View>

        {/* Genre */}
        <View style={{ position: 'absolute', bottom: 7, left: 11, flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="music" size={14} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6}}>{genre}</Text>
        </View>

        {/* Photo rectangle */}
        <Image
          source={{ uri: image }} 
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

  const eventList = [
    {show_name: "The Art of Loving", artist: "Olivia Dean", date: "Dec 3", time: "8:00pm", location: "FirstOntario Hall", genre: "Pop", image: "https://hips.hearstapps.com/hmg-prod/images/lead-press-2-68e815b83e780.jpg?crop=1.00xw:0.653xh;0,0.0410xh&resize=1120:*", description: "This is a description."},
    {show_name: "No Hard Feelings", artist: "The Beaches", date: "Dec 6", time: "8:00pm", location: "TD Coliseum", genre: "Rock", image: "https://i.scdn.co/image/ab6761610000e5ebc011b6c30a684a084618e20b", description: "This is a description."},
    {show_name: "World Tour", artist: "The Neighbourhood", date: "Dec 12", time: "7:00pm", location: "FirstOntario Hall", genre: "Rock", image: "https://media.pitchfork.com/photos/5a9f0c13b848c0268b2016bb/1:1/w_450%2Cc_limit/The%2520Neighbourhood.jpg", description: "This is a description."},
    {show_name: "Unreal Earth Tour", artist: "Hozier", date: "Dec 13", time: "6:00pm", location: "FirstOntario Hall", genre: "Rock", image: "https://s1.ticketm.net/dam/a/9fe/d6cc61a9-9850-4e4b-9a7e-893c63c629fe_RETINA_PORTRAIT_3_2.jpg", description: "This is a description."},
    {show_name: "World Tour", artist: "Jonas Brothers", date: "Dec 14", time: "7:00pm", location: "TD Coliseum", genre: "Pop", image: "https://s1.ticketm.net/dam/a/257/0f1a51cd-670d-41ca-bb6f-775ea30f6257_RETINA_PORTRAIT_3_2.jpg", description: "This is a description."}
  ]

  return (
    <View className="flex-1 flex-col justify-start items-center bg-[#FFF0E2]">
      <ScrollView contentContainerStyle={{paddingTop: 120, paddingBottom: 150, alignItems: 'center'}}>
        {eventList.map((event, index) => (
          <InfoBox
            key={index}
            {...event}
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
