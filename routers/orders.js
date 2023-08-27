const express = require('express')
const router = express.Router()

const { Order } = require('../models/order')
const { OrderItem } = require('../models/order-items')


router.get(`/`, async(req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1})

    if(!orderList){
        res.status(500).json({success: false})
    }

    res.send(orderList)
})

router.post(`/`, async(req, res) => {

    //There could be more than one promise being returned due to the map therefore Promise.all combines all promises into one
    const orderItemIds = Promise.all(req.body.orderItems.map( async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save()
        
        return newOrderItem._id
    }))

    const orderIdsResolved = await orderItemIds

    let order = new Order({
        orderItems: orderIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })

    order = order.save()
    .then((order) => {
        return res.send(order)
    })
    .catch(e => res.status(500).send({error: e}))
})

router.get(`/:id`, (req, res) => {
    const order = Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ path: 'orderItems', populate: {path: 'product', populate: 'category'} })

    .then((order) => res.send(order))
    .catch(e => res.status(404).send({error: e}))
})

module.exports = router