import React from "react";
import { API } from "aws-amplify";

const REACT_APP_BACKEND_API_NAME = process.env.REACT_APP_BACKEND_API_NAME;
if (!REACT_APP_BACKEND_API_NAME) {
  throw new Error("error: invalid configuration for backend api");
}

const useProducts = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const getProducts = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const { success, message, data } = await API.get(
        REACT_APP_BACKEND_API_NAME,
        "/api/v1/products"
      );
      if (!success) {
        throw new Error(message);
      }
      setIsLoading(false);
      return [undefined, data];
    } catch (e) {
      setIsLoading(false);

      if (/404/.test(e.message)) {
        return [undefined, []];
      }
      return [e];
    }
  }, []);
  const getProductByGuid = React.useCallback(async (guid) => {
    try {
      setIsLoading(true);
      const { success, message, data } = await API.get(
        REACT_APP_BACKEND_API_NAME,
        `/api/v1/products/${guid}`
      );
      if (!success) {
        throw new Error(message);
      }
      setIsLoading(false);
      return [undefined, data];
    } catch (e) {
      setIsLoading(false);
      return [e];
    }
  }, []);
  const deleteProductByGuid = React.useCallback(async (guid) => {
    try {
      setIsLoading(true);

      await API.del(REACT_APP_BACKEND_API_NAME, `/api/v1/products/${guid}`);
      setIsLoading(false);
      return [undefined];
    } catch (e) {
      setIsLoading(false);
      return [e];
    }
  }, []);
  const postProduct = React.useCallback(
    async ({ name, price, description }) => {
      try {
        const { success, message, data } = await API.post(
          REACT_APP_BACKEND_API_NAME,
          "/api/v1/products",
          { body: { name, price, description } }
        );
        if (!success) {
          throw new Error(message);
        }

        return [undefined, data];
      } catch (e) {
        return [e];
      }
    },
    []
  );

  return {
    getProducts,
    getProductByGuid,
    deleteProductByGuid,
    postProduct,
    isLoading,
  };
};

export default useProducts;
