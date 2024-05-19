import React from "react";
import { useUserAuth } from "../context/UserAuthContext";
import Todos from "./todos";

const Home = () => {
  const { user } = useUserAuth();

  return (
    <div>
      <h1>Home</h1>
      {user && <p>Welcome, {user.email}!</p>}
      <Todos />
    </div>
  );
};

export default Home;