export interface Parking {
    id: number;
    name: string;
    short_name: string;
    place: string;
    open_hour: number;
    close_hour: number;
    image_url: string;
    description_url: string;
    description: string;
    is_active: boolean;
  }

  export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
}
  
  export interface OrderData {
    order_id?: number;
    items_count?: number;
  }
  
  export type ParkingResponse = {
    parkings: Parking[];
    draft_order?: {
      order_id: number;
      items_count: number;
    };
  };

  export interface OrderItem {
    id: number;
    parking?: {
      id: number;
      short_name: string;
      image_url: string;
    };
    quantity: number;
  }
  
  
  export interface OrderDetail {
    id: number;
    user_name: string;
    state_number: string;
    deadline: string;
    status: string;
    user_id: number;
    created_at: string;
    items: OrderItem[];
  }