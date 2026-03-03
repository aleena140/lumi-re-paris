import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CartItem {
    quantity: bigint;
    perfumeId: bigint;
}
export interface Perfume {
    id: bigint;
    tagline: string;
    name: string;
    description: string;
    category: string;
    price: bigint;
    scentNotes: Array<string>;
}
export interface Order {
    user: Principal;
    items: Array<CartItem>;
    totalPrice: bigint;
}
export interface backendInterface {
    addToCart(perfumeId: bigint, quantity: bigint): Promise<void>;
    clearCart(): Promise<void>;
    getAllPerfumes(): Promise<Array<Perfume>>;
    getCart(): Promise<Array<CartItem>>;
    getOrderHistory(): Promise<Array<Order>>;
    getPerfumeById(id: bigint): Promise<Perfume>;
    placeOrder(): Promise<void>;
    removeFromCart(perfumeId: bigint): Promise<void>;
}
