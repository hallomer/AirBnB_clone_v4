$(document).ready(function() {
    const selectedAmenities = {};
    const selectedLocations = { states: {}, cities: {} };

    // Handle amenity checkboxes
    $('.amenities input[type="checkbox"]').change(function() {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');

        if (this.checked) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }
        updateAmenities();
    });

    // Handle state and city checkboxes
    $('.locations input[type="checkbox"]').change(function() {
        const locationId = $(this).data('id');
        const locationName = $(this).data('name');
        const locationType = $(this).data('type'); // 'state' or 'city'

        if (this.checked) {
            if (locationType === 'state') {
                selectedLocations.states[locationId] = locationName;
            } else {
                selectedLocations.cities[locationId] = locationName;
            }
        } else {
            if (locationType === 'state') {
                delete selectedLocations.states[locationId];
            } else {
                delete selectedLocations.cities[locationId];
            }
        }
        updateLocations();
    });

    function updateAmenities() {
        const amenitiesList = Object.values(selectedAmenities).join(', ');
        $('.amenities h4').text(amenitiesList);
    }

    function updateLocations() {
        const statesList = Object.values(selectedLocations.states).join(', ');
        const citiesList = Object.values(selectedLocations.cities).join(', ');
        const locationsList = [statesList, citiesList].filter(Boolean).join(', ');
        $('.locations h4').text(locationsList);
    }

    // Check API status
    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    // Handle filter button click
    $('#filter_button').click(function() {
        fetchPlaces({
            amenities: Object.keys(selectedAmenities),
            states: Object.keys(selectedLocations.states),
            cities: Object.keys(selectedLocations.cities)
        });
    });

    function fetchPlaces(filters) {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(filters),
            success: function(data) {
                $('section.places').empty();
                data.forEach(place => {
                    // Fetch reviews for each place
                    $.ajax({
                        url: `http://0.0.0.0:5001/api/v1/places/${place.id}/reviews/`,
                        type: 'GET',
                        success: function(reviews) {
                            let reviewsHtml = '';
                            reviews.forEach(review => {
                                reviewsHtml += `<li>${review.text}</li>`;
                            });
                            $('section.places').append(
                                `<article>
                                    <div class="title_box">
                                        <h2>${place.name}</h2>
                                        <div class="price_by_night">$${place.price_by_night}</div>
                                    </div>
                                    <div class="information">
                                        <div class="max_guest">${place.max_guest} Guests</div>
                                        <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                                        <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
                                    </div>
                                    <div class="description">
                                        ${place.description}
                                    </div>
                                    <div class="reviews">
                                        <h3>Reviews</h3>
                                        <ul>${reviewsHtml}</ul>
                                    </div>
                                </article>`
                            );
                        }
                    });
                });
            }
        });
    }

    // Initial fetch of places
    fetchPlaces({});

    // Fetch states and cities
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/states/',
        type: 'GET',
        success: function(states) {
            states.forEach(state => {
                let stateHtml = `<li>
                    <h4>${state.name}</h4>
                    <ul>`;
                state.cities.forEach(city => {
                    stateHtml += `<li>
                        <input type="checkbox" data-id="${city.id}" data-name="${city.name}" data-type="city">
                        ${city.name}
                    </li>`;
                });
                stateHtml += `</ul></li>`;
                $('.filters ul').append(stateHtml);
            });

            // Re-bind the change event for dynamically added city checkboxes
            $('.filters input[type="checkbox"]').change(function() {
                const locationId = $(this).data('id');
                const locationName = $(this).data('name');
                const locationType = $(this).data('type'); // 'state' or 'city'

                if (this.checked) {
                    if (locationType === 'state') {
                        selectedLocations.states[locationId] = locationName;
                    } else {
                        selectedLocations.cities[locationId] = locationName;
                    }
                } else {
                    if (locationType === 'state') {
                        delete selectedLocations.states[locationId];
                    } else {
                        delete selectedLocations.cities[locationId];
                    }
                }
                updateLocations();
            });
        }
    });
});
