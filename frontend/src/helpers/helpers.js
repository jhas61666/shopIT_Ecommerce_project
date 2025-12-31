export const getPriceQueryParams = (searchParams, key, value) => {
  const hasValueInParam = searchParams.has(key);

  if (value !== "" && value !== null && value !== undefined) {
    searchParams.set(key, value);
  } else if (hasValueInParam) {
    searchParams.delete(key);
  }

  return searchParams;
};


export const caluclateOrderCost = (cartItems) => {

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 200 ? 0 : 25; // Free shipping over $200
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% Tax
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}