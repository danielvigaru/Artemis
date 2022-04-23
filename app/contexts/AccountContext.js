import { createContext } from "react";

const AccountContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    username: "",
});

export default AccountContext;
