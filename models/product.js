const number = require('joi/lib/types/number')
const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{              //Array of Strings
        type: String
    }],
    brand: {
        type: String,
        default: 0
    },
    category: {            //One(Category) to Many(Products)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})


/*Given you're using Mongoose, you can use 'virtuals', 
which are essentially fake fields that Mongoose creates. 
They're not stored in the DB, they just get populated at run time*/

productSchema.virtual('id').get(function (){
    console.log(this._id)
    return this._id.toHexString()
})

productSchema.set('toJSON', {
    virtuals: true
})

exports.Product = mongoose.model('Product', productSchema)