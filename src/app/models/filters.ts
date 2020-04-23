export interface PlaceFilter {
    Radius?: number;
    Type?: PlaceType;
}

export enum PlaceType {
    Bar = "bar",
    Bakery = "bakery",
    Cafe = "cafe",
    LiquorStore = "liquor_store",
    Restaurant = "restaurant",
    Supermarket = "supermarket",
}