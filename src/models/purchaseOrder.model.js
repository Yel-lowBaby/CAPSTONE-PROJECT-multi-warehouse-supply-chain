const mongoose = require('mongoose');

// Each product line within a Purchase Order
const purchaseOrderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required']
        },

        productName: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true
        },

        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },

        unitPrice: {
            type: Number,
            required: [true, 'Unit price is required'],
            min: [0, 'Unit price cannot be negative']
        },

        totalPrice: {
            type: Number
        },
    },
    { _id: true }
);

const purchaseOrderSchema = new mongoose.Schema(
    {
        poNumber: {
            type: String,
            unique: true
        },

        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
            required: [true, 'Supplier is required'],
        },

        supplierName: {
            type: String,
            required: [true, 'Supplier name is required'],
            trim: true,
        },

        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: [true, 'Warehouse is required'],
        },

        warehouseName: {
            type: String,
            required: [true, 'Warehouse name is required'],
            trim: true
        },

        items: {
            type: [purchaseOrderItemSchema],
            validate: {
                validator: (items) => items.length > 0,
                message: 'A purchase order must have at least one item'
            },
        },

        totalAmount: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ['draft', 'confirmed', 'shipped', 'received', 'cancelled'],
            default: 'draft'
        },
        

        // Who created the PO
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        // Who confirmed the PO (set automatically on status change)
        confirmedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        confirmedAt: {
            type: Date
        },

        shippedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        shippedAt: {
            type: Date
        },

        // Who marked it as received
        receivedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        receivedAt: {
            type: Date
        },

        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        cancelledAt: {
            type: Date
        },

        cancellationReason: {
            type: String,
            trim: true
        },

        expectedDeliveryDate: {
            type: Date
        },

        notes: {
            type: String,
            trim: true
        },
    },
    {
        timestamps: true
    }
);

// Auto-generate PO number and calculate total Amount before creating
purchaseOrderSchema.pre('save', function () {
    // Generate PO number only on first save
    if (this.isNew) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0');
        this.poNumber = `PO-${timestamp}-${random}`;
    }

    // Recalculate each item's totalPrice and sum up the overall totalAmount
    this.items.forEach((item) => {
        item.totalPrice = item.quantity * item.unitPrice;
    });

    this.totalAmount = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);