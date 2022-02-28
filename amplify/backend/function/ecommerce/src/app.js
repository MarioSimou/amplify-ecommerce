const {
  putBodySchema,
  postBodySchema,
  guidParamsSchema,
} = require("./validation");
const { v4 } = require("uuid");
const express = require("express");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const {
  getProductByGuid,
  getProducts,
  deleteProductByGUID,
  putProduct,
  ErrProductsNotFound,
} = require("./dynamodb");

const app = express();
app.use(express.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  next();
});

app.get("/api/v1/products", async function (req, res) {
  const [getProductsError, products] = await getProducts();
  if (getProductsError) {
    if (getProductsError) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: getProductsError.message,
      });
    }

    return res.status(500).json({
      status: 500,
      success: false,
      message: getProductsError.message,
    });
  }

  return res.status(200).json({
    status: 200,
    success: true,
    data: products,
  });
});

app.get("/api/v1/products/:guid", async function (req, res) {
  const { error: guidValidationError } = guidParamsSchema.validate(req.params);
  if (guidValidationError) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: guidValidationError.message,
    });
  }
  const { guid } = req.params;
  const [getProductByGuidError, product] = await getProductByGuid(guid);
  if (getProductByGuidError) {
    if (getProductByGuidError === ErrProductsNotFound) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: getProductByGuidError.message,
      });
    }
  }
  res.json({ status: 200, success: true, data: product });
});

app.post("/api/v1/products", async function (req, res) {
  const { error: bodyValidationError } = postBodySchema.validate(req.body);
  if (bodyValidationError) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: bodyValidationError.message,
    });
  }

  const [putProductError, product] = await putProduct({
    ...req.body,
    guid: v4(),
    createdAt: new Date().toISOString(),
  });
  if (putProductError) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: putProductError.message,
    });
  }
  res.status(201).json({ status: 201, success: true, data: product });
});

app.put("/api/v1/products/:guid", async function (req, res) {
  const { error: guidValidationError } = guidParamsSchema.validate(req.params);
  if (guidValidationError) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: guidValidationError.message,
    });
  }

  const { error: bodyValidationError } = putBodySchema.validate(req.body);
  if (bodyValidationError) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: bodyValidationError.message,
    });
  }
  const { guid } = req.params;

  const [getProductByGuidError, product] = await getProductByGuid(guid);
  if (getProductByGuidError) {
    if (getProductByGuidError === ErrProductsNotFound) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: getProductByGuidError.message,
      });
    }

    return res.status(500).json({
      status: 500,
      success: false,
      message: getProductByGuidError.message,
    });
  }

  const [putProductError, newProduct] = await putProduct({
    ...product,
    name: req.body?.name ?? product.name,
    description: req.body?.description ?? product.description,
    price: req.body?.price ?? product.price,
  });
  if (putProductError) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: putProductError.message,
    });
  }
  res.status(200).json({ status: 200, success: true, data: newProduct });
});

app.delete("/api/v1/products/:guid", async function (req, res) {
  const { error: guidValidationError } = guidParamsSchema.validate(req.params);
  if (guidValidationError) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: guidValidationError.message,
    });
  }
  const { guid } = req.params;
  const [getProductByGuidError, product] = await getProductByGuid(guid);
  if (getProductByGuidError) {
    if (getProductByGuidError === ErrProductsNotFound) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: getProductByGuidError.message,
      });
    }

    return res.status(500).json({
      status: 500,
      success: false,
      message: getProductByGuidError.message,
    });
  }
  const [deleteProductByError] = await deleteProductByGUID(product.guid);
  if (deleteProductByError) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: deleteProductByError.message,
    });
  }
  res.status(204).json({ status: 204, success: true });
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
