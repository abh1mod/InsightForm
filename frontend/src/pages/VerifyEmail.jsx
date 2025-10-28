
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/ContextAPI";
import { toast } from 'react-toastify';
import { API_URL } from "../config/api.js";

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
                const res = await axios.get(`${API_URL}/api/auth/verify/${token}`);
                if (res.data.token) {
                    toast.success(res.data.message);
                    console.log(res.data);
                    login(res.data.token); 
                    navigate("/dashboard");
                }

            } catch (error) {
                toast.error(error.response?.data?.message || "Email verification failed!");
                setMessage("Email verification failed or the token has expired.");
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