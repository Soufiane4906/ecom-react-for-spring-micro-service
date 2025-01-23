// src/interfaces.ts

export interface Customer {
    id: number;
    name: string;
    email: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export interface Bill {
    id: number;
    createdAt: string;
    customerId: number;
    total: number;
    productItems: ProductItem[];
}

export interface ProductItem {
    product: Product;
    quantity: number;
    price: number;
    amount: number;
}

export interface ApiResponse<T> {
    _embedded: {
        [key: string]: T[];
    };
}