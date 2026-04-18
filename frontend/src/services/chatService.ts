import { api } from '../lib/api';

export interface ChatProductDTO {
    id: number;
    title: string;
    image: string;
    sellingPrice: number;
    mrpPrice: number;
    discountPercent: number;
    brand: string;
}

export interface OrderStatusDTO {
    orderId: number;
    status: string;
    orderDate: string;
    deliveryDate: string;
    totalItems: number;
    totalAmount: number;
}

export interface ChatResponse {
    response: string;
    type: 'text' | 'products' | 'order_status' | 'faq';
    products?: ChatProductDTO[];
    quickActions?: string[];
    orderStatus?: OrderStatusDTO;
}

export const chatService = {
    sendMessage: async (message: string): Promise<ChatResponse> => {
        try {
            const response = await api.post('/api/chat', { message });
            return response as ChatResponse;
        } catch (error) {
            console.error('Error sending message to chat API', error);
            throw error;
        }
    }
};
