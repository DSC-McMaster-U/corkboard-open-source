import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type BookmarkType = 'Concert' | 'Festival' | 'Open Mic' | 'DJ Night';

interface BookmarkItem {
    id: string;
    title: string;
    type: BookmarkType;
    emoji: string;
    subtitle: string;
}

// Mock data for bookmarks - replace with actual data fetching
const mockBookmarks: BookmarkItem[] = [
    {
        id: '1',
        title: 'Arcade Fire Live',
        type: 'Concert',
        emoji: 'A',
        subtitle: 'Feb 14, 2026 • FirstOntario Centre',
    },
    {
        id: '2',
        title: 'Supercrawl 2026',
        type: 'Festival',
        emoji: 'S',
        subtitle: 'Sep 12-14, 2026 • James St N',
    },
    {
        id: '3',
        title: 'Songwriter Showcase',
        type: 'Open Mic',
        emoji: 'S',
        subtitle: 'Every Thursday • The Casbah',
    },
    {
        id: '4',
        title: 'Bass Drop Fridays',
        type: 'DJ Night',
        emoji: 'B',
        subtitle: 'Jan 24, 2026 • Club Absinthe',
    },
];

const typeColors: Record<BookmarkType, string> = {
    Concert: '#C4A484',
    Festival: '#C4A484',
    'Open Mic': '#C4A484',
    'DJ Night': '#C4A484',
};

interface BookmarkCardProps {
    item: BookmarkItem;
}

function BookmarkCard({ item }: BookmarkCardProps) {
    const handleOnPress = () => {
        // Navigate based on type
        if (item.type === 'Concert') {
            router.push({
                pathname: '/shows/[showName]',
                params: { showName: item.title },
            });
        }
        // Add other navigation logic as needed
    };

    return (
        <TouchableOpacity onPress={handleOnPress} activeOpacity={0.7}>
            <View className="flex-row items-center bg-secondary rounded-2xl px-4 py-3 mb-3">
                {/* Emoji Icon */}
                <View className="w-12 h-12 rounded-xl bg-accent/30 items-center justify-center mr-3">
                    <Text className="text-2xl">{item.emoji}</Text>
                </View>

                {/* Content */}
                <View className="flex-1">
                    <Text className="text-foreground font-semibold text-base" numberOfLines={1}>
                        {item.title}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <View
                            className="px-2 py-0.5 rounded mr-2"
                            style={{ backgroundColor: typeColors[item.type] }}
                        >
                            <Text className="text-xs font-medium text-white">{item.type}</Text>
                        </View>
                        <Text className="text-foreground/60 text-xs flex-1" numberOfLines={1}>
                            {item.subtitle}
                        </Text>
                    </View>
                </View>

                {/* Bookmark Icon */}
                <View className="ml-2">
                    <Ionicons name="bookmark" size={18} color="#411900" />
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function Bookmarks() {
    return (
        <View>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg text-foreground font-semibold tracking-wide">
                    Get Back Into Listening
                </Text>
                <TouchableOpacity>
                    <Text className="text-accent font-medium">View all</Text>
                </TouchableOpacity>
            </View>

            {/* Bookmark List */}
            <View>
                {mockBookmarks.map((item) => (
                    <BookmarkCard key={item.id} item={item} />
                ))}
            </View>
        </View>
    );
}
