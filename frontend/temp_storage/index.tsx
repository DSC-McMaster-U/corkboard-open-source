//import { Image } from 'expo-image';
import { View, Text } from 'react-native';

import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View className='flex-1 flex-col justify-center items-center'>
      <Text className='text-3xl'>This is the home page.</Text>
    </View>
  );
}
