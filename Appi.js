const express= require('express');
const mysql= require('mysql');
const bodyparser= require('body-parser');
const jwt = require("jsonwebtoken");
const JWT_Secret = 'claveSecreta';
const Connection = require('mysql/lib/Connection');
const port = process.env.port || 3050;
const app= express();
app.use(bodyparser.json());
app.use(function(res, res, next)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");

    next();
})

//myslq
const conexion= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
})

app.get('/', (req, res)=>{
    res.send("Bienvenidos");
});

//Listado de usuarios
app.get('/usuarios', (req, res)=>{

    const sql= 'SELECT * FROM usuarios';
    conexion.query(sql, (error, resultado)=>{
        if (error) throw error;
        if (resultado.length > 0){
            res.json(resultado)
        } else{
            res.send("No tenemos resultados");
        }
        
    })
});

//obtener usuario
app.get('/usuarios/:id', (req, res)=>{
    const {id }= req.params
    const sql= `SELECT * FROM usuarios WHERE id_Usuario= ${id}`
    conexion.query(sql, (error, resultado)=>{
        if (error) throw error;
        if (resultado.length > 0){
            res.json(resultado)
        } else{
            res.send("No tenemos resultados");
        }
        
    })
});

//Registro de usuarios
app.post('/registrar', (req, res)=>{
    const sql= 'INSERT INTO usuarios SET ?';
    const customerObj = {
        nombreUsuario: req.body.nombreUsuario,
        contrasena: req.body.contrasena
    }

    conexion.query(sql,customerObj, error =>{
        if(error) throw error;
        res.send(true);
    });
});

//Validar Usuario
app.post('/login',  (req, res) => {
    const {nombreUsuario, contrasena}= req.body;

        
            const sql = `SELECT * FROM usuarios WHERE nombreUsuario = '${nombreUsuario}' AND contrasena= '${contrasena}'`;
            conexion.query(sql, (error, result) => {
        
                if(result.length > 0){
    
                    
                   res.send(true);
                   
                    
                } else{
                    res.send(false);
                    
                }
                
            })
    
    
  });


//Actualizar usuarios
app.put('/actualizar/:id', (req, res)=>{
    const {id } = req.params;
    const {nombreUsuario, contrasena}= req.body;
    const sql= `UPDATE usuarios SET nombreUsuario= '${nombreUsuario}', contrasena = '${contrasena}' WHERE id_Usuario= ${id}`;

    conexion.query(sql, error =>{
        if(error) throw error;
        res.send(true);
        
    });
});

//Borrar

app.delete('/borrar/:id' , (req,res) =>{
    const {id }= req.params;
    const sql = `DELETE FROM usuarios WHERE id_Usuario= ${id}`;
    conexion.query(sql, error =>{
        if(error) throw error;
        res.send(true);
});
 });

//Validar conexion
conexion.connect(error => {
    if (error) throw error;
    console.log("conectado");
})

app.listen(port, () => console.log(`server en el puerto ${port}`))