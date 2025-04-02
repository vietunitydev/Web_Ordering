import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { ContextCartItem, User } from '../../shared/types';

interface AppState {
    cart: ContextCartItem[];
    user: User | null;
}

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<any>;
}

const initialState: AppState = {
    cart: [],
    user: null,
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const actionTypes = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    ADD_TO_CART: 'ADD_TO_CART',
    SET_CART: 'SET_CART',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    CLEAR_CART: 'CLEAR_CART',
};

const appReducer = (state: AppState, action: any): AppState => {
    switch (action.type) {
        case actionTypes.LOGIN:
            return { ...state, user: action.payload };
        case actionTypes.LOGOUT:
            return { ...state, user: null, cart: [] };
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
        case actionTypes.SET_CART:
            return { ...state, cart: action.payload };
        case actionTypes.UPDATE_QUANTITY:
            return {
                ...state,
                cart: state.cart.map((item) =>
                    item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
                ),
            };
        case actionTypes.REMOVE_FROM_CART:
            return {
                ...state,
                cart: state.cart.filter((item) => item.id !== action.payload.id),
            };
        case actionTypes.CLEAR_CART:
            return { ...state, cart: [] };
        default:
            return state;
    }
};

// Provider để bọc ứng dụng
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    //  useReducer(appReducer, initialState, initializerFunction)
    //  appReducer: Hàm reducer để xử lý các action.
    //  initialState: State ban đầu (chưa dùng vì có initializer function).
    //  initializerFunction: Hàm khởi tạo state ban đầu từ localStorage.

    const [state, dispatch] = useReducer(appReducer, initialState, () => {
        const savedUser = localStorage.getItem('user');
        return {
            cart: [],
            user: savedUser ? JSON.parse(savedUser) : null,
        };
    });

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(state.user));
    }, [state.user]);

    return (
        //  AppContext.Provider cung cấp state và dispatch cho toàn bộ ứng dụng.
        //  Các component con có thể dùng useContext(AppContext) để truy cập state hoặc gọi dispatch.
        //  children: Các component con được bọc bởi AppProvider.

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

export const getTotalItems = (cart: ContextCartItem[]) => {
    return cart.reduce((total, item) => total + item.quantity, 0);
};

export const actions = actionTypes;