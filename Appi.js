const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const JWT_Secret = 'claveSecreta';
const Connection = require('mysql/lib/Connection');
const port = process.env.port || 3050;
const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(function (res, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");

    next();
})

//myslq
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
})

app.get('/', (req, res) => {
    res.send("Bienvenidos");
});

//Listado de usuarios
app.get('/usuarios', (req, res) => {

    const sql = 'SELECT * FROM usuarios';
    conexion.query(sql, (error, resultado) => {
        if (error) throw error;
        if (resultado.length > 0) {
            res.json(resultado)
        } else {
            res.send("No tenemos resultados");
        }

    })
});

//obtener usuario
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params
    const sql = `SELECT * FROM usuarios WHERE id_Usuario= ${id}`
    conexion.query(sql, (error, resultado) => {
        if (error) throw error;
        if (resultado.length > 0) {
            res.json(resultado)
        } else {
            res.send("No tenemos resultados");
        }

    })
});

//Registro de usuarios
app.post('/registrar', (req, res) => {
    const sql = 'INSERT INTO usuarios SET ?';
    const customerObj = {
        nombreUsuario: req.body.nombreUsuario,
        contrasena: req.body.contrasena
    }

    conexion.query(sql, customerObj, error => {
        if (error) throw error;
        res.send(true);
    });
});

//Validar Usuario
app.post('/login', (req, res) => {
    const { nombreUsuario, contrasena } = req.body;


    const sql = `SELECT * FROM usuarios WHERE nombreUsuario = '${nombreUsuario}' AND contrasena= '${contrasena}'`;
    conexion.query(sql, (error, result) => {

        if (result.length > 0) {
            jwt.sign(
                { user: result },
                "secretKey",
                { expiresIn: "1d" },
                function (err, token) {
                  if (err) {
                    res.send(false)
                  } else {
                    res.json (token);
                  }
                }
              );


        } else {
            res.send(false);

        }

    })


});

//Autorización del token

app.post("/post", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretKey", (error, authData) => {
        if (error) {
            res.send(false);
        } else {
            res.send(true);
        }
    });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}


//Actualizar usuarios
app.put('/actualizar/:id', (req, res) => {
    const { id } = req.params;
    const { nombreUsuario, contrasena } = req.body;
    const sql = `UPDATE usuarios SET nombreUsuario= '${nombreUsuario}', contrasena = '${contrasena}' WHERE id_Usuario= ${id}`;

    conexion.query(sql, error => {
        if (error) throw error;
        res.send(true);

    });
});

//Borrar

app.delete('/borrar/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM usuarios WHERE id_Usuario= ${id}`;
    conexion.query(sql, error => {
        if (error) throw error;
        res.send(true);
    });
});

//Validar conexion
conexion.connect(error => {
    if (error) throw error;
    console.log("conectado");
})

app.listen(port, () => console.log(`server en el puerto ${port}`))