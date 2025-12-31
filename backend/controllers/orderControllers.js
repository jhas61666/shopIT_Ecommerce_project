import mongoose from "mongoose";
import catchAsyncErrors from "../middlewares/catchAsyncError.js"
import Order from "../models/order.js";
import Product from "../models/product.js"
import ErrorHandler from "../utils/errorHandler.js";

// Create new Order => /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo
    } = req.body;
   

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id
    });

    res.status(200).json({
        order,
    });
});


// Get current user orders => /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });


    res.status(200).json({
        orders,
    });
});


// Get order details => /api/v1/orders/:id
export const getOrderDetaills = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    res.status(200).json({
        order,
    });
});

// Get all orders - ADMIN => /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    res.status(200).json({
        orders,
    });
});




// Update Order - ADMIN = /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    const { status, orderItems: newOrderItems } = req.body;

    // If you want to allow changing products in an order:
    if (newOrderItems && Array.isArray(newOrderItems)) {
        // 1️⃣ Restore stock of old items
        for (const oldItem of order.orderItems) {
            const product = await Product.findById(oldItem.product);
            if (product) {
                product.stock += oldItem.quantity; // restore stock
                await product.save({ validateBeforeSave: false });
            }
        }

        // 2️⃣ Deduct stock for new items
        for (const newItem of newOrderItems) {
            const product = await Product.findById(newItem.product);
            if (!product) {
                return next(new ErrorHandler(`No Product found with ID: ${newItem.product}`, 404));
            }
            if (product.stock < newItem.quantity) {
                return next(new ErrorHandler(`Not enough stock for ${product.name}`, 400));
            }
            product.stock -= newItem.quantity;
            await product.save({ validateBeforeSave: false });
        }

        // 3️⃣ Update order items
        order.orderItems = newOrderItems;
    } else {
        // If products are not changing, just deduct stock of existing items
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return next(new ErrorHandler(`No Product found with ID: ${item.product}`, 404));
            }
            if (product.stock < item.quantity) {
                return next(new ErrorHandler(`Not enough stock for ${product.name}`, 400));
            }
            product.stock -= item.quantity;
            await product.save({ validateBeforeSave: false });
        }
    }

    // Update status and deliveredAt only when delivering
    order.orderStatus = status;
    if (status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
        success: true,
        order,
    });
});



// Delete order => /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    await order.deleteOne();
    
    res.status(200).json({
        success: true,
    })
})
