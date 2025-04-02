export interface FoodItem {
    _id: string;
    title: string;
    price: number;
    type: string;
    imageURL: string;
}

export interface ApiCartItem {
    _id: string;
    foodItemId: {
        _id: string;
        title: string;
        price: number;
        imageURL: string;
        type: string;
    };
    quantity: number;
}

export interface ApiCart {
    _id: string;
    userId: string;
    list: ApiCartItem[];
}

// Interface cho item trong AppContext
export interface ContextCartItem {
    id: string;
    name: string;
    price: number;
    imageURL: string;
    quantity: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    role: string;
}