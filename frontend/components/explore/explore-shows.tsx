import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { shows } from '@/constants/mock-data';

interface ShowCardProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
  backgroundColor?: string;
  isGenre?: boolean;
}

function ShowCard({ title, subtitle, imageUrl, backgroundColor, isGenre }: ShowCardProps) {
  return (
    <TouchableOpacity className='w-36 mr-4'>
      <View 
        className='rounded-2xl h-36 w-36 mb-2 justify-center items-center overflow-hidden'
        style={{ backgroundColor: backgroundColor || '#94a3b8' }}
      >
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }}
            className='w-full h-full'
            resizeMode='cover'
          />
        ) : (
          <Text className='text-white text-5xl'>🎵</Text>
        )}
      </View>
      <Text className='text-foreground font-semibold text-sm' numberOfLines={1}>
        {title}
      </Text>
      <Text className='text-foreground/60 text-xs' numberOfLines={2}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

export function ExploreShows() {

  return (
    <View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className='flex-row'
      >
        {shows.map((show, index) => (
          <ShowCard
            key={index}
            title={show.title}
            subtitle={show.subtitle}
            imageUrl={show.imageUrl}
            backgroundColor={show.backgroundColor}
            isGenre={show.isGenre}
          />
        ))}
      </ScrollView>
    </View>
  );
}
