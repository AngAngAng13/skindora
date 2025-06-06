export interface ProductInCart {
    ProductID: string
    Quantity: number
}

export interface AddToCartPayload{
    ProductID: string
    Quantity: number
}

export interface UpdateCartPayload{
    Quantity: number
}

export interface CartParams{
    productId: string
}