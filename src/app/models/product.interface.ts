export interface Product {
    ASIN: string;
    name: string;
    link: string;
    prime: boolean;
    rating: number | null;
    reviews: number | null;
    price: number | null;
}
