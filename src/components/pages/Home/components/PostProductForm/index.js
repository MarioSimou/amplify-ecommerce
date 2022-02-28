import React from "react";
import { Flex, TextAreaField, TextField, Button } from "@aws-amplify/ui-react";
import useFormValues from "../../../../../hooks/useFormValues";
import useProducts from "../../../../../hooks/useProducts";
import { useAuth } from "../../../../../providers/AuthProvider";

const PostProductForm = ({ setProducts }) => {
  const { isAdmin } = useAuth();
  const { postProduct, isLoading } = useProducts();
  const { formValues, handleOnChange, handleOnFocus, resetFormValues } =
    useFormValues({
      name: {
        touched: false,
        value: "",
        error: "",
      },
      description: {
        touched: false,
        value: "",
        error: "",
      },
      price: {
        touched: false,
        value: 0,
        error: "",
      },
    });

  const onClickPostProduct = React.useCallback(async () => {
    const name = formValues.name.value;
    const description = formValues.description.value;
    const price = formValues.price.value;
    const [e, newProduct] = await postProduct({ name, description, price });
    if (e) {
      return window.alert(e.message);
    }
    setProducts((products) => [...products, newProduct]);
    resetFormValues();
    return;
  }, [
    setProducts,
    formValues.name.value,
    formValues.description.value,
    formValues.price.value,
    postProduct,
    resetFormValues,
  ]);

  if (!isAdmin) {
    return null;
  }

  return (
    <Flex as="form" direction="column" width="100%">
      <TextField
        id="name"
        label="Name:"
        descriptiveText="name assigned to the product"
        value={formValues.name.value}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        placeholder="Your product name"
        isRequired
      />
      <TextAreaField
        id="description"
        label="Description:"
        value={formValues.description.value}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        descriptiveText="any information you want to associate along the product"
        placeholder="Your description"
      />
      <TextField
        id="price"
        type="number"
        label="Price:"
        value={formValues.price.value}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        isRequired
      />
      <Button
        variation="primary"
        onClick={onClickPostProduct}
        isLoading={isLoading}
      >
        Submit product
      </Button>
    </Flex>
  );
};

export default PostProductForm;
