const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

/*
router.post("/",(req,res,next)=>{
    const product = new Product({
        //_id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save(function(err){
        console.log("product saved");
        if(err){
            console.log("error occured");
        }
    });
    res.status(201).json({
        message:"product created",
        createdProduct:product
    });
});
*/
//bütün verileri al
//find().select("name").exec().then().catch();
//select içindeki string i getir sadece 
router.get("/", (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});
// veri kaydet
router.post("/", (req, res, next) => {
    const product = new Product({
        //_id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "product created",
            createdProduct: product
        });
    }).catch(function (err) {
        console.log(err);
    });

});
/*
 router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({error: err});
    });

}); */

// spesifik veri al
router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("from database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "invalid id" });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});
// veri sil
router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});
// Patch istenilen şekilde çalışmıyor !!!
/*
router.patch("/:productId", (req, res, next) => {
    console.log("patch ici");
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    console.log("gelindi");
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});
*/
//Çalşıyor
router.patch("/:productId",(req,res,next)=>{
    const id=req.params.productId;
    Product.update({_id:id},{$set:{"name":req.body.name, "price":req.body.price}})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    });
});


module.exports = router;
