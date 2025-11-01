import { View, Text, ScrollView } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

import { Link } from 'expo-router';

type InfoBoxType = {show_name: string, artist: string, date: string, time: string, location: string, genre: string;};

function InfoBox({show_name, artist, date, time, location, genre}: InfoBoxType) {
  return (
    <View
      style={{
        width: 360,
        height: 120,
        backgroundColor: '#3e0000',
        borderRadius: 8,
        marginVertical: 4,
        position: 'relative',
      }}
    >

      {/* Show Name */}
      <Text
        style={{
          position: 'absolute',
          top: 10,
          left: 15,
          fontSize: 18,
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        {show_name}
      </Text>

      {/* Artist */}
      <Text
        style={{
          position: 'absolute',
          top: 27,
          left: 15,
          fontSize: 18,
          color: 'white'
        }}
      >
        {artist}
      </Text>

      {/* Date */}
      <View
        style={{
          position: 'absolute',
          bottom: 25,
          left: 15,
          flexDirection: 'row', // place icon and text side by side
          alignItems: 'center', // vertically align them
        }}
    >
        <FontAwesome name="calendar" size={14} color="white" />
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            marginLeft: 6, // space between icon and text
          }}
        >
          {date}
        </Text>
      </View>

      {/* Time */}
      <View
        style={{
          position: 'absolute',
          bottom: 6,
          left: 15,
          flexDirection: 'row', 
          alignItems: 'center', 
        }}
      >
        <FontAwesome name="clock-o" size={14} color="white" />
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            marginLeft: 6, 
          }}
        >
          {time}
        </Text>
      </View>

      {/* Location */}
      <View
        style={{
          position: 'absolute',
          bottom: 45,
          left: 15,
          flexDirection: 'row', 
          alignItems: 'center', 
        }}
      >
        <FontAwesome name="map-marker" size={14} color="white" />
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            marginLeft: 6, 
          }}
        >
          {location}
        </Text>
      </View>

      {/* Genre */}
      <View
        style={{
          position: 'absolute',
          bottom: 6,
          left: 120,
          flexDirection: 'row', 
          alignItems: 'center', 
        }}
      >
        <FontAwesome name="music" size={14} color="white" />
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            marginLeft: 6, 
          }}
        >
          {genre}
        </Text>
      </View>

      {/* Photo rectangle */}
      <View
      style={{
        width: 98,
        height: 92,
        backgroundColor: '#f8f8f8',
        borderRadius: 3,
        position: 'absolute',
        top: 14,
        right: 14,
      }}
      ></View> 
    </View>
  );
}



export default function EventsScreen() {
  return (
    <View className="flex-1 flex-col justify-start items-center bg-[#FFF0E2]">
      <ScrollView contentContainerStyle={{paddingTop: 120, paddingBottom: 150, alignItems: 'center'}}>
        <InfoBox show_name="Show Name" artist="Artist" date="Dec 3" time="8:00pm" location="Location" genre="genre"/>
        <InfoBox show_name="Show Name" artist="Artist" date="Dec 20" time="8:00pm" location="Location" genre="genre"/>
        <InfoBox show_name="Show Name" artist="Artist" date="Dec 21" time="8:00pm" location="Location" genre="genre"/>
        <InfoBox show_name="Show Name" artist="Artist" date="Dec 24" time="8:00pm" location="Location" genre="genre"/>
        <InfoBox show_name="Show Name" artist="Artist" date="Dec 24" time="8:00pm" location="Location" genre="genre"/>
        <InfoBox show_name="Show Name" artist="Artist" date="Dec 24" time="8:00pm" location="Location" genre="genre"/>
      </ScrollView>
      {/* Rectangle 1 */}
      

    </View>

  );
}
