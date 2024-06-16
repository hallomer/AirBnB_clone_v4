$(document).ready(function() {
    const selectedAmenities = {};

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

    function updateAmenities() {
        const amenitiesList = Object.values(selectedAmenities).join(', ');
        $('.amenities h4').text(amenitiesList);
    }

    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status == 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });
    function fetchPlaces() {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({}),
            success: function(data) {
                $('section.places').empty();
                data.forEach(place => {
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
                        </article>`
                    );
                });
            }
        });
    }
    fetchPlaces();
});
