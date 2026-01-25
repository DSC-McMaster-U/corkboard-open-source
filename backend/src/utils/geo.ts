// A helper function to calculate the distance between two geographic coordinates using the Haversine formula
// returns distance in kilometers
const haversineDistance = (
    lat1: number, // latitude of first point
    lng1: number, // longitude of first point
    lat2: number, // latitude of second point
    lng2: number, // longitude of second point
): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180; // latitude diff in radians
    const dLng = ((lng2 - lng1) * Math.PI) / 180; // longitude diff in radians

    // sin^2(dLat/2) + cos(lat1) * cos(lat2) * sin^2(dLng/2)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

    // 2 * atan2(sqrt(a), sqrt(1 - a))
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// A helper function to validate that latitude and longitude are within valid ranges
// returns an object with isValid boolean and error message if invalid
const validateCoordinates = (
    latitude: number, // latitude to check
    longitude: number, // longitude to check
): { isValid: boolean; error?: string } => {
    if (latitude < -90 || latitude > 90) {
        return {
            isValid: false,
            error: `Latitude must be between -90 and 90, got ${latitude}`,
        };
    }

    if (longitude < -180 || longitude > 180) {
        return {
            isValid: false,
            error: `Longitude must be between -180 and 180, got ${longitude}`,
        };
    }

    return { isValid: true };
};

export { haversineDistance, validateCoordinates };

