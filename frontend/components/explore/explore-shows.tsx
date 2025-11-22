import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
//import { shows } from '@/constants/mock-data';
import { router } from 'expo-router';
import { Show } from '@/lib/types';

interface ShowCardProps {
  show: Show;
}

const getShows = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/events?limit=10');
  
    if (!response.ok) throw new Error("Error fetching data.")

    const data = await response.json();
    return data.events; 

  } catch (e) {
    console.error((e as Error).message)
    return [];
  }
}

function ShowCard({ show }: ShowCardProps) {
  const handlePress = () => {
    router.push({
      pathname: '/shows/[showName]',
      params: {
        showName: show.title,
        description: show.description,
        start_time: show.start_time,
        cost: show.cost
      }
    });
  };

  return (
    <TouchableOpacity className='w-36 mr-4' onPress={handlePress}>
      <View 
        className='rounded-2xl h-36 w-36 mb-2 justify-center items-center overflow-hidden'
        style={{ backgroundColor: '#B8856A' }}
      >
      </View>
      <Text className='text-foreground font-semibold text-sm' numberOfLines={1}>
        {show.title}
      </Text>
      <Text className='text-foreground/60 text-xs' numberOfLines={2}>
        {show.description}
      </Text>
    </TouchableOpacity>
  );
}

export function ExploreShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)

  // fetching event data from backend
  useEffect(() =>  { 
    const fetchData = async () => {
      setLoading(true)
      const data: Show[] = await getShows();
      if (data) setShows(data);
      else setError(true)
    }

    fetchData();
    setLoading(false)
  }, []);

  if (loading) {
    return (
    <div>This component is loading.</div>
    )
  }

  if (error) {
    return (
    <div>This component has an error.</div>
    )
  }

  return (
    <View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className='flex-row'
      >
        {shows && shows.map((show: Show, index: number) => (
          <ShowCard
            key={index}
            show={show}
          />
        ))}
      </ScrollView>
    </View>
  );
}
