const {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");

const DYNAMODB_PRODUCTS_TABLE_NAME = process.env.DYNAMODB_PRODUCTS_TABLE_NAME;

if (!DYNAMODB_PRODUCTS_TABLE_NAME) {
  throw new Error("error: invalid configuration for dynamodb");
}

const dynamoDBClient = new DynamoDBClient();

const ErrProductsNotFound = new Error("error: products not found");

const mapItemToProduct = (item) => ({
  guid: item?.guid?.S,
  name: item?.name?.S,
  description: item?.description?.S,
  price: parseFloat(item?.price?.N),
  createdAt: item?.createdAt?.S,
});

const mapProductToItem = (product) => {
  return Object.entries(product).reduce(
    (item, [attributeName, attributeValue]) => {
      if (!attributeValue) {
        return item;
      }

      if (attributeName === "price") {
        return { ...item, [attributeName]: { N: attributeValue.toFixed(2) } };
      }

      return {
        ...item,
        [attributeName]: { S: attributeValue },
      };
    },
    {}
  );
};

const getProductByGuid = async (guid) => {
  try {
    const command = new GetItemCommand({
      TableName: DYNAMODB_PRODUCTS_TABLE_NAME,
      Key: {
        guid: {
          S: guid,
        },
      },
    });

    const { Item: item } = await dynamoDBClient.send(command);
    if (!item?.guid) {
      return [ErrProductsNotFound];
    }
    const product = mapItemToProduct(item);
    return [undefined, product];
  } catch (e) {
    return [e];
  }
};

const deleteProductByGUID = async (guid) => {
  try {
    const command = new DeleteItemCommand({
      TableName: DYNAMODB_PRODUCTS_TABLE_NAME,
      Key: {
        guid: {
          S: guid,
        },
      },
    });

    await dynamoDBClient.send(command);
    return [undefined];
  } catch (e) {
    return [e];
  }
};

const putProduct = async (product) => {
  try {
    const command = new PutItemCommand({
      TableName: DYNAMODB_PRODUCTS_TABLE_NAME,
      Item: mapProductToItem(product),
    });

    await dynamoDBClient.send(command);

    const [getProductByGuidError, newProduct] = await getProductByGuid(
      product.guid
    );
    if (getProductByGuidError) {
      return [getProductByGuidError];
    }
    return [undefined, newProduct];
  } catch (e) {
    return [e];
  }
};

const getProducts = async () => {
  try {
    const command = new ScanCommand({
      TableName: DYNAMODB_PRODUCTS_TABLE_NAME,
    });

    const { Items: items } = await dynamoDBClient.send(command);

    if (items.length === 0) {
      return [ErrProductsNotFound];
    }

    const products = items.map(mapItemToProduct);
    return [undefined, products];
  } catch (e) {
    return [e];
  }
};

module.exports = {
  getProducts,
  getProductByGuid,
  deleteProductByGUID,
  putProduct,
  ErrProductsNotFound,
};
