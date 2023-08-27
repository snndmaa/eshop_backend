const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const authJWT = require('./helpers/jwt')
const errorCatch = require('./helpers/error-handler')

//envVariables
require('dotenv/config')
const api = process.env.API_URL
// const connection_string = process.env.connectDB
const connection_string = process.env.localDB


//Models
// const Product = require('./models/product')


//Routes
const categoriesRouter = require('./routers/categories')
const ordersRouter = require('./routers/orders')
const productsRouter = require('./routers/products')
const usersRouter = require('./routers/users')
const fetchRouter = require('./routers/fetch')
const res = require('express/lib/response')

//Middleware - Checks everything going to the server before execution
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(authJWT())
app.use(errorCatch)

app.options('*', cors())


//urls
app.use(`${api}categories`, categoriesRouter)
app.use(`${api}orders`, ordersRouter)
app.use(`${api}products`, productsRouter)
app.use(`${api}users`, usersRouter)
app.use(`${api}zzz`, fetchRouter)

app.get('/', (req, res) => {
    res.send('app.js GET')
})

//Add connection to database before server starts
mongoose.connect(connection_string)
.then(() => console.log('Database Connected!'))
.catch((e) => {
    e.code === "ECONNREFUSED" ? console.log('Unable to Connect to database servers. Check your Connection and try again') : ''
})



app.listen(3000, () => {
    console.log('Server Running on http://localhost:3000')
})

