 type IPromotion = {
    _id: string;
    name: string;
    code: string;
    description: string;
    discount_type: string;
    discount_value: number;
    start_date: string;
    end_date: string;
    active: boolean;
    usage_limit: number;
    usage_count: number;
    min_purchase_amount: number;
    apply_to_all_products: boolean;
    product_ids: string[];
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
};


