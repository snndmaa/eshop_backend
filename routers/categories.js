const express = require('express')
const router = express.Router()

const {Category} = require('../models/category')


router.get(`/`, async(req, res) => {
    const categoryList = await Category.find()

    if(!categoryList){
        res.status(500).json({success: false})
    }

    res.status(200).send(categoryList)
})

router.get('/:id', async(req, res) => {
    const category = await Category.findById(req.params.id)

    if(!category){
        res.status(500).json({message: "The category with the given ID was not found"})
    }
    res.status(200).send(category)
})

router.post('/', async(req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    
    category = await category.save().catch(e => console.log(e))

    if (!category){
        return res.status(404).send('Category Cannot be Created!')
    }

    res.send(category)
})

router.put('/:id', async(req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        {new:true}      //To output updated object instead of old object in res.send(category)
    )

    if(!category){
        return res.status(400).send('the category cannot be updated')
    }
    res.send(category)
})

router.delete(('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id)
    .then(category => {
        if(category){
            console.log(category)
            return res.status(200).json({success: true, message: 'the category has been deleted'})
        }
        else{
            return res.status(404).json({success: false, message: 'category not found'})
        }
        
    })
    .catch((e) => {
        return res.status(400).json({success: false, error: e})
    })
}))



module.exports = router