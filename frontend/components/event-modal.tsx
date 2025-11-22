import { Modal, View, Text, TouchableOpacity, Linking, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { EventData } from "@/constants/types";
import { formatEventDateTime, formatEventDateTimeToDate, formatEventDateTimeToTime } from "@/scripts/helpers";
import { getImageUrl } from "@/api/api";

type EventModalProps = {
  visible: boolean;
  onClose: () => void;
  data: EventData | null;
};

const PLACEHOLDER_IMAGE =
  "https://i.scdn.co/image/ab6761610000e5ebc011b6c30a684a084618e20b";

export default function EventModal({ visible, onClose, data }: EventModalProps) {
  //console.log("EventModal data:", data);
  if (!data) return null;

  const imageUri = data.image ? getImageUrl(data.image) : PLACEHOLDER_IMAGE;

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
          {data.title}
        </Text>

        {/* Artist */}
        <Text style={{ position: 'absolute', top: 27, left: 15, fontSize: 18, color: 'white'}}>
          {data.artist ? data.artist : "Unspecified artist"}
        </Text>

        {/* Date */}
        <View style={{position: 'absolute', top: 78, left: 15, flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="calendar" size={14} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>
            {formatEventDateTimeToDate(data.start_time)}
          </Text>
        </View>

        {/* Time */}
        <View style={{ position: 'absolute', top: 98, left: 15, flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="clock-o" size={14} color="white" />
          <Text style={{fontSize: 14, color: 'white', marginLeft: 6}}>
            {formatEventDateTimeToTime(data.start_time)}
          </Text>
        </View>

          {/* Location */}
        <View style={{ position: 'absolute', top: 60, left: 15, flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="map-marker" size={14} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>
            {data.venues.name ? data.venues.name : "Unspecified venue"}
          </Text>
        </View>

          {/* Genre */}
        <View
          style={{ position: 'absolute', top: 115, left: 15, flexDirection: 'row', alignItems: 'center'}}>
          <FontAwesome name="music" size={14} color="white" />
          <Text style={{ fontSize: 14, color: 'white', marginLeft: 6 }}>
            {data.event_genres && data.event_genres.length > 0
              ? data.event_genres.map((eg) => eg.genres.name).join(", ")
              : "Unspecified"
            }
          </Text>
        </View>

        <Image
          source={{ uri: imageUri }} // temp placeholder
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
            <Text>{`Address: ${data.venues.address ? data.venues.address : "Unspecified address."}`}</Text>
            <Text>{`Venue Type: ${data.venues.venue_type ? data.venues.venue_type : "Unspecified type."}`}</Text>
            <Text>{`Ticket Price: ${data.cost !== undefined ? `$${data.cost.toFixed(2)}` : "Unspecified cost."}`}</Text>
            <Text style={{ marginTop: 10 }}>{data.description ? data.description : "No description available."}</Text>
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
