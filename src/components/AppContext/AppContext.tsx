// AppContext.tsx
import React, {createContext, useReducer, useEffect, useContext} from 'react';

// Định nghĩa kiểu dữ liệu
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface User {
    username: string;
    email: string;
    avatar?: string;
}

interface AppState {
    cart: CartItem[];
    user: User | null;
}

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<any>;
}

// Khởi tạo trạng thái ban đầu
const initialState: AppState = {
    cart: [],
    user: null,
};

// Tạo context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Định nghĩa các action types
const actionTypes = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    ADD_TO_CART: 'ADD_TO_CART',
};

// Reducer để xử lý các hành động
const appReducer = (state: AppState, action: any): AppState => {
    switch (action.type) {
        case actionTypes.LOGIN:
            return { ...state, user: action.payload };
        case actionTypes.LOGOUT:
            return { ...state, user: null };
        case actionTypes.ADD_TO_CART:
            const existingItem = state.cart.find((item) => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map((item) =>
                        item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
                    ),
                };
            }
            return {
                ...state,
                cart: [...state.cart, { ...action.payload, quantity: 1 }],
            };
        default:
            return state;
    }
};

// Provider để bọc ứng dụng
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState, () => {
        const savedCart = localStorage.getItem('cart');
        const savedUser = localStorage.getItem('user');
        return {
            cart: savedCart ? JSON.parse(savedCart) : [],
            user: savedUser ? JSON.parse(savedUser) : null,
        };
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.cart));
        localStorage.setItem('user', JSON.stringify(state.user));
    }, [state.cart, state.user]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export const getTotalItems = (cart: CartItem[]) => {
    return cart.reduce((total, item) => total + item.quantity, 0);
};

export const actions = actionTypes;