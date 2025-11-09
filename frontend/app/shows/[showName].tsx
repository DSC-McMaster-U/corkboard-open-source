import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShowDetailsPage() {
  const { showName } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className='flex-1 bg-background' edges={['top']}>
        {/* Header with back button */}
        <View className='flex-row items-center px-4 py-4'>
          <TouchableOpacity onPress={() => router.back()} className='mr-4'>
            <Ionicons name="arrow-back" size={24} color="text-foreground" />
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1'>
          {/* Event Header */}
          <View className='px-4 py-4'>
            <View className='w-full h-64 rounded-2xl bg-primary mb-4 overflow-hidden justify-center items-center'>
              <Text className='text-white text-8xl'>🎤</Text>
            </View>
            <Text className='text-foreground text-3xl font-bold mb-2'>
              {showName}
            </Text>
            <View className='flex-row items-center mb-4'>
              <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
              <Text className='text-muted-foreground text-sm ml-2'>
                Saturday, Dec 15, 2024 • 8:00 PM
              </Text>
            </View>
            <View className='flex-row items-center mb-6'>
              <Ionicons name="location-outline" size={16} color="#9ca3af" />
              <Text className='text-muted-foreground text-sm ml-2'>
                Madison Square Garden, New York
              </Text>
            </View>
            <TouchableOpacity className='bg-primary py-4 rounded-full'>
              <Text className='text-foreground font-bold text-center text-lg'>
                Get Tickets
              </Text>
            </TouchableOpacity>
          </View>

          {/* About */}
          <View className='px-4 py-6 border-t border-secondary'>
            <Text className='text-foreground text-xl font-bold mb-3'>
              About This Event
            </Text>
            <Text className='text-muted-foreground leading-6'>
              Experience an unforgettable night of live music. Join us for an incredible performance 
              featuring special guests and exclusive surprises. This is a show you won't want to miss!
            </Text>
          </View>

          {/* Lineup */}
          <View className='px-4 py-6 border-t border-secondary'>
            <Text className='text-foreground text-xl font-bold mb-4'>
              Lineup
            </Text>
            {['Headliner', 'Special Guest', 'Opening Act'].map((act, index) => (
              <View key={index} className='flex-row items-center py-3'>
                <View className='w-12 h-12 rounded-full bg-secondary mr-3' />
                <View className='flex-1'>
                  <Text className='text-foreground font-semibold'>
                    {act}
                  </Text>
                  <Text className='text-muted-foreground text-sm'>
                    {index === 0 ? '9:00 PM' : index === 1 ? '8:30 PM' : '8:00 PM'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            ))}
          </View>

          {/* Venue Info */}
          <View className='px-4 py-6 border-t border-secondary'>
            <Text className='text-foreground text-xl font-bold mb-4'>
              Venue Information
            </Text>
            <View className='bg-secondary rounded-xl p-4 mb-3'>
              <Text className='text-foreground font-semibold mb-2'>
                Madison Square Garden
              </Text>
              <Text className='text-muted-foreground text-sm mb-2'>
                4 Pennsylvania Plaza, New York, NY 10001
              </Text>
              <TouchableOpacity className='flex-row items-center mt-2'>
                <Ionicons name="map-outline" size={16} color="#8b5cf6" />
                <Text className='text-primary text-sm ml-2 font-semibold'>
                  Get Directions
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ticket Options */}
          <View className='px-4 py-6 border-t border-secondary mb-8'>
            <Text className='text-foreground text-xl font-bold mb-4'>
              Ticket Options
            </Text>
            {[
              { name: 'VIP Package', price: '$299', perks: 'Meet & Greet, Front Row' },
              { name: 'General Admission', price: '$89', perks: 'Standing Room' },
              { name: 'Balcony Seats', price: '$49', perks: 'Seated' }
            ].map((ticket, index) => (
              <TouchableOpacity 
                key={index}
                className='bg-secondary rounded-xl p-4 mb-3 flex-row items-center'
              >
                <View className='flex-1'>
                  <Text className='text-foreground font-semibold mb-1'>
                    {ticket.name}
                  </Text>
                  <Text className='text-muted-foreground text-sm'>
                    {ticket.perks}
                  </Text>
                </View>
                <Text className='text-primary font-bold text-lg'>
                  {ticket.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
