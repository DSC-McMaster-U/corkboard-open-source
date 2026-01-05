import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { EventData, EventList } from '@/constants/types';
import { apiFetch, getImageUrl } from '@/api/api';

export default function VenuePage() {
  const { 
    venueName, 
    venueID, 
    address, 
    created_at, 
    venueType,
    latitude,
    longitude,
    source_url,
    image,
    description
  } = useLocalSearchParams();

  const [shows, setShows] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetching event data from backend
  const eventLimit = 100;
  
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch<EventList>(`api/events?limit=${eventLimit}`,
          { signal: controller.signal}
        );
        if (isMounted) {
          //console.log("Fetched events:", res.events);
          const venueShows = (res.events ?? [])
            .filter((e) => String(e.venues?.id) === String(venueID))
            .sort((a, b) => {
              const ta = new Date(a.start_time ?? 0).getTime();
              const tb = new Date(b.start_time ?? 0).getTime();

              // push invalid/missing dates to the end
              if (!Number.isFinite(ta) && !Number.isFinite(tb)) return 0;
              if (!Number.isFinite(ta)) return 1;
              if (!Number.isFinite(tb)) return -1;

              return ta - tb;
            });
          setShows(venueShows);
          console.log("Fetched events for ", venueName, ":", venueShows)
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
  }, [venueID]);


  const handleOpenSite = async () => {
    if (source_url == null) { return }

    const url = Array.isArray(source_url) ? source_url[0] : source_url;
    if (!url) {
      alert('No URL available.');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        alert('Cannot open the source link.');
      }
    } catch (error) {
      alert('Cannot open the source link.');
      console.warn('Error opening source link:', error);
    }
  };
  
  const normalizedVenueType = Array.isArray(venueType) ? venueType[0] : (venueType ?? '');
  const processedVenueType = normalizedVenueType
    ? normalizedVenueType.charAt(0).toUpperCase() + normalizedVenueType.slice(1)
    : "TBD";

  return (
    <>
      <StatusBar style='light'/>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header with back button and venue name */}
      <View className='bg-accent'>
        <View className='px-6 py-6 h-[28vh] justify-between'>
          <TouchableOpacity onPress={() => router.back()} className='mt-12'>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <View>
            <Text className='text-background font-bold text-4xl leading-tight mb-2'>
              {venueName}
            </Text>
          </View>
        </View>
      </View>

      <View className='bg-background flex-1'>
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          {/* Venue Details */}
          <View className='px-6 py-8 border-b border-secondary/50'>
            
            {/* Adress */}
            <View className='flex-row items-start mb-5'>
              <View className='mt-0.5'>
                <Ionicons name="location-outline" size={22} color="#9ca3af" />
              </View>
              <View className='ml-4 flex-1'>
                <Text className='text-foreground text-base font-semibold leading-relaxed'>
                  {'Adress'}
                </Text>
                <Text className='text-muted-foreground text-sm mt-0 leading-relaxed'>
                  {address || 'TBD'}
                </Text>
              </View>
            </View>

            {/* Venue type */}
            {venueType && (
              <View className='flex-row items-center'>
                <View className='mt-0.5'>
                  <Ionicons name="chatbox-ellipses-outline" size={22} color="#9ca3af" />
                </View>
                <View className='ml-4 flex-1'>
                  <Text className='text-foreground text-base font-semibold leading-relaxed'>
                    {'Venue Type'}
                  </Text>
                  <Text className='text-muted-foreground text-sm mt-0 leading-relaxed'>
                    {processedVenueType}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* About */}
          {description && (
            <View className='px-6 py-8'>
              <Text className='text-foreground text-2xl font-bold mb-4'>
                About This Venue
              </Text>
              <Text className='text-muted-foreground text-base leading-7'>
                {description}
              </Text>
            </View>
          )}

          {/* Upcoming events at venue */}
          {shows && 
            ( loading ? 
              <Text>Loading events...</Text> :
              <View className="px-6 mt-4">
                <Text className="text-foreground text-2xl font-bold mb-3">
                  Upcoming Events
                </Text>

                <View className="flex-row flex-wrap justify-between">
                  {shows.map((e, index) => (
                    <ShowCard key={String(e.id ?? index)} show={e} />
                  ))}
                </View>
              </View>
            )
          }
          
          {/* Map view for location */}

          {/* Spacer for button */}
          <View className='h-24' />
        </ScrollView>

        {/* Fixed Visit Site Button */}
        {source_url && (
          <View className='absolute bottom-0 left-0 right-0 bg-background px-6 py-5 border-t border-secondary/50'>
            <TouchableOpacity 
              className='bg-primary py-4 rounded-full shadow-lg'
              onPress={() => {
                handleOpenSite()
              }}
            >
              <Text className='text-foreground font-bold text-center text-lg'>
                Visit Venue Site
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
      </View>
    </>
  )
}


interface ShowCardProps {
  show: EventData;
}

function ShowCard({ show }: ShowCardProps) {
  const PLACEHOLDER_IMAGE =
    "https://i.scdn.co/image/ab6761610000e5ebc011b6c30a684a084618e20b";
  const imageUri = show.image ? getImageUrl(show.image) : PLACEHOLDER_IMAGE;

  const handlePress = () => {
    router.push({
      pathname: "/shows/[showName]",
      params: {
        showName: show.title,
        artist: show.artist,
        description: show.description,
        start_time: show.start_time,
        cost: show.cost,
        image: show.image,
        venue_name: show.venues?.name,
        venue_address: show.venues?.address,
        source_url: show.source_url,
      },
    });
  };

  return (
    <TouchableOpacity className="w-[48%] mb-5" onPress={handlePress}>
      <View className="rounded-2xl aspect-square mb-2 overflow-hidden bg-neutral-300">
        <Image source={{ uri: imageUri }} className="h-full w-full" resizeMode="cover" />
      </View>

      <Text className="text-foreground font-semibold text-sm" numberOfLines={1}>
        {show.title}
      </Text>

      <Text className="text-foreground/60 text-xs mt-1" numberOfLines={2}>
        {show.description}
      </Text>
    </TouchableOpacity>
  );
}