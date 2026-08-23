const calculateDiscountPrice = (subtotal, coupon) => {
  let discount = 0;
  if (coupon.discountType == "percentage") {
    discount += (subtotal * coupon.discountValue) / 100;
  } else {
    discount += subtotal.coupon.discountValue;
  }
  discount = Math.min(discount, subtotal);
  return {
    discount,
    finalAmount: subtotal - discount,
  };
};

export default calculateDiscountPrice;
