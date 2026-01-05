import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import DateRangePicker from "@/components/bottom-panel/date-range-picker";
import SearchBarFilter from '@/components/bottom-panel/search-bar-filter'; 

type Props = {
  range: [number, number];
  setRange: (r: [number, number]) => void;
  dateRange: [Date, Date];
  setDateRange: (r: [Date, Date]) => void;
};

export default function BottomPanel({ range, setRange, dateRange, setDateRange }: Props) {
  const snapPoints = useMemo(() => ['12%', '45%'], []);
  const [searchActive, setSearchActive] = useState(false);
  const dismissRef = useRef<() => void>(() => {});

  return (
    <BottomSheet
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: '#F6D0AE' }}
      handleIndicatorStyle={{ backgroundColor: '#FFF0E2' }}
      keyboardBehavior="interactive"  
      keyboardBlurBehavior="restore"  
    >
      
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      >
      
        <BottomSheetView style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 16 }}>

          {/* Full-sheet invisible overlay to dismiss search (shown only when active) */}
          {searchActive && (
            <Pressable
              onPress={() => dismissRef.current?.()}
              style={{
                position: 'absolute',
                left: 0, right: 0, top: 0, bottom: 0,
                // transparent, just to catch taps
                zIndex: 5,          // below the dropdown (which uses zIndex:10)
              }}
            />
          )}

          {/* Search bar */}
          <View style={{ marginBottom: 18 }}>
            <SearchBarFilter
              onSearch={({ query, filter }) => {
                // run your search using { query, filter, range }
              }}
              onActiveChange={setSearchActive}                
              registerDismiss={(fn) => { dismissRef.current = fn; }} 
            />
          </View>

          <Text style={{ marginBottom: 5, color: '#411900' }}>Ticket price:</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#411900' }}>${range[0].toFixed(0)}</Text>
            <Text style={{ color: '#411900' }}>${range[1].toFixed(0)}</Text>
          </View>

          <Slider
            value={range}
            onValueChange={(value) => {
              const arr = Array.isArray(value) ? value : [value, value];
              setRange([arr[0] ?? 0, arr[1] ?? arr[0] ?? 0]);
            }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="#E2912E"
            maximumTrackTintColor="#FFF0E2"
            thumbTintColor="#411900"
            thumbStyle={{ width: 14, height: 14, borderRadius: 7 }}
            thumbTouchSize={{ width: 40, height: 40 }}
            trackStyle={{ height: 3, borderRadius: 2 }}
          />

          {/* Calendar buttons */}
          <View style={{ marginTop: 8 }}>
            <DateRangePicker dateRange={dateRange} setDateRange={setDateRange}/>
          </View>

          </BottomSheetView>
        </KeyboardAvoidingView>
    </BottomSheet>
  );
}
