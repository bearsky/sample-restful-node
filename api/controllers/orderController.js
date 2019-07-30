// Load Order Model
const Order = require('../models/order');

// Order List
exports.index = async (req, res) => {
    try {
        const orders = await Order.find().select('id product quantity').populate('product', 'id name category price');
        res.status(200).json({
            count: orders.length,
            orders: orders.map(order => {
                return {
                    id: order.id,
                    product: {
                        id: order.product.id,
                        name: order.product.name,
                        category: order.product.category,
                        price: order.product.price,
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/products/' + order.product.id
                        }
                    },
                    quantity: order.quantity,
                    request: {
                        type: req.method,
                        url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + order.id
                    }
                }
            })
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
}

// Order Detail
exports.show = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).select('id product quantity').populate('product', 'id name category price')
        res.status(200).json({
            id: order.id,
            product: {
                id: order.product.id,
                name: order.product.name,
                category: order.product.category,
                price: order.product.price,
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/products/' + order.product.id
                }
            },
            quantity: order.quantity
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
}

// Order Save
exports.store = async (req, res) => {
    const order = new Order({
        product: req.body.product,
        quantity: req.body.quantity
    });
    try {
        await order.save();
        res.status(201).json({
            message: 'Order created',
            order: {
                id: item.id,
                product: item.product,
                quantity: item.quantity,
                url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + item.id
            }
        });
    } catch(err) {
        res.status(404).json({
            error: err.message
        });
    }
}

// Order Update
exports.update = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, {
            $set: {
                product: req.body.product, quantity: req.body.quantity
            }
        });
        res.status(200).json({
            message: 'Order updated successfully',
            order: {
                id: req.params.id,
                product: req.body.product,
                quantity: req.body.quantity
            }
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
}

// Order Delete
exports.destroy = async (req, res) => {
    try {
        await Order.findByIdAndRemove(req.params.id);
        res.status(200).json({
            message: 'Order deleted successfully'
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
}