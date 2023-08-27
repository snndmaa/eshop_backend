const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const {Product} = require('../models/product')
const { Category } = require('../models/category')


router.get(`/`, async(req, res) => {
    //localhost:3000/api/products?categories=523421,7867454
    let filter = {}
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category')

    if(!productList){
        res.status(500).json({success: false})
    }

    res.send(productList)
})

router.get('/:id', async(req, res) => {
    try{
        const product = await Product.findById(req.params.id).populate('category')

        if(!product){
            res.status(500).json({message: "The Product with the given ID was not found"})
        }
        res.status(200).send(product)
    }
    catch(e){
        res.status(404).send(e.name == 'CastError' ? 'Product could not be found' : e)
    }
})

router.post(`/`, async(req, res) => {
    try{
        const category = Category.findById(req.body.category)


        // if (!category) return res.status(406).send('Invalid Category')
        var product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        })
    
        product = await product.save()
      
        if(!product){
            return res.status(500).send('Product cannot be created!')
        }
    
        return res.send(product)
    }
    catch(e) {
        res.status(506).send(e.errors.category.name == 'CastError' ? 'Category Invalid' : e)
    }


    // product.save()      //Can call .then() because .save() is asynchronous and returns a promise you can wait on
    // .then((createdProduct) => {
    //     res.status(201).json(createdProduct)
    // })
    // .catch((e) => res.status(500).json({
    //     error: e,
    //     success: false
    // }))
})

router.put('/:id', async(req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product ID')
    }
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {new:true}      //To output updated object instead of old object in res.send(category)
    )

    if(!product){
        return res.status(400).send('the product cannot be updated')
    }
    res.send(product)
})

router.delete(`/:id`, (req, res) => {
    Product.findByIdAndRemove(req.params.id)
    .then(product => {
        if(product){
            return res.status(200).json({success: true, message: 'The product has been deleted'})
        }
        else{
            return res.status(404).json({success: false, message: 'product not found'})
        }
    })
    .catch((e) => {
        return res.status(500).json({success: false, error: e})
    })
})

router.get(`/get/count`, async(req, res) => {
    try{
        const productCount = await Product.countDocuments({})

        if(!productCount){
            res.status(500).json({success: "false"})
        }
        res.status(202).send({
            count: productCount
        })
    }
    catch(e){
        res.status(404).send(e.name == 'CastError' ? 'Product not found' : e)
    }
})

router.get('/get/featured/:count', async(req, res) => {
    const count = req.params.count ? req.params.count : 0
    try{
        const products = await Product.find({isFeatured: true}).limit(+count)

        if(!products){
            res.status(500).json({message: "No featured Products"})
        }
        res.status(200).send(products)
    }
    catch(e){
        res.status(404).send(e.name == 'CastError' ? 'Product could not be found' : e)
    }
})

module.exports = router