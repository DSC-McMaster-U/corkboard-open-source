import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function ShowDetailsPage() {
  const { 
    showName, 
    description, 
    start_time, 
    cost, 
    artist,
    image,
    venue_name,
    venue_address,
    source_url 
  } = useLocalSearchParams();


  // Format date to be more readable
  const formatDate = (dateString: string | string[]) => {
    const date = new Date(dateString as string);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <>
      <StatusBar style='light'/>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header with back button and optional image */}
      <View className='bg-accent'>
        {image ? (
          <View className='relative h-[35vh]'>
            <Image 
              source={{ uri: image as string }} 
              className='w-full h-full'
              resizeMode='cover'
            />
            <View className='absolute inset-0 bg-black/50' />
            <TouchableOpacity 
              onPress={() => router.back()} 
              className='absolute top-14 left-5 bg-black/60 rounded-full p-2.5'
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View className='absolute bottom-0 left-0 right-0 px-6 pb-6'>
              <Text className='text-white font-bold text-3xl leading-tight mb-2'>
                {showName}
              </Text>
              {artist && (
                <Text className='text-white/95 text-xl font-medium'>{artist}</Text>
              )}
            </View>
          </View>
        ) : (
          <View className='px-6 py-6 h-[28vh] justify-between'>
            <TouchableOpacity onPress={() => router.back()} className='mt-12'>
              <Ionicons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
            <View>
              <Text className='text-background font-bold text-4xl leading-tight mb-2'>
                {showName}
              </Text>
              {artist && (
                <Text className='text-background/95 text-2xl font-medium'>{artist}</Text>
              )}
            </View>
          </View>
        )}
      </View>

      <View className='bg-background flex-1'>
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          {/* Event Details */}
          <View className='px-6 py-8 border-b border-secondary/50'>
            <View className='flex-row items-start mb-5'>
              <View className='mt-0.5'>
                <Ionicons name="calendar-outline" size={22} color="#9ca3af" />
              </View>
              <Text className='text-foreground text-base ml-4 flex-1 leading-relaxed'>
                {start_time ? formatDate(start_time) : 'Date TBA'}
              </Text>
            </View>
            
            <View className='flex-row items-start mb-5'>
              <View className='mt-0.5'>
                <Ionicons name="location-outline" size={22} color="#9ca3af" />
              </View>
              <View className='ml-4 flex-1'>
                <Text className='text-foreground text-base font-semibold leading-relaxed'>
                  {venue_name || 'Venue TBA'}
                </Text>
                {venue_address && (
                  <Text className='text-muted-foreground text-sm mt-1.5 leading-relaxed'>
                    {venue_address}
                  </Text>
                )}
              </View>
            </View>

            {cost && (
              <View className='flex-row items-center'>
                <Ionicons name="cash-outline" size={22} color="#9ca3af" />
                <Text className='text-foreground text-base ml-4 font-semibold'>
                  ${parseFloat(cost as string).toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          {/* About */}
          {description && (
            <View className='px-6 py-8'>
              <Text className='text-foreground text-2xl font-bold mb-4'>
                About This Event
              </Text>
              <Text className='text-muted-foreground text-base leading-7'>
                {description}
              </Text>
            </View>
          )}

          {/* Spacer for button */}
          <View className='h-24' />
        </ScrollView>

        {/* Fixed Get Tickets Button */}
        <View className='absolute bottom-0 left-0 right-0 bg-background px-6 py-5 border-t border-secondary/50'>
          <TouchableOpacity 
            className='bg-primary py-4 rounded-full shadow-lg'
            onPress={() => {
              // Handle ticket purchase - could open source_url
              if (source_url) {
                // Add your navigation logic here
              }
            }}
          >
            <Text className='text-foreground font-bold text-center text-lg'>
              Get Tickets
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}