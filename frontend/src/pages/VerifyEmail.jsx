
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/ContextAPI";
import { toast } from 'react-toastify';

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