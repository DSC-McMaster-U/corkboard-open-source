import React from 'react';
import { View, Text, ImageBackground } from 'react-native';

export function FeaturedArtist() {
  return (
    <View>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80' }}
        className='rounded-xl h-56 w-full overflow-hidden justify-end'
        imageStyle={{ borderRadius: 12 }}
      >
        <View className='py-4 px-6'>
          <Text className='text-white text-xl font-bold'>
            The Lumineers
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}
