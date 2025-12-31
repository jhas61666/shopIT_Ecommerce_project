import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        maxLength: [200, "Product name cannot exceed 200 characters"],
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        max: [99999, "Product price cannot exceed 99,999"], // ✅ CORRECT: Use 'max' for Number types
        min: [0, "Price cannot be negative"], // Added
    },  
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"],
        enum: {
            values: [
                "Electronics",
                "Cameras",
                "Laptops", // ✅ CORRECT: Kept plural form for consistency
                "Accessories",
                "Headphones",
                "Food",
                "Sports",
                "Outdoor",
                "Home",
            ],
            message: "please select correct category",
        },
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true }
);

export default mongoose.model("Product", productSchema);