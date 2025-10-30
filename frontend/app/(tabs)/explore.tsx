import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Link } from 'expo-router';

export default function ExploreScreen() {
  return (
    <View className='bg-background flex-1 flex-col justify-center items-center'>
      <Text className='text-3xl text-foreground font-bold'>This is the for you page.</Text>
      <TouchableOpacity className='bg-accent p-3 rounded-full mt-20' onPress={() => console.log("hi")}>
        <Text className='text-white'>This is a button.</Text>
      </TouchableOpacity>
    </View>
  );
}
