const express = require('express')
const router = express.Router()
const fetchAPI = import('node-fetch')

router.get(`/`, async(req, res) => {
    // console.log(req.query.url)
    (await fetchAPI)
    .default(req.query.url)
    .then(response => response.json())
    .then(json => res.send(json))
    .catch(e => res.send(e))
})

module.exports = router