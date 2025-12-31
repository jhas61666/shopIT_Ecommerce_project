import React, { useState, useEffect } from "react";
import MetaData from "../layout/MetaData";
import CheckOutSteps from "./CheckOutSteps";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { caluclateOrderCost } from "../../helpers/helpers";
import { useCreateNewOrderMutation } from "../../redux/api/orderApi";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");
  const navigate = useNavigate();

  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  const [createNewOrder, { isLoading, error, isSuccess }] =
    useCreateNewOrderMutation();

  // Handle Order Success or Error
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Order failed. Please try again.");
    }

    if (isSuccess) {
      navigate("/me/orders");
      toast.success("Order Placed Successfully!");
    }
  }, [error, isSuccess, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    // 1. Validation: Ensure a method is selected
    if (!method) {
      toast.error("Please select a payment method");
      return;
    }

    // 2. Calculate Costs
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      caluclateOrderCost(cartItems);

    if (method === "COD") {
      // 3. Prepare Order Data for Backend
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

      // 4. Call API Mutation
      createNewOrder(orderData);
    } 
    
    if (method === "Card") {
      // Logic for Card Payment (Stripe)
      navigate("/payment");
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
              {isLoading ? "Processing Order..." : "CONTINUE"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;