import { useAuth } from "../../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ Component }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate("/");
    return null;
  }
  return <Component />;
};

export default PrivateRoute;
