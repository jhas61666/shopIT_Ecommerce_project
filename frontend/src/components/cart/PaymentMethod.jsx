import React, { useState, useEffect } from "react";
import MetaData from "../layout/MetaData";
import CheckOutSteps from "./CheckOutSteps";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { caluclateOrderCost } from "../../helpers/helpers";
import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from "../../redux/api/orderApi";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");
  const navigate = useNavigate();

  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  // 1. Mutation for Cash on Delivery
  const [createNewOrder, { isLoading: isCodLoading, error: codError, isSuccess }] =
    useCreateNewOrderMutation();

  // 2. Mutation for Stripe Card Payment
  const [stripeCheckoutSession, { data: stripeData, error: checkoutError, isLoading: isStripeLoading }] = 
    useStripeCheckoutSessionMutation();

  // Combined loading state for the button
  const isLoading = isCodLoading || isStripeLoading;

  // Handle Stripe Session Redirection
  useEffect(() => {
    if (stripeData?.url) {
      window.location.href = stripeData.url;
    }

    if (checkoutError) {
      toast.error(checkoutError?.data?.message || "Stripe Session Failed");
    }
  }, [stripeData, checkoutError]);

  // Handle COD Order Success or Error
  useEffect(() => {
    if (codError) {
      toast.error(codError?.data?.message || "Order failed. Please try again.");
    }

    if (isSuccess) {
      navigate("/me/orders?order_success=true");
      toast.success("Order Placed Successfully!");
    }
  }, [codError, isSuccess, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!method) {
      toast.error("Please select a payment method");
      return;
    }

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = caluclateOrderCost(cartItems);

    if (method === "COD") {
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: Number(itemsPrice),
        shippingAmount: Number(shippingPrice),
        taxAmount: Number(taxPrice),
        totalAmount: Number(totalPrice),
        paymentInfo: {
          status: "Not Paid",
        },
        paymentMethod: "COD",
      };

      createNewOrder(orderData);
    }

    if (method === "Card") {
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: Number(itemsPrice),
        shippingAmount: Number(shippingPrice),
        taxAmount: Number(taxPrice),
        totalAmount: Number(totalPrice),
      };

      stripeCheckoutSession(orderData);
    }
  };

  return (
    <>
      <MetaData title={"Payment Method"} />

      <CheckOutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body p-4" onSubmit={submitHandler}>
            <h2 className="mb-4">Select Payment Method</h2>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                checked={method === "COD"}
                onChange={(e) => setMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="Card"
                checked={method === "Card"}
                onChange={(e) => setMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="cardradio">
                Card - VISA, MasterCard
              </label>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn btn-primary py-2 w-100 mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "CONTINUE"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;