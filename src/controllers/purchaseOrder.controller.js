const PurchaseOrderService = require('../services/purchaseOrder.service');

const createPurchaseOrder = async (req, res, next) => {
    try {
        const purchaseOrder = await PurchaseOrderService.createPurchaseOrder(
            req.body,
            req.user.id
        );
        res.status(201).json({
            status: 'success',
            message: 'Purchase order created successfully',
            data: { purchaseOrder }
        });
    } catch (err) {
        next(err);
    }
};

const getAllPurchaseOrders = async (req, res, next) => {
    try {
        const purchaseOrders = await PurchaseOrderService.getAllPurchaseOrders(req.query);
        res.status(200).json({
            status: 'success',
            results: purchaseOrders.length,
            data: { purchaseOrders }
        });
    } catch (err) {
        next(err);
    }
};

const getPurchaseOrder = async (req, res, next) => {
    try {
        const purchaseOrder = await PurchaseOrderService.getPurchaseOrderById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: { purchaseOrder }
        });
    } catch (err) {
        next(err);
    }
};

const confirmPurchaseOrder = async (req, res, next) => {
    try {
        const purchaseOrder = await PurchaseOrderService.confirmPurchaseOrder(
            req.params.id,
            req.user.id
        );
        res.status(200).json({
            status: 'success',
            message: 'Purchase order confirmed successfully',
            data: { purchaseOrder }
        });
    } catch (err) {
        next(err);
    }
};

const shipPurchaseOrder = async (req, res, next) => {
    try {
        const purchaseOrder = await PurchaseOrderService.shipPurchaseOrder(
            req.params.id,
            req.user.id
        );
        res.status(200).json({
            status: 'success',
            message: 'Purchase order marked as shipped successfully',
            data: { purchaseOrder }
        });
    } catch (err) {
        next(err);
    }
};

const receivePurchaseOrder = async (req, res, next) => {
    try {
        const purchaseOrder = await PurchaseOrderService.receivePurchaseOrder(
            req.params.id,
            req.user.id
        );
        res.status(200).json({
            status: 'success',
            message: 'Purchase order marked as received successfully',
            data: { purchaseOrder }
        });
    } catch (err) {
        next(err);
    }
};

const cancelPurchaseOrder = async (req, res, next) => {
    try {
        const purchaseOrder = await PurchaseOrderService.cancelPurchaseOrder(
            req.params.id,
            req.user.id,
            req.body.cancellationReason
        );
        res.status(200).json({
            status: 'success',
            message: 'Purchase order cancelled successfully',
            data: { purchaseOrder }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrder,
    confirmPurchaseOrder,
    shipPurchaseOrder,
    receivePurchaseOrder,
    cancelPurchaseOrder
};