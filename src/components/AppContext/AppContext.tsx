import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { ContextCartItem } from '../../shared/types';

interface AppState {
    cart: ContextCartItem[];
    token: string | null;
    role: string | null;
    discount: number;
    appliedPromoCode: string | null;
}

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<any>;
}

const initialState: AppState = {
    cart: [],
    token: null,
    role: null,
    discount: 0,
    appliedPromoCode: null,
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
    SET_DISCOUNT: 'SET_DISCOUNT', // Action mới để lưu discount
    CLEAR_DISCOUNT: 'CLEAR_DISCOUNT', // Action mới để xóa discount
};

const appReducer = (state: AppState, action: any): AppState => {
    switch (action.type) {
        case actionTypes.LOGIN:
            return { ...state, token: action.payload.token, role: action.payload.role };
        case actionTypes.LOGOUT:
            return { ...state, token: null, role: null, cart: [], discount: 0, appliedPromoCode: null };
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
            return { ...state, cart: [], discount: 0, appliedPromoCode: null }; // Xóa discount khi xóa giỏ hàng
        case actionTypes.SET_DISCOUNT:
            return {
                ...state,
                discount: action.payload.discount,
                appliedPromoCode: action.payload.promoCode,
            };
        case actionTypes.CLEAR_DISCOUNT:
            return { ...state, discount: 0, appliedPromoCode: null };
        default:
            return state;
    }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState, () => {
        const savedToken = localStorage.getItem('token');
        return {
            cart: [],
            token: savedToken,
            role: null,
            discount: 0,
            appliedPromoCode: null,
        };
    });

    useEffect(() => {
        const fetchRole = async () => {
            if (state.token && !state.role) {
                try {
                    const response = await fetch('http://localhost:4999/api/auth/me', {
                        headers: { Authorization: `Bearer ${state.token}` },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        dispatch({ type: actionTypes.LOGIN, payload: { token: state.token, role: data.data.role } });
                    } else {
                        dispatch({ type: actionTypes.LOGOUT });
                    }
                } catch (err) {
                    dispatch({ type: actionTypes.LOGOUT });
                }
            }
        };
        fetchRole();

        localStorage.setItem('token', state.token || '');
    }, [state.token]);

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

export const getTotalItems = (cart: ContextCartItem[]) => {
    return cart.reduce((total, item) => total + item.quantity, 0);
};

export const actions = actionTypes;