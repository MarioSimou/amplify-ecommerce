import { Flex, Link, Button } from "@aws-amplify/ui-react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useAuth } from "../../../providers/AuthProvider";

const NavbarLink = ({ title, href, isExternal }) => {
  return (
    <Link as={ReactRouterLink} to={href} isExternal={isExternal} color="black">
      {title}
    </Link>
  );
};

const Navbar = () => {
  const { currentUser, signOut } = useAuth();
  return (
    <Flex
      padding="0.6rem 1rem"
      backgroundColor="lightgray"
      as="nav"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex>
        <NavbarLink title="Home" href="/" />
        <NavbarLink title="Profile" href="/profile" />
      </Flex>
      <Flex>
        {currentUser && (
          <Button variation="primary" backgroundColor="red" onClick={signOut}>
            Sign out
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
