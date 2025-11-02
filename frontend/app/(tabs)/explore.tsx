import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExploreSearch } from '@/components/explore/search-bar';
import { TrendingSongs } from '@/components/explore/trending-songs';
import { FeaturedArtist } from '@/components/explore/featured-artist';

//import {} from 'expo-router';

export default function ExploreScreen() {
  // fetching trending songs
  
  return (
    <SafeAreaView className='bg-background flex-1' edges={[ 'top', 'left', 'right' ]}>
      <View className='flex-1 flex-col px-4 py-4'>

        {/* heading with search bar and profile picture*/}
        <View className='flex-row justify-between items-center mb-8'>
          <View className='flex-1 mr-12'>
            <ExploreSearch />
          </View>
          <View className='w-8 h-8 rounded-full bg-blue-300' />
        </View>

        {/* Trending Songs/Artists */}
        <View className='mb-8'>
          <Text className='text-md mb-4 text-foreground font-semibold tracking-wide'>Trending local artists</Text>
          <TrendingSongs />
        </View>

        {/* Explore shows section*/}
        <View className='mb-8'>
          <Text className='text-md mb-4 text-foreground font-semibold tracking-wide'>Explore shows in Hamilton</Text>
        </View>

        {/* Featured Artist of the day */}
        <Text className='text-md mb-4 text-foreground font-semibold tracking-wide'>Featured artist for you</Text>
        <FeaturedArtist />
      </View>
    </SafeAreaView>
  );
}
