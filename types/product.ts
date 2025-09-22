export interface ProductResponse {
  total_products: number
  total_pages: number
  current_page: number
  page_size: number
  products: Product[]
}

export interface Product {
  name: string
  description: string
  specifications: Record<string, string> // flexible key/value
  brand: string
  tags: string
  price: string
  compare_at_price: string
  category_id: string
  sku: string
  stock_quantity: number
  status: string
  is_featured: boolean
  shipping_weight_kg: string
  shipping_length_cm: string
  shipping_width_cm: string
  shipping_height_cm: string
  id: string
  average_rating: string
  total_reviews: number
  created_at: string
  updated_at: string
  created_by: string
  category: Category
  media: Media[]
  ratings: Rating[]
}

export interface Category {
  name: string
  description: string
  parent_id: string | null
  is_active: boolean
  id: string
  created_at: string
  created_by: string | null
}

export interface Media {
  media_url: string
  media_type: string
  alt_text: string
  sort_order: number
  is_primary: boolean
  id: string
  product_id: string
  created_at: string
}

export interface Rating {
  // Currently empty array, but define shape in future if needed
}
