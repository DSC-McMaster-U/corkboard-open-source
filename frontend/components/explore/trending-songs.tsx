import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { trendingSongs } from '@/constants/mock-data';

interface TrendingCardProps {
  artist: string
  song: string
  color: string
}

function TrendingCard({ artist, song, color }: TrendingCardProps) {
  return (
    <TouchableOpacity onPress={() => Alert.alert(song)}>
      <View 
        className='rounded-2xl px-4 py-3 flex-row items-center bg-secondary'
      >
        <View 
          className='w-8 h-8 rounded-lg mr-3'
          style={{ backgroundColor: color }}
        />
        <View className='flex-1'>
          <Text className='text-foreground font-semibold text-sm' numberOfLines={1}>
            {artist}
          </Text>
          <Text className='text-accent text-xs opacity-90' numberOfLines={1}>
            {song}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function TrendingSongs() {
  return (
    <View>
      <View className='flex-row flex-wrap gap-3'>
        {trendingSongs.map((song, index) => (
          <View key={index} className='w-[48%]'>
            <TrendingCard 
              artist={song.artist}
              song={song.song}
              color={song.color}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
