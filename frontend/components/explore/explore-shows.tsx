import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

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
  const shows = [
    {
      title: 'Nov 13',
      subtitle: 'Dame D.O.L.L.A.',
      imageUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=400&q=80'
    },
    {
      title: 'Jazz Shows',
      subtitle: 'Local Hamilton Jazz shows near you...',
      backgroundColor: '#B8856A',
      isGenre: true
    },
    {
      title: 'Hip-Hop',
      subtitle: 'Local Hamilton Hip-Hop shows near you...',
      backgroundColor: '#C19A6B',
      isGenre: true
    }
  ];

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
