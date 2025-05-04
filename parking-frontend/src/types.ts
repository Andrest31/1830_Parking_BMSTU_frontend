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
  
  export interface OrderData {
    order_id?: number;
    items_count?: number;
  }
  
  export interface ParkingResponse {
    parkings: Parking[];
    draft_order?: OrderData;
  }