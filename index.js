// import express from 'express'

// const app = express();
// let port;

// app.get("/tasks", (req, res) =>{
//     res.send("Getting All Tasks")
// })

// app.get("/tasks", (req, res) =>{
//     res.send("Getting specific Task")
// })
// app.get("/tasks", (req, res) =>{
//     res.send("Creating a Task")
// })

// if (process.env.PORT ){
//     port= process.env.PORT;
// } else {
//     port = 3000
// }

// app.listen(port, () => {
//     console.log('sever running on port 3000....')
// })

import express from 'express';
import { PrismaClient } from '@prisma/client';
const app = express();
const prisma = new PrismaClient();


app.use(express.json());


app.get('/api/products', async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
});


app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: { id: parseInt(id) }
    });
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
});


app.post('/api/products', async (req, res) => {
    const { productTitle, productDescription, unitsLeft, pricePerUnit, isOnOffer } = req.body;
    const newProduct = await prisma.product.create({
        data: {
            productTitle,
            productDescription,
            unitsLeft,
            pricePerUnit,
            isOnOffer
        }
    });
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { productTitle, productDescription, unitsLeft, pricePerUnit, isOnOffer } = req.body;

    const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
            productTitle,
            productDescription,
            unitsLeft,
            pricePerUnit,
            isOnOffer
        }
    });
    res.json(updatedProduct);
});


app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await prisma.product.delete({
        where: { id: parseInt(id) }
    });
    res.json(deletedProduct);
});


app.get('/api/products/on-offer', async (req, res) => {
    const productsOnOffer = await prisma.product.findMany({
        where: { isOnOffer: true }
    });
    res.json(productsOnOffer);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
