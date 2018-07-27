const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Order = require("../models/order");
const Product = require("../models/product");


router.post("/", (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: "Product not found!" });
            }
            const order = new Order({
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        }).then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order Stored!",
                orderCreated: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: "http://127.0.0.1:3000/orders" + result._id
                }
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500), json({ error: err });
        })
});

router.get("/", (req, res, next) => {
    Order.find()
        .select()
        .populate("product","name")
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: "http://127.0.0.1:3000/orders/" + doc._id
                        }
                    }
                })

            });
        })
        .catch(err => {
            console.log(err);
            res.status(500), json({ error: err });
        });
});

router.get("/:orderId",(req,res,next)=>{
    
    Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then(order=>{
        if(!order){
            return res.status(404).json({message:"Order not found!"});
        }
        res.status(200).json({
            order:order,
            request:{
                type:"GET",
                url:"someurl"
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});


router.delete("/:orderId", (req, res, next) => {
    Order.remove({_id:req.params.orderId})
    .exec()
    .then(order=>{
        if(!order){
            return res.status(404).json({message:"Order not found!"});
        }
        res.status(200).json({
            message:"Order Deleted",
            request:{
                type:"DELETE",
                url:"http://127.0.0.1:3000/"+req.params.orderId
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});

module.exports = router;