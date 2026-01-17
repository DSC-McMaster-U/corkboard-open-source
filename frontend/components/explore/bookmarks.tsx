import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch } from '@/api/api';

// API response types
interface Venue {
    id: string;
    name: string;
    address: string;
    venue_type: string;
    latitude: number;
    longitude: number;
}

interface Event {
    id: string;
    title: string;
    description: string;
    start_time: string;
    cost: number | null;
    status: string;
    image: string | null;
    venues: Venue;
}

interface BookmarkResponse {
    user_id: string;
    event_id: string;
    created_at: string;
    events: Event;
}

interface ApiBookmarksResponse {
    bookmarks: BookmarkResponse[];
}

// Display types
type BookmarkType = 'Concert' | 'Festival' | 'Open Mic' | 'DJ Night';

interface BookmarkItem {
    id: string;
    title: string;
    type: BookmarkType;
    emoji: string;
    subtitle: string;
}

const typeColors: Record<BookmarkType, string> = {
    Concert: '#C4A484',
    Festival: '#C4A484',
    'Open Mic': '#C4A484',
    'DJ Night': '#C4A484',
};

interface BookmarkCardProps {
    item: BookmarkItem;
    onRemove: (eventId: string) => void;
    isRemoving: boolean;
}

function BookmarkCard({ item, onRemove, isRemoving }: BookmarkCardProps) {
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

    const handleRemoveBookmark = () => {
        onRemove(item.id);
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

                {/* Bookmark Icon - Toggleable */}
                <TouchableOpacity
                    onPress={handleRemoveBookmark}
                    disabled={isRemoving}
                    className="ml-2 p-1"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name="bookmark"
                        size={18}
                        color={isRemoving ? '#999' : '#411900'}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

// Helper to map venue_type to display type
function getDisplayType(venueType: string): BookmarkType {
    const typeMap: Record<string, BookmarkType> = {
        bar: 'DJ Night',
        club: 'DJ Night',
        theater: 'Concert',
        venue: 'Concert',
        outdoor: 'Festival',
        other: 'Open Mic',
    };
    return typeMap[venueType] || 'Concert';
}

// Helper to get emoji based on venue type
function getEmoji(venueType: string): string {
    const emojiMap: Record<string, string> = {
        bar: '🍻',
        club: '🎧',
        theater: '🎭',
        venue: '🎸',
        outdoor: '🎪',
        other: '🎤',
    };
    return emojiMap[venueType] || '🎵';
}

// Format date for subtitle
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export function Bookmarks() {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

    const removeBookmark = async (eventId: string) => {
        // Optimistically remove from UI
        setRemovingIds((prev) => new Set(prev).add(eventId));

        try {
            await apiFetch('api/bookmarks', {
                method: 'DELETE',
                headers: {
                    Authorization: 'TESTING_BYPASS',
                },
                body: JSON.stringify({ eventId }),
            });

            // Remove from state on success
            setBookmarks((prev) => prev.filter((b) => b.id !== eventId));
        } catch (err) {
            console.error('Failed to remove bookmark:', err);
            // Could show a toast/alert here
        } finally {
            setRemovingIds((prev) => {
                const next = new Set(prev);
                next.delete(eventId);
                return next;
            });
        }
    };

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiFetch<ApiBookmarksResponse>('api/bookmarks', {
                    headers: {
                        Authorization: 'TESTING_BYPASS',
                    },
                });

                // Transform API response to display format
                const transformedBookmarks: BookmarkItem[] = response.bookmarks.map((bookmark) => ({
                    id: bookmark.event_id,
                    title: bookmark.events.title,
                    type: getDisplayType(bookmark.events.venues?.venue_type || 'other'),
                    emoji: getEmoji(bookmark.events.venues?.venue_type || 'other'),
                    subtitle: `${bookmark.events.venues?.name || 'Unknown Venue'} • ${formatDate(bookmark.events.start_time)}`,
                }));

                setBookmarks(transformedBookmarks);
            } catch (err) {
                console.error('Failed to fetch bookmarks:', err);
                setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

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
                {loading ? (
                    <View className="py-8 items-center">
                        <ActivityIndicator size="small" color="#C4A484" />
                        <Text className="text-foreground/60 mt-2">Loading bookmarks...</Text>
                    </View>
                ) : error ? (
                    <View className="py-8 items-center">
                        <Text className="text-red-500">{error}</Text>
                    </View>
                ) : bookmarks.length === 0 ? (
                    <View className="py-8 items-center">
                        <Text className="text-foreground/60">No bookmarks yet</Text>
                    </View>
                ) : (
                    bookmarks.map((item) => (
                        <BookmarkCard
                            key={item.id}
                            item={item}
                            onRemove={removeBookmark}
                            isRemoving={removingIds.has(item.id)}
                        />
                    ))
                )}
            </View>
        </View>
    );
}
