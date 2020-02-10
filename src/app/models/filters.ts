export interface PlaceFilter {
    Radius?: number;
    Type?: PlaceType;
    OpenNow?: boolean;
}

export enum PlaceType {
    Bar = "bar",
    Bakery = "bakery",
    Cafe = "cafe",
    LiquorStore = "liquor_store",
    Restaurant = "restaurant",
    Supermarket = "supermarket",
}