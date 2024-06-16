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
});
