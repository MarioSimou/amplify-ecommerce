import { withAuthenticator } from "@aws-amplify/ui-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Profile from "./components/pages/Profile";
import Navbar from "./components/shared/Navbar";
import Product from "./components/pages/Product";
import PrivateRoute from "./components/shared/PrivateRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:guid" element={<Product />} />
        <Route path="/profile" element={<PrivateRoute Component={Profile} />} />
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
