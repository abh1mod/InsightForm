
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/ContextAPI";

const VerifyEmail = () =>{
    const { token } = useParams();
    const [message, setMessage] = useState("Verifying Email...");
    const { login, isLoggedIn } = useAppContext();
    const navigate = useNavigate();
    useEffect(() => {
        if(!token ) return;
        // console.log(token);
        // Call your API to verify the email using the token
        const verifyEmail = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/auth/verify/${token}`);
                if (res.data.token) {
                    setMessage(res.data.message);
                    console.log(res.data);
                    login(res.data.token); // Save token in context + localStorage
                    navigate("/dashboard");
                }

            } catch (error) {
                console.error("Error verifying email:", error.response ? error.response.data : error.message);
                // Handle error (e.g., show an error message)
            }
        };
        verifyEmail();

    },[token])

    console.log("Verification token:", token);
    return (<div>
        {message}

    </div>)
}
export default VerifyEmail;