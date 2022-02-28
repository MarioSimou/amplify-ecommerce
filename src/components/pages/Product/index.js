import { Flex, Loader } from "@aws-amplify/ui-react";
import ProductCard from "../Home/components/ProductCard";
import { useParams } from "react-router-dom";
import useProducts from "../../../hooks/useProducts";
import React from "react";

const Profile = () => {
  const [product, setProduct] = React.useState();
  const { getProductByGuid } = useProducts();
  const { guid } = useParams();

  React.useEffect(() => {
    const fetchProduct = async () => {
      const [e, product] = await getProductByGuid(guid);
      if (e) {
        return window.alert(e.message);
      }

      setProduct(product);
    };
    fetchProduct();
  }, [setProduct, getProductByGuid, guid]);

  return (
    <Flex direction="column" padding="1rem">
      {!product && <Loader size="large" />}
      {product && <ProductCard product={product} />}
    </Flex>
  );
};

export default Profile;
