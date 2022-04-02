<template>
    <div>
        <input class="location-input" type="text" placeholder="Search.." ref="autocomplete" />
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            autocomplete: '',
            center: { lat: 32.109333, lng: 34.855499 },
        }
    },
    mounted() {
        this.autocomplete = new google.maps.places.Autocomplete(
            this.$refs["autocomplete"],
            {
                types: ['establishment'],
                componentRestrictions: { 'country': ['IL'] },
                fields: ['place._id', 'geometry', 'name']
            });

        this.autocomplete.addListener("place_changed", this.onPlaceChanged)
    },
    methods: {
        onPlaceChanged() {
            this.onSearch()
        },
        onPanTo(lat = 35.6895, lng = 139.6917) {
            const item = {
                type: 'location',
                item: {
                    lat,
                    lng,
                }
            }
            this.$emit('addItem', item)
        },
        geocode(val) {
            axios
                .get('https://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        address: val,
                        key: 'AIzaSyCv9mke4qM6dFwfae-VsXNlKlW2Mnk4kBk',
                    },
                })
                .then(res => res.data.results[0].geometry.location)
                .then(res => this.onPanTo(res.lat, res.lng));
        },

        onSearch() {
            this.geocode(this.$refs["autocomplete"].value);
        }
    },
    components: {
    }

}
</script>

<style>
.maps {
    height: 20vh;
}
</style>



