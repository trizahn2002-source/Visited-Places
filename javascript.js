
// ============================================================================
// BUSINESS LOGIC - Place and PlaceTracker Classes
// ============================================================================

class Place {
  constructor(location, landmarks, timeOfYear, notes, country, dateVisited, rating) {
    this.location = location;
    this.landmarks = landmarks || [];
    this.timeOfYear = timeOfYear;
    this.notes = notes || "";
    this.country = country;
    this.dateVisited = dateVisited;
    this.rating = rating || 0;
    this.id = this.generateId();
  }

  generateId() {
    return `place-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add a landmark to the place
  addLandmark(landmark) {
    if (landmark && typeof landmark === 'string' && landmark.trim() !== '') {
      this.landmarks.push(landmark.trim());
      return true;
    }
    return false;
  }

  // Remove a landmark from the place
  removeLandmark(landmark) {
    const index = this.landmarks.indexOf(landmark);
    if (index > -1) {
      this.landmarks.splice(index, 1);
      return true;
    }
    return false;
  }

  // Update rating (1-5)
  updateRating(newRating) {
    if (newRating >= 0 && newRating <= 5 && Number.isInteger(newRating)) {
      this.rating = newRating;
      return true;
    }
    return false;
  }

  // Get a summary of the place
  getSummary() {
    return `${this.location}, ${this.country} - Visited in ${this.timeOfYear}`;
  }

  // Check if place was visited in a specific season
  isVisitedInSeason(season) {
    const lowerCaseTimeOfYear = this.timeOfYear.toLowerCase();
    const lowerCaseSeason = season.toLowerCase();
    return lowerCaseTimeOfYear.includes(lowerCaseSeason);
  }

  // Get full details as object
  getDetails() {
    return {
      id: this.id,
      location: this.location,
      country: this.country,
      landmarks: [...this.landmarks],
      timeOfYear: this.timeOfYear,
      dateVisited: this.dateVisited,
      rating: this.rating,
      notes: this.notes
    };
  }

  // Update notes
  updateNotes(newNotes) {
    if (typeof newNotes === 'string') {
      this.notes = newNotes.trim();
      return true;
    }
    return false;
  }
}

// PlaceTracker to manage multiple places
class PlaceTracker {
  constructor() {
    this.places = [];
  }

  // Add a new place
  addPlace(place) {
    if (place instanceof Place) {
      this.places.push(place);
      return true;
    }
    return false;
  }

  // Remove a place by ID
  removePlace(placeId) {
    const index = this.places.findIndex(p => p.id === placeId);
    if (index > -1) {
      this.places.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get a place by ID
  getPlaceById(placeId) {
    return this.places.find(p => p.id === placeId) || null;
  }

  // Get all places
  getAllPlaces() {
    return [...this.places];
  }

  // Get places by country
  getPlacesByCountry(country) {
    return this.places.filter(p => p.country.toLowerCase() === country.toLowerCase());
  }

  // Get places by season
  getPlacesBySeason(season) {
    return this.places.filter(p => p.isVisitedInSeason(season));
  }

  // Get total number of places
  getTotalPlaces() {
    return this.places.length;
  }

  // Get places sorted by rating (highest first)
  getPlacesByRating() {
    return [...this.places].sort((a, b) => b.rating - a.rating);
  }
}

// ============================================================================
// APPLICATION LOGIC - UI and Interactions
// ============================================================================

// Initialize PlaceTracker
const tracker = new PlaceTracker();

// DOM Elements
const toggleFormBtn = document.getElementById('toggleFormBtn');
const placeForm = document.getElementById('placeForm');
const placesGrid = document.getElementById('placesGrid');
const emptyState = document.getElementById('emptyState');
const placeModal = document.getElementById('placeModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');
const starRating = document.getElementById('starRating');
const ratingInput = document.getElementById('rating');
const filterCountry = document.getElementById('filterCountry');
const filterSeason = document.getElementById('filterSeason');
const sortBy = document.getElementById('sortBy');

// Stats elements
const totalPlacesEl = document.getElementById('totalPlaces');
const totalCountriesEl = document.getElementById('totalCountries');
const avgRatingEl = document.getElementById('avgRating');

// Current selected rating
let selectedRating = 0;

// Load data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderPlaces();
    updateStats();
    updateCountryFilter();
});

// Toggle form visibility
toggleFormBtn.addEventListener('click', () => {
    const isVisible = placeForm.style.display !== 'none';
    placeForm.style.display = isVisible ? 'none' : 'block';
    toggleFormBtn.classList.toggle('active');
});

// Star rating interaction
starRating.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        selectedRating = parseInt(e.target.dataset.rating);
        ratingInput.value = selectedRating;
        updateStarDisplay();
    }
});

function updateStarDisplay() {
    const stars = starRating.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add('active');
            star.textContent = '★';
        } else {
            star.classList.remove('active');
            star.textContent = '☆';
        }
    });
}

// Form submission
placeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = document.getElementById('location').value.trim();
    const country = document.getElementById('country').value.trim();
    const timeOfYear = document.getElementById('timeOfYear').value.trim();
    const dateVisited = document.getElementById('dateVisited').value;
    const landmarksInput = document.getElementById('landmarks').value.trim();
    const notes = document.getElementById('notes').value.trim();

    // Parse landmarks
    const landmarks = landmarksInput
        ? landmarksInput.split(',').map(l => l.trim()).filter(l => l !== '')
        : [];

    // Create new place
    const place = new Place(
        location,
        landmarks,
        timeOfYear,
        notes,
        country,
        dateVisited,
        selectedRating
    );

    // Add to tracker
    tracker.addPlace(place);

    // Save to localStorage
    saveToLocalStorage();

    // Reset form
    placeForm.reset();
    selectedRating = 0;
    ratingInput.value = 0;
    updateStarDisplay();

    // Hide form
    placeForm.style.display = 'none';
    toggleFormBtn.classList.remove('active');

    // Update UI
    renderPlaces();
    updateStats();
    updateCountryFilter();

    // Show success animation
    showSuccessMessage();
});

// Render places to the grid
function renderPlaces() {
    let placesToRender = tracker.getAllPlaces();

    // Apply filters
    const countryFilter = filterCountry.value;
    const seasonFilter = filterSeason.value;
    const sortOption = sortBy.value;

    if (countryFilter) {
        placesToRender = placesToRender.filter(p => p.country === countryFilter);
    }

    if (seasonFilter) {
        placesToRender = placesToRender.filter(p => p.isVisitedInSeason(seasonFilter));
    }

    // Apply sorting
    if (sortOption === 'rating') {
        placesToRender.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'alphabetical') {
        placesToRender.sort((a, b) => a.location.localeCompare(b.location));
    } else if (sortOption === 'recent') {
        placesToRender.sort((a, b) => new Date(b.dateVisited) - new Date(a.dateVisited));
    }

    // Clear grid
    placesGrid.innerHTML = '';

    if (placesToRender.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';

        placesToRender.forEach(place => {
            const card = createPlaceCard(place);
            placesGrid.appendChild(card);
        });
    }
}

// Create a place card element
function createPlaceCard(place) {
    const card = document.createElement('div');
    card.className = 'place-card';
    card.onclick = () => showPlaceDetails(place.id);

    const stars = '★'.repeat(place.rating) + '☆'.repeat(5 - place.rating);
    const preview = place.notes.substring(0, 100) + (place.notes.length > 100 ? '...' : '');

    card.innerHTML = `
        <div class="place-card-header">
            <h3 class="place-name">${place.location}</h3>
            <p class="place-country">${place.country}</p>
            <p class="place-date">${formatDate(place.dateVisited)}</p>
        </div>
        <div class="place-rating">${stars}</div>
        ${place.notes ? `<p class="place-preview">${preview}</p>` : ''}
        <span class="place-badge">${place.timeOfYear}</span>
    `;

    return card;
}

// Show place details in modal
function showPlaceDetails(placeId) {
    const place = tracker.getPlaceById(placeId);
    if (!place) return;

    const stars = '★'.repeat(place.rating) + '☆'.repeat(5 - place.rating);

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${place.location}</h2>
            <p class="modal-subtitle">${place.country}</p>
        </div>

        <div class="detail-section">
            <span class="detail-label">Date Visited</span>
            <p class="detail-value">${formatDate(place.dateVisited)}</p>
        </div>

        <div class="detail-section">
            <span class="detail-label">Season/Period</span>
            <p class="detail-value">${place.timeOfYear}</p>
        </div>

        <div class="detail-section">
            <span class="detail-label">Rating</span>
            <p class="detail-value" style="font-size: 1.5rem; color: var(--color-gold);">${stars}</p>
        </div>

        ${place.landmarks.length > 0 ? `
            <div class="detail-section">
                <span class="detail-label">Landmarks Visited</span>
                <ul class="landmarks-list">
                    ${place.landmarks.map(l => `<li>${l}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        ${place.notes ? `
            <div class="detail-section">
                <span class="detail-label">Travel Notes</span>
                <p class="detail-value">${place.notes}</p>
            </div>
        ` : ''}

        <button class="delete-btn" onclick="deletePlace('${place.id}')">
            Delete This Journey
        </button>
    `;

    placeModal.classList.add('active');
}

// Close modal
closeModal.addEventListener('click', () => {
    placeModal.classList.remove('active');
});

placeModal.addEventListener('click', (e) => {
    if (e.target === placeModal) {
        placeModal.classList.remove('active');
    }
});

// Delete place
function deletePlace(placeId) {
    if (confirm('Are you sure you want to delete this journey from your travel log?')) {
        tracker.removePlace(placeId);
        saveToLocalStorage();
        renderPlaces();
        updateStats();
        updateCountryFilter();
        placeModal.classList.remove('active');
    }
}

// Update statistics
function updateStats() {
    const places = tracker.getAllPlaces();
    const totalPlaces = places.length;

    // Total places
    totalPlacesEl.textContent = totalPlaces;

    // Total countries (unique)
    const countries = new Set(places.map(p => p.country));
    totalCountriesEl.textContent = countries.size;

    // Average rating
    if (totalPlaces > 0) {
        const avgRating = places.reduce((sum, p) => sum + p.rating, 0) / totalPlaces;
        avgRatingEl.textContent = avgRating.toFixed(1);
    } else {
        avgRatingEl.textContent = '0';
    }
}

// Update country filter dropdown
function updateCountryFilter() {
    const places = tracker.getAllPlaces();
    const countries = [...new Set(places.map(p => p.country))].sort();

    // Keep current selection
    const currentSelection = filterCountry.value;

    // Clear existing options except "All Countries"
    filterCountry.innerHTML = '<option value="">All Countries</option>';

    // Add country options
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        filterCountry.appendChild(option);
    });

    // Restore selection if still valid
    if (currentSelection && countries.includes(currentSelection)) {
        filterCountry.value = currentSelection;
    }
}

// Filter change listeners
filterCountry.addEventListener('change', renderPlaces);
filterSeason.addEventListener('change', renderPlaces);
sortBy.addEventListener('change', renderPlaces);

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show success message
function showSuccessMessage() {
    // Create success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--color-forest), var(--color-navy));
        color: var(--color-cream);
        padding: 20px 30px;
        border-radius: 8px;
        box-shadow: var(--shadow-medium);
        z-index: 2000;
        font-family: 'Playfair Display', serif;
        font-size: 1.1rem;
        animation: slideInRight 0.4s ease-out;
    `;
    notification.textContent = '✓ Journey recorded successfully!';
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// LocalStorage functions
function saveToLocalStorage() {
    const data = tracker.getAllPlaces().map(place => ({
        location: place.location,
        landmarks: place.landmarks,
        timeOfYear: place.timeOfYear,
        notes: place.notes,
        country: place.country,
        dateVisited: place.dateVisited,
        rating: place.rating,
        id: place.id
    }));
    localStorage.setItem('travelTrackerData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('travelTrackerData');
    if (data) {
        const places = JSON.parse(data);
        places.forEach(placeData => {
            const place = new Place(
                placeData.location,
                placeData.landmarks,
                placeData.timeOfYear,
                placeData.notes,
                placeData.country,
                placeData.dateVisited,
                placeData.rating
            );
            // Restore the original ID
            place.id = placeData.id;
            tracker.addPlace(place);
        });
    }
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
``