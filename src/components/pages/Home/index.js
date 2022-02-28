import { Text, Flex, Loader } from "@aws-amplify/ui-react";
import React from "react";
import useProducts from "../../../hooks/useProducts";
import ProductCard from "./components/ProductCard";
import { useNavigate } from "react-router-dom";
import PostProductForm from "./components/PostProductForm";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const { getProducts, deleteProductByGuid, isLoading } = useProducts();

  const onClickDeleteProduct = React.useCallback(
    async (guid) => {
      const [e] = await deleteProductByGuid(guid);
      console.log(e);
      if (e) {
        return window.alert(e.message);
      }
      setProducts((products) =>
        products.filter((product) => product.guid !== guid)
      );

      return;
    },
    [deleteProductByGuid]
  );

  const onClickViewProduct = React.useCallback(
    async (guid) => {
      navigate(`/products/${guid}`);
    },
    [navigate]
  );

  React.useEffect(() => {
    const fetchProducts = async () => {
      const [e, products] = await getProducts();
      if (e) {
        return window.alert(e.message);
      }
      setProducts(products);
    };
    fetchProducts();
  }, [setProducts, getProducts]);

  return (
    <Flex padding="1rem" direction="column">
      <Flex>
        <PostProductForm setProducts={setProducts} />
      </Flex>
      <Flex direction="column">
        {isLoading && <Loader size="large" />}
        {products.length === 0 && !isLoading && <Text>Products not found</Text>}
        {!isLoading &&
          products.length > 0 &&
          products.map((product) => {
            return (
              <ProductCard
                product={product}
                key={product.guid}
                onDelete={onClickDeleteProduct}
                onView={onClickViewProduct}
              />
            );
          })}
      </Flex>
    </Flex>
  );
};

export default Home;
