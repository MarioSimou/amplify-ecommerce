import { Card, Text, Heading, Flex, Button } from "@aws-amplify/ui-react";
import { useAuth } from "../../../../../providers/AuthProvider";

const ProductLabel = ({ label, content }) => {
  return (
    <Flex direction="column" gap="0">
      <Text variation="primary" fontWeight={600} as="span">
        {label}
        {`:`}
      </Text>
      <Text as="span">{content}</Text>
    </Flex>
  );
};

const ProductCard = ({ product, onDelete, onView }) => {
  const { isAdmin } = useAuth();

  return (
    <Card border="1px solid gray">
      <Flex direction="column" padding="0.5rem 0 1rem 0">
        <Heading level={4}>{product.name}</Heading>
        <Flex direction="column" gap="0.25rem">
          {product.description && (
            <ProductLabel label="Description" content={product.description} />
          )}
          <ProductLabel
            label="Price"
            content={`£${product.price.toFixed(2)}`}
          />
        </Flex>
      </Flex>
      <Flex gap="0.25rem">
        <Button size="small" onClick={() => onView(product.guid)}>
          View
        </Button>
        {isAdmin && (
          <Button size="small" onClick={() => onDelete(product.guid)}>
            Delete
          </Button>
        )}
      </Flex>
    </Card>
  );
};

export default ProductCard;
