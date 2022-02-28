import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";
import { AmplifyProvider } from "@aws-amplify/ui-react";
import "./index.css";
import AuthProvider from "./providers/AuthProvider";

Amplify.configure(awsExports);

ReactDOM.render(
  <React.StrictMode>
    <AmplifyProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AmplifyProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
