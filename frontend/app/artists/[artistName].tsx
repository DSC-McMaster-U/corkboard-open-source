import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ArtistPage() {
  const { artistName } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className='flex-1 bg-background' edges={['top']}>
        {/* Header with back button only */}
        <View className='flex-row items-center px-4 py-4'>
          <TouchableOpacity onPress={() => router.back()} className='mr-4 text-foreground'>
            <Ionicons name="arrow-back" size={24} color="text-muted-foreground" />
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1'>
          {/* Artist Header */}
          <View className='items-center py-8 px-4'>
            <View className='w-32 h-32 rounded-full bg-primary mb-4' />
            <Text className='text-foreground text-3xl font-bold mb-2'>
              {artistName}
            </Text>
            <Text className='text-muted-foreground text-sm mb-4'>
              1.2M monthly listeners
            </Text>
            <TouchableOpacity className='bg-primary px-8 py-3 rounded-full'>
              <Text className='text-foreground font-semibold'>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Popular Songs */}
          <View className='px-4 py-6'>
            <Text className='text-foreground text-xl font-bold mb-4'>
              Popular Songs
            </Text>
            {[1, 2, 3, 4, 5].map((item) => (
              <TouchableOpacity 
                key={item}
                className='flex-row items-center py-3'
              >
                <Text className='text-muted-foreground w-8'>{item}</Text>
                <View className='w-12 h-12 rounded bg-secondary mr-3' />
                <View className='flex-1'>
                  <Text className='text-foreground font-semibold'>
                    Song Title {item}
                  </Text>
                  <Text className='text-muted-foreground text-sm'>
                    {artistName}
                  </Text>
                </View>
                <Ionicons name="ellipsis-horizontal" size={20} color="gray" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Albums */}
          <View className='px-4 py-6'>
            <Text className='text-foreground text-xl font-bold mb-4'>
              Albums
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((item) => (
                <TouchableOpacity key={item} className='mr-4'>
                  <View className='w-40 h-40 rounded-lg bg-secondary mb-2' />
                  <Text className='text-foreground font-semibold'>
                    Album {item}
                  </Text>
                  <Text className='text-muted-foreground text-sm'>2024</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
