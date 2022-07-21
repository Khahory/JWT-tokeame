const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const SECRETE_KEY = 'mi-clave-secreta-xd';

//add rutas
app.get('/api/post', verificarToken, (req, res) => {
    jwt.verify(req.token, SECRETE_KEY, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const posts = [
                {id: 1, nombre: 'titulo 1', user: 'angel'},
                {id: 2, nombre: 'titulo 2', user: 'angel'},
                {id: 3, nombre: 'titulo 3', user: 'angel'},
            ]
            res.json({posts})
        }
    })
})

//get access to here
app.post('/login', (req, res) => {
    const user = {
        nombre: 'Kha',
        email: 'a@a.com',
        id: 1
    }

    //identificar al usuario
    jwt.sign({user}, SECRETE_KEY, {expiresIn: '60s'}, (err, token) => {
        if (err) return; //si hay algun error pues muere
        res.json({
            token
        })
    })
});

//este post solo serar accecible on JWT si tiene un token
app.post('/api/post', verificarToken, (req, res) => {
    jwt.verify(req.token, SECRETE_KEY, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                mensaje: 'pose fue creado',
                authData
            })
        }
    })
});

//veamos si tiene accesp con nuestro token de login
function verificarToken(req, res, next){
    //  Authorization: Bearer <token>
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== "undefined"){
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(3000, () => {
    console.log('correindo');
})
