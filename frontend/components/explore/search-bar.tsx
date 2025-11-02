import React from 'react';
import { View, TextInput } from 'react-native';

export function ExploreSearch() {
  const [searchText, setSearchText] = React.useState('');

  return (
    <View>
      <View className='rounded-xl bg-white py-2 px-3'>
        <TextInput
          className='text-sm'
          placeholder='Search artists, songs, shows...'
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor='111111'
        />
      </View>
    </View>
  );
}
