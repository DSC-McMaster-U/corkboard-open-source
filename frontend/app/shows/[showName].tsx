import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function ShowDetailsPage() {
  const { showName, description, start_time, cost } = useLocalSearchParams();

  return (
    <>
      <StatusBar style='light'/>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header with back button */}
      <View className='px-4 py-4 bg-accent h-[24vh] justify-between'>
        <TouchableOpacity onPress={() => router.back()} className='mr-4 mt-12'>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className='mt-3 mb-2 text-background font-semibold text-2xl'>{showName}</Text>
      </View>

      <View className='bg-background flex-1'>
        <ScrollView className='flex-1'>

          {/* About */}
          <View className='px-4 py-6 border-t border-secondary'>
            <Text className='text-foreground text-xl font-bold mb-3'>
              About This Event
            </Text>
            <Text className='text-muted-foreground leading-6'>
              {description}
            </Text>
          </View>

          {/* Event Header */}
          <View className='px-4 py-4'>
            <View className='flex-row items-center mb-4'>
              <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
              <Text className='text-muted-foreground text-sm ml-2'>
                {start_time.substring(0, 10)}
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

        </ScrollView>
      </View>
    </>
  );
}
