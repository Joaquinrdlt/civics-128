import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App";

function AppBootstrap() {
  const [backendState, setBackendState] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function configureBackend() {
      try {
        const response = await fetch("/amplify_outputs.json");
        if (response.status === 404) {
          if (active) {
            setBackendState("local");
          }
          return;
        }
        if (!response.ok) {
          throw new Error(`Backend configuration request failed (${response.status}).`);
        }

        if (!response.headers.get("content-type")?.includes("application/json")) {
          if (active) {
            setBackendState("local");
          }
          return;
        }

        const outputs = await response.json();
        if (Object.keys(outputs).length === 0) {
          if (active) {
            setBackendState("local");
          }
          return;
        }
        if (
          !outputs.auth?.user_pool_id ||
          !outputs.auth?.user_pool_client_id ||
          !outputs.data?.url
        ) {
          throw new Error("The Amplify backend configuration is incomplete.");
        }

        Amplify.configure(outputs);
        if (active) {
          setBackendState("cloud");
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error.message);
          setBackendState("error");
        }
      }
    }

    configureBackend();
    return () => {
      active = false;
    };
  }, []);

  if (backendState === "loading") {
    return <p role="status">Loading Civics Flashcards...</p>;
  }
  if (backendState === "error") {
    return (
      <p role="alert">
        Could not initialize cloud sign-in: {errorMessage}
      </p>
    );
  }
  if (backendState === "local") {
    return <App />;
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <App cloudEnabled user={user} signOut={signOut} />
      )}
    </Authenticator>
  );
}

export default AppBootstrap;
