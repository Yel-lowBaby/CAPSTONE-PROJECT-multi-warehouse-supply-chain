const express = require('express');
const router = express.Router();

const {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrder,
    confirmPurchaseOrder,
    shipPurchaseOrder,
    receivePurchaseOrder,
    cancelPurchaseOrder
} = require('../controllers/purchaseOrderController');

const { protect } = require('../middlewares/auth.middleware');
const { authorise } = require('../middlewares/role.middleware')

// All routes below require authentication
router.use(protect);

// Standard CRUD
router
    .route('/')
    .get(authorise('Admin', 'Staff'), getAllPurchaseOrders)
    .post(authorise('Admin', 'Staff'), createPurchaseOrder);

router
    .route('/:id')
    .get(authorise('Admin', 'Staff'), getPurchaseOrder);

// Status transitions
router.put('/:id/confirm', authorise('Admin', 'Staff'), confirmPurchaseOrder);
router.put('/:id/ship', authorise('Admin', 'Staff'), shipPurchaseOrder);
router.put('/:id/receive', authorise('Admin', 'Staff'), receivePurchaseOrder);
router.put('/:id/cancel', authorise('Admin', 'Staff'), cancelPurchaseOrder);


module.exports = router;