import React from "react";
import {useAuth} from "../../AuthContext";
import EmailPasswordAccountDetails from "./EmailPasswordAccountDetails";
import EmailPasswordAccountForm from "./EmailPasswordAccountForm";

const EmailPasswordAccount = () => {
    const {user} = useAuth()

    return user?.isEmailPassword ? <EmailPasswordAccountDetails/> : <EmailPasswordAccountForm/>
}

export default EmailPasswordAccount
