# Visited-Places
A beautiful and simple travel journal web application.
# Visited-Places (Travel Tracker)

A beautiful web application to track and document your travel adventures.

## Features.

- **Add Destinations**: Record detailed information about places you've visited.
- **Rich Details**: Track location, country, landmarks, season, dates, ratings, and personal notes.
- **Interactive UI**: Click on any destination to view full details in an elegant modal.
- **Statistics Dashboard**: View total destinations, countries visited, and average ratings,
- **Local Storage**: All data persists in your browser.
- **Responsive Design**: Works beautifully on desktop and mobile devices.

## Technology Used.

- **HTML5**: Semantic markup
- **CSS3**: Custom vintage travel aesthetic with animations
- **Vanilla JavaScript**: No frameworks 

## Installation & Usage

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Start adding your travel destinations!

No build process or dependencies required - just open and use!

### Place Class

The `Place` class represents a single travel destination with the following properties:

```javascript
{
  id: string,           // Auto-generated unique identifier
  location: string,     // City/destination name
  country: string,      // Country name
  landmarks: array,     // List of landmarks visited
  timeOfYear: string,   // Season or period (e.g., "Summer 2024")
  dateVisited: string,  // ISO date format
  rating: number,       // Integer 0-5
  notes: string        // Personal travel notes
}
```

### Methods

#### Place Instance Methods

- `addLandmark(landmark)` - Add a landmark to the place
  - Returns: `boolean` (true on success)
  - Validates: non-empty string, trims whitespace

- `removeLandmark(landmark)` - Remove a landmark from the place
  - Returns: `boolean` (true if found and removed)

- `updateRating(newRating)` - Update the rating
  - Returns: `boolean` (true on success)
  - Validates: integer between 0-5

- `getSummary()` - Get a formatted summary string
  - Returns: `string` (e.g., "Paris, France - Visited in Summer 2023")

- `isVisitedInSeason(season)` - Check if visited in a specific season
  - Returns: `boolean`
  - Case-insensitive matching

- `getDetails()` - Get complete place details as object
  - Returns: `object` with all properties

- `updateNotes(newNotes)` - Update travel notes
  - Returns: `boolean` (true on success)
  - Validates: string type, trims whitespace

### PlaceTracker Class

The `PlaceTracker` class manages multiple places:

#### Methods

- `addPlace(place)` - Add a new place
  - Returns: `boolean` (true on success)
  - Validates: instance of Place class

- `removePlace(placeId)` - Remove a place by ID
  - Returns: `boolean` (true if found and removed)

- `getPlaceById(placeId)` - Retrieve a place by ID
  - Returns: `Place` object or `null`

- `getAllPlaces()` - Get all places
  - Returns: `array` of Place objects

- `getPlacesByCountry(country)` - Filter places by country
  - Returns: `array` of Place objects
  - Case-insensitive matching

- `getPlacesBySeason(season)` - Filter places by season
  - Returns: `array` of Place objects

- `getTotalPlaces()` - Get count of all places
  - Returns: `number`

- `getPlacesByRating()` - Get places sorted by rating (highest first)
  - Returns: `array` of Place objects


### Running Tests

bash
node test.js

1. **Landmark Management** (4 tests)
   - Adding valid landmarks
   - Whitespace trimming
   - Rejecting empty strings
   - Rejecting non-string values
   - Removing existing landmarks
   - Handling non-existent landmarks

2. **Rating Management** (4 tests)
   - Accepting valid ratings (0-5)
   - Rejecting ratings above 5
   - Rejecting negative ratings
   - Rejecting non-integer ratings

3. **Utility Methods** (4 tests)
   - Summary generation
   - Season matching (case-insensitive)
   - Getting complete details
   - Notes management with whitespace trimming

4. **PlaceTracker Tests** (12 tests)
   - Adding places
   - Validating Place instances
   - Removing places by ID
   - Retrieving places by ID
   - Handling non-existent IDs
   - Filtering by country
   - Filtering by season
   - Sorting by rating
   - Getting all places
   - Counting total places


## Design Philosophy

The interface features a **vintage travel journal aesthetic** inspired by:

- Classic travel posters and stamps.
- Aged coffee-stained notebooks.
- Warm, earthy color palette (burgundy, coffee, gold,).
- Pinterest world pic on the background.

This design choice creates an emotional connection to the romance of travel and adventure, making the act of recording memories feel special and meaningful.

## File Structure

```
travel-tracker/
├── index.html       # Main HTML structure
├── styles.css       # Vintage-styled CSS with animations
├── app.js          # Frontend application logic
├── place.js        # Business logic (Place & PlaceTracker classes)
├── test.js         # Test suite
└── README.md       # This file
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential features for future development:

- [ ] Photo upload for destinations
- [ ] Map integration to visualize travels
- [ ] Share destinations via URL
- [ ] Import data from other sources

## License

MIT License - Feel free to use and modify for your own projects!

## Contributing

Contributions are welcome! Please ensure:

1. All tests pass (`node test.js`)
2. New features include tests

**Happy Travels!** ✈️🌍🗺️

*Built with ❤️ TRIZAH NJERI W*
