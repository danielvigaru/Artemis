import { createContext } from "react";

const AccountContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    username: "",
    password: "",
});

export default AccountContext;
