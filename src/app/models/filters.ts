export interface PlaceFilter {
    Radius?: number;
    Types?: PlaceTypes;
    OpenNow?: boolean;
}

export enum PlaceTypes {
    Bar = "bar",
    Bakery = "bakery",
    Cafe = "cafe",
    LiquorStore = "liquor_store",
    Restaurant = "restaurant",
    Supermarket = "supermarket",
}