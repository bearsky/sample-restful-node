// Load Product Model
const Product = require('../models/product');

// Product List
exports.index = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            count: products.length,
            products: products.map(product => {
                return {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: product.image ? req.protocol + '://' + req.get('host') + '/' + product.image : null,
                    request: {
                        type: req.method,
                        url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + product.id
                    }
                }
            })
        });
    } catch(err) {
        res.status(404).json({
            message: err.message
        });
    };
}

// Product Detail
exports.show = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image ? req.protocol + '://' + req.get('host') + '/' + product.image : null
        });
    } catch(err) {
        res.status(404).json({
            message: err.message
        });
    }
}

// Product Save
exports.store = async (req, res) => {
    const product = new Product({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        image: req.file.path
    });
    try {
        await product.save();
        res.status(201).json({
            message: 'Product created successfully',
            url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + item.id
        });
    } catch(err) {
        res.status(404).json({
            message: err.message
        });
    }
}

// Product Update
exports.update = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, {$set: req.body});
        res.status(200).json({
            message: 'Product updated successfully'
        });    
    } catch(err) {
        res.status(404).json({
            message: err.message
        });
    }
}

// Product Delete
exports.destroy = async (req, res) => {
    try {
        await Product.findByIdAndRemove(req.params.id)
        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch(err) {
        res.status(404).json({
            message: err.message
        });
    }
}