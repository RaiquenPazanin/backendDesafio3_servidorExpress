/*const http = require('http');
const express = require('express')
const port = 8080;

const server = http.createServer((req, res) =>{
    res.end('Bienvenido a nuestro servidor http')
})

server.listen(port, ()=>{
    console.log(`Servidor escuchando puerto :${port}`)
})
*/
//get: trigo informacion
//post: Subo cosas a la base de datos
//put: actualizo cosas en la base de datos
//delet: borro de la base de datos
const express = require('express');
const port = 8080;
const app = express();
const fs = require ('fs');
const { nextTick } = require('process');


class Contenedor{
    constructor(file){
        this.file = file;
        this.elements = [];
    }

    async save(title, price, thumbnail){

        try{
            let newProduct = {
				title: title,
				price: price,
				thumbnail: thumbnail,
				id: this.elements.length + 1,
			}
			this.elements.push(newProduct);

            await fs.writeFileSync(this.file, JSON.stringify(this.elements));
            console.log(`Producto ${title} agregado a ${this.file}`);

        }catch (error) {
            console.log(this.file);
            console.log(this.elements)
            console.log(`ERROR: No se pudo agregar un producto. ${error}` );
        }
    }

    async getById(id){
        try{
            let data;
            data = JSON.parse(await fs.readFileSync(`./${this.file}`, 'utf-8'));
            const element = data.find(dato => dato.id === id);
            console.log(element);
        }catch(error){
            console.log(`ERROR: ${error}` );
        }
        
    }

    async deletById(id){
        try{
            let data;
            data = JSON.parse(await fs.readFileSync(`./${this.file}`, 'utf-8'));
            var newArray = data.filter((item) => item.id !== id);
            for (let index = 0; index < newArray.length; index++) {
                newArray[index].id=index+1;
                
            }
            console.log(newArray);
        }catch(error){
            console.log(`ERROR: ${error}` );
        }
        

    }

    getAll(){

        let data;
        data = JSON.parse(fs.readFileSync(`./${this.file}`, 'utf-8'));
        return(data);
    }

    async deletAll(){
        try{
            let data = [];
            fs.writeFileSync(this.file, JSON.stringify(data));
            console.log("Se eliminaron todos los elementos del archivo")
        }catch(error){
            console.log(`ERROR: ${error}` );
        }
       
    }

}

app.use((req, res, next)=>{

    miArchivo = new Contenedor("miArchivo.txt");
    miArchivo.save("coca", 200, "WWWW...");
    miArchivo.save("agua", 201, "WWWW...");
    miArchivo.save("pepsi", 202, "WWWW...");
    next();
})

app.get('/productos', (req, res)=>{
    let productList = miArchivo.getAll();
    res.send(productList);

})

app.get('/productoRandom', (req, res)=>{

    let productList = miArchivo.getAll();
    let idShow = Math.floor(Math.random() * productList.length) + 1;
    let productShow = productList.filter(product => product.id == idShow);
    res.send(productShow);
    
})

app.listen(port, (error)=>{
    if(!error){
        console.log(`Servidor escuchando puerto :${port}`);
    }else{
        console.log(`hubo un error ${error}`);
    }
    
})

