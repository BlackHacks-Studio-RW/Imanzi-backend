import Joi from 'joi';
import mongoose from 'mongoose'

/**
 * Order schema
 */
const OrderItemSchema = mongoose.Schema(
  {
        qty: { 
          type: Number, 
          // required: true 
        },
        price: { 
          type: Number, 
          // required: true 
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      }, 
      {
        timestamps: true,
        _id: true
      });

      /**
       * 
       */
const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: 'User',
    },
    startedCheckout: {
      type: Boolean,
      default: false,
      // required: true
    },
    orderItems: {
      type: [OrderItemSchema]
    },
    paymentMethod: {
      type: String,
      // required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      // required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      // required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      // required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isActive:{
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order