const {expressjwt} = require('express-jwt')

function authJWT(){
    const secret = process.env.json_secret
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({ path: [
        {url: /\/api\/products(.*)/, methods: ['GET', 'OPTIONS']},
        {url: /\/api\/categories(.*)/, methods: ['GET', 'OPTIONS']},
        '/api/zzz', 
        '/api/users/login',
        '/api/users/register'
        
    ] 
    })
}

async function isRevoked(req, token){
    if(!token.payload.isAdmin){
        return true     //non admin user isRevoked
    }

    return false
}

module.exports = authJWT