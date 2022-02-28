import { Text, Heading, Flex, Divider } from "@aws-amplify/ui-react";
import { useAuth } from "../../../providers/AuthProvider";

const Profile = () => {
  const { currentUser } = useAuth();
  return (
    <Flex direction="column" padding="1rem">
      <Heading level={2}>User profile</Heading>
      <Divider />
      <Text>{JSON.stringify(currentUser.attributes, null, 2)}</Text>
    </Flex>
  );
};

export default Profile;
