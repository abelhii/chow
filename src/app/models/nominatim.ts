// Reverse place 
export class ReversePlace {
    place_id: string;
    licence: string;
    osm_type: string;
    osm_id: string;
    lat: string;
    lon: string;
    display_name: string;
    address: Address;
}

export class Address {
    name: string;
    road: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    country_code: string;
}

// Search place
export class SearchPlace {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon: string;
    address: Address;
}

// Geocoding
export class FeatureCollection {
    type: string;
    geocoding: {
        version: string;
        attribution: string;
        licence: string;
        query: string;
    };
    features: GeocodingFeature[];
}

export class GeocodingFeature {
    type: string;
    properties: { geocoding: PropertyGeocoding };
    geometry: Geometry;
}

export class PropertyGeocoding {
    place_id: number;
    osm_type: string;
    osm_id: number;
    type: string;
    label: string;
    name: string;
    street: string;
    postcode: string;
    city: string;
    state: string;
    country: string;
}

export class Geometry {
    type: string;
    coordinates: number[];
}