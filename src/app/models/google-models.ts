export class NearbyGoogle {
    geometry: Geometry;
    icon: string;
    id: string;
    name: string;
    opening_hours: { isOpen: string; }
    photos: Photo[];
    place_id: string;
    plus_code: { compound_code: string; global_code: string; }
    rating: number;
    reference: string;
    scope: string;
    types: string[];
    user_ratings_total: number;
    vicinity: string;
    html_attributions: [];
}

export class Geometry {
    location: string;
    viewport: string;
}

export class Photo {
    height: number;
    width: number;
    html_attributions: string[];
}