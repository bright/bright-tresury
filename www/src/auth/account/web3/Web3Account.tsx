import React from "react";
import {useAuth} from "../../AuthContext";
import Web3AccountDetails from "./Web3AccountDetails";
import Web3AccountForm from "./Web3AccountForm";

const Web3Account = () => {
    const {user} = useAuth()

    // return user?.isWeb3 ? <Web3AccountDetails/> : <Web3AccountForm/>
    return <Web3AccountDetails/>
}

export default Web3Account
