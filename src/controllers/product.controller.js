const express = require("express");

const Product = require("../models/product.model");

const uploadSingleFile = require("../middlewares/upload");

const authenticate = require("../middlewares/authenticate");
const authorise = require("../middlewares/authorise");

const router = express.Router();

router.get("", async (req, res) => {   //any one can see the all products
  try {
    const products = await Product.find().populate({path:"user_id", select: {name:1, email:1, roles:1}}).lean().exec();

    return res.send(products);
  } catch (err) {
    return res.status(500).send(err);
  }
});
//post the products by seller or admin only
router.post(
  "/singleFile",
  authenticate,
  authorise(["Seller", "Admin"]),
  uploadSingleFile("image_urls"),
  async (req, res) => {
    try {
      const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        image_urls: req.file.path,
        user_id: req.body.user_id,
      });

      return res.send({ product });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);
//edit the products by seller or admin only
router.patch(
  "/singleFile/:id",
  authenticate,
  authorise(["Seller", "Admin"]),
  uploadSingleFile("image_urls"),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }).lean().exec();
      return res.send({ product });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);
//delete the products by seller or admin only
router.delete(
  "/singleFile/:id",
  authenticate,
  authorise(["Seller", "Admin"]),
  uploadSingleFile("image_urls"),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id)
      .lean().exec();
      return res.send({ product });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);
module.exports = router;
