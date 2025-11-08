import { Modal, View, Text, TouchableOpacity, Linking, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";


type EventModalProps = {
  visible: boolean;
  onClose: () => void;
  data: {
    show_name: string;
    artist: string;
    date: string;
    time: string;
    location: string;
    genre: string;
    image: string;
    description: string;
  } | null;
};

export default function EventModal({ visible, onClose, data }: EventModalProps) {
  if (!data) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            width: 360,
            height: 420,
            backgroundColor: "#3e0000",
            borderRadius: 16,
            padding: 20,
            elevation: 5,
          }}
        >
          {/* Show Name */}
        <Text style={{ position: 'absolute', top: 10, left: 15, fontSize: 18, fontWeight: 'bold', color: 'white' }}>
          {data.show_name}
        </Text>

        {/* Artist */}
        <Text style={{ position: 'absolute', top: 27, left: 15, fontSize: 18, color: 'white'}}>
          {data.artist}
        </Text>

        {/* Date */}
        <View style={{position: 'absolute', top: 78, left: 15, flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="calendar" size={14} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>{data.date}</Text>
        </View>

        {/* Time */}
        <View style={{ position: 'absolute', top: 98, left: 15, flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="clock-o" size={14} color="white" />
          <Text style={{fontSize: 14, color: 'white', marginLeft: 6}}>{data.time}</Text>
        </View>

          {/* Location */}
        <View style={{ position: 'absolute', top: 60, left: 15, flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="map-marker" size={14} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>{data.location}</Text>
        </View>

          {/* Genre */}
        <View
          style={{ position: 'absolute', top: 115, left: 15, flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="music" size={14} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>{data.genre}</Text>
        </View>

        <Image
          source={{ uri: data.image }} 
          style={{width: 124, height: 120, borderRadius: 3, position: 'absolute', top: 14, right: 14 }}
        />

        {/* Description Box */}  
        <View
          style={{
            position: 'absolute',
            top: 170,
            left: 20,
            width: 310,
            height: 160,
            backgroundColor: "#FFF0E2",
            borderRadius: 16,
            padding: 20,
            elevation: 5,
          }}>
            <Text>{data.description}</Text>
        </View>

        {/* Open external link button - for tickets */}
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.ticketmaster.com")}
          style={{
            position: "absolute",
            bottom: 15,
            left: 20,
            alignSelf: "center",
            backgroundColor: "#E8894A",
            borderRadius: 8,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Buy Tickets</Text>
        </TouchableOpacity>
        
      
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              bottom: 15,
              right: 20,
              alignSelf: "center",
              backgroundColor: "#3e0000",
              borderRadius: 8,
              paddingHorizontal: 20,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: "white" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}