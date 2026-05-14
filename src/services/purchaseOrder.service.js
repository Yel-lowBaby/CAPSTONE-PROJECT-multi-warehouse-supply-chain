const PurchaseOrder = require('../models/purchaseOrder.model');

// CREATE A PURCHASE ORDER (always starts as draft)
const createPurchaseOrder = async (data, userId) => {
    const purchaseOrder = await PurchaseOrder.create({
        ...data,
        createdBy: userId,
        status: 'draft'
    });
    return purchaseOrder;
};

// GET ALL PURCHASE ORDERS (with optional status filter)
const getAllPurchaseOrders = async (query) => {
    const filter = {};

    if (query.status) {
        const validStatuses = ['draft', 'confirmed', 'shipped', 'received', 'cancelled'];
        if (!validStatuses.includes(query.status)) {
            throw new AppError('Invalid status filter. Use draft, confirmed, shipped, received or cancelled.', 400);
        }
        filter.status = query.status;
    }

    if (query.supplier) {
        filter.supplier = query.supplier;
    }

    const purchaseOrders = await PurchaseOrder.find(filter).sort('-createdAt');
    return purchaseOrders;
};

// GET A SINGLE PURCHASE ORDER
const getPurchaseOrderById = async (id) => {
    const purchaseOrder = await PurchaseOrder.findById(id);
    if (!purchaseOrder) {
        throw new AppError('Purchase order not found.', 404);
    }
    return purchaseOrder;
};

// CONFIRM A PURCHASE ORDER (draft -> confirmed)
const confirmPurchaseOrder = async (id, userId) => {
    const purchaseOrder = await PurchaseOrder.findById(id);

    if (!purchaseOrder) {
        throw new AppError('Purchase order not found.', 404);
    }

    if (purchaseOrder.status !== 'draft') {
        throw new AppError(
            `Only draft purchase orders can be confirmed. This order is already ${purchaseOrder.status}.`,
            400
        );
    }

    purchaseOrder.status = 'confirmed';
    purchaseOrder.confirmedBy = userId;
    purchaseOrder.confirmedAt = new Date();

    await purchaseOrder.save();
    return purchaseOrder;
};

// SHIP A PURCHASE ORDER (confirmed → shipped)
const shipPurchaseOrder = async (id, userId) => {
    const purchaseOrder = await PurchaseOrder.findById(id);

    if (!purchaseOrder) {
        throw new AppError('Purchase order not found.', 404);
    }

    if (purchaseOrder.status !== 'confirmed') {
        throw new AppError(
            `Only confirmed purchase orders can be marked as shipped. This order is currently ${purchaseOrder.status}.`,
            400
        );
    }

    purchaseOrder.status = 'shipped';
    purchaseOrder.shippedBy = userId;
    purchaseOrder.shippedAt = new Date();

    await purchaseOrder.save();
    return purchaseOrder;
};

// RECEIVE A PURCHASE ORDER (shipped -> received)
const receivePurchaseOrder = async (id, userId) => {
    const purchaseOrder = await PurchaseOrder.findById(id);

    if (!purchaseOrder) {
        throw new AppError('Purchase order not found.', 404);
    }

    if (!['confirmed', 'shipped'].includes(purchaseOrder.status)) {
        throw new AppError(
            `Only confirmed or shipped purchase orders can be marked as received. This order is currently ${purchaseOrder.status}.`,
            400
        );
    }

    purchaseOrder.status = 'received';
    purchaseOrder.receivedBy = userId;
    purchaseOrder.receivedAt = new Date();

    await purchaseOrder.save();

    // INVENTORY LOGIC HOOK
    // This is where we trigger the inventory update logic when the full project is built
    //
    // await InventoryService.updateStock({
    //      warehouseId: purchaseOrder.warehouse,
    //      items: purchaseOrder.items
    // });

    return purchaseOrder;
};

// CANCEL A PURCHASE ORDER
const cancelPurchaseOrder = async (id, userId, cancellationReason) => {
    const purchaseOrder = await PurchaseOrder.findById(id);

    if (!purchaseOrder) {
        throw new AppError('Purchase order not found.', 404);
    }

    if (purchaseOrder.status === 'received') {
        throw new AppError('A received purchase order cannot be cancelled.', 400);
    }

    if (purchaseOrder.status === 'cancelled') {
        throw new AppError('This purchase order is already cancelled.', 400);
    }

    if (!cancellationReason) {
        throw new AppError('A cancellation reason is required.', 400);
    }

    purchaseOrder.status = 'cancelled';
    purchaseOrder.cancelledBy = userId;
    purchaseOrder.cancelledAt = new Date();
    purchaseOrder.cancellationReason = cancellationReason;

    await purchaseOrder.save();
    return purchaseOrder;
};



module.exports = {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    confirmPurchaseOrder,
    shipPurchaseOrder,
    receivePurchaseOrder,
    cancelPurchaseOrder
};