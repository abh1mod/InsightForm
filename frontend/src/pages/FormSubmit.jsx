import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/ContextAPI";
import FormNotFound from "./FormNotFound.jsx"
import SuccessfullSubmission from "./SuccessfullSubmission.jsx"
import AuthRequired from "./AuthRequired.jsx"
import { API_URL } from "../config/api.js";
import Loader from "../components/Loader.jsx";
import HamsterLoader from "../components/HamsterLoader.jsx";


// ⭐ Star Icon and Rating Component
const StarIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);

const StarRating = ({ rating, onRatingChange, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseMove = (e, index) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    setHoverRating(isHalf ? index - 0.5 : index);
  };

  const handleMouseLeave = () => {
    if (!disabled) setHoverRating(0);
  };

  const handleClick = (e, index) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    onRatingChange(isHalf ? index - 0.5 : index);
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => {
        const index = i + 1;
        const displayRating = hoverRating || rating;
        let fillPercentage = "0%";

        if (displayRating >= index) fillPercentage = "100%";
        else if (displayRating >= index - 0.5) fillPercentage = "50%";

        return (
          <div
            key={index}
            className={`relative cursor-pointer ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(e, index)}
          >
            <StarIcon className="w-6 h-6 text-gray-300" />
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: fillPercentage }}
            >
              <StarIcon className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FormSubmit = () => {
  const { formID } = useParams();
  const location = useLocation();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const isPreview = location.state?.isPreview || false;
  const formOwnerId = location.state?.formOwnerId || null;

  const [userId, setUserId] = useState(null);
  const { token, logout } = useAppContext();
  const [authRequired, setAuthRequired] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSubmit, setShowSubmitSuccess] = useState(false);
  const [submissionUnderProcess, setSubmissionUnderProcess] = useState(false);

useEffect(() => {
  if(!authRequired) return;
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }

      });
      if (res.data.success) {
        setUserId(res.data.userId);
      } 
    } catch (error) {
      console.error("Error fetching user:", error);
      setUserId(null);
      if(error.response){
                    if(error.response.data.message === "invalid/expired token" && token){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
            }
    }
  };
  fetchUser();
}, [authRequired]);

useEffect(()=>{
  if(token) setIsLoggedIn(true);
}, [token]);



  // Fetch form details
useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const routeURL = isPreview ? `${API_URL}/api/response/preview/${formID}` : `${API_URL}/api/response/viewForms/${formID}`
        const res = await axios.get(
          routeURL,             {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        if (res.data.success) {
          setAuthRequired(res.data.form.authRequired);
          setForm(res.data.form);
        } else {
          console.log(res)
          console.log(res.data.message || "Form not found");
        }
      } catch (error) {
        console.log(error);
        console.log(error.response?.data?.message || "Error loading form");
          if(error.response){
                    if(error.response.data.message === "invalid/expired token" && token){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
                    else{
                        toast.error(error.response.data.message);
                    }
                }
      } finally {
        setLoading(false);
      }
    };
    fetchFormDetails();
  }, [formID]);

  const [error, setError] = useState({});
  // This function can be inside your FormBuilder component
  const validateNumberRange = (min, max, value, questionId) => {
      // Convert empty strings to null for easier checking
      if (value < min || value > max) {
        setError((prev) => ({ ...prev, [questionId]: `Please provide a number between ${min} and ${max}.` }));
        return; // Error found
      }
      setError((prev) => ({ ...prev, [questionId]: "" }));
      return; // No error, validation passes
  };
 
  const handleChange = (questionId, value, index) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    if(form.questions[index].questionType === "number" && form.questions[index]._id === questionId){
      validateNumberRange(form.questions[index].min, form.questions[index].max, value, questionId);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionUnderProcess(true);
    // Validate required questions
    for (const q of form.questions) {
      const ans = responses[q._id];
      if (q.required && (!ans || ans === "")) {
        toast.error(`Please answer: "${q.questionText}"`);
        setSubmissionUnderProcess(false);
        return;
      }
      if(q.questionType === "number" && ans && (ans < q.min || ans > q.max)){
        toast.error(`Please provide a number between ${q.min} and ${q.max} for: "${q.questionText}"`);
        setSubmissionUnderProcess(false);
        return;
      }
    }

    const payload = {
      responseData: {
        userId: userId ? userId.toString() : null,
        responses: form.questions.map((q) => ({
          questionId: q._id,
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.questionType === "mcq" ? q.options : [],
          answer: String(responses[q._id] || ""),
          min: q.questionType === "number" ? q.min : null,
          max: q.questionType === "number" ? q.max : null,
        })),
      },
    };  
    console.log(payload)

    try {
      const res = await axios.post(
        `${API_URL}/api/response/submitResponse/${formID}`,
        payload
      );
      if (res.data.success) {
        // toast.success("Form submitted successfully!");
        setShowSubmitSuccess(true);
        setResponses({});
      } else {
        toast.error(res.data.message || "Submission failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    }
    finally{
      setSubmissionUnderProcess(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">Loading form...</div>
    );

  if (!form)
    return (
          <FormNotFound/>
    );

    if(showSubmit){
      return <SuccessfullSubmission/>
    }

  return (
    

    <>
  {  (authRequired && !isLoggedIn) ?     <AuthRequired/> : 

    <div className="flex justify-center items-start bg-gray-50 p-6 sm:p-4 min-h-screen">
        {submissionUnderProcess && (  
            <Loader />       
        )}
      <div className="flex flex-col w-full max-w-3xl space-y-6">

        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-blue-500">
          <h1 className="text-3xl font-semibold text-gray-800">
            {form.title}
          </h1>
          <p className="text-gray-600 mt-2">{form.description}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full space-y-6"
        >
          {form.questions.map((q, index) => (
            <div
              key={q._id}
              className="bg-white w-full p-8 rounded-xl shadow-md border-l-4 border-blue-500"
            >
              <label className="block font-medium text-gray-800 text-lg">
                {q.questionText}{" "}
                {q.required && <span className="text-red-500">*</span>}
              </label>

              {/* TEXT */}
              {q.questionType === "text" && (
                <textarea
                  disabled={isPreview}
                  placeholder="Your answer..."
                  className="mt-4 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
                  value={responses[q._id] || ""}
                  onChange={(e) => handleChange(q._id, e.target.value, index)}
                />
              )}

              {/* Number */}
              {q.questionType === "number" && (
                <div>
                  <input
                    type="number"
                    disabled={isPreview}
                    placeholder="Your answer..."
                    className="mt-4 w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
                    value={responses[q._id] || ""}
                    onChange={(e) => handleChange(q._id, e.target.value, index)}
                  />
                  {error[q._id] && <div className="text-red-500 text-sm mt-1">{error[q._id]}</div>}
                </div>
              )}
              {/* MCQ */}
              {q.questionType === "mcq" && (
                <div>
                  <div className="mt-4 space-y-3">
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className="flex items-center space-x-3 text-gray-700"
                    >
                      <input
                        disabled={isPreview}
                        type="radio"
                        name={`question-${index}`}
                        value={opt}
                        checked={responses[q._id] === opt}
                        onChange={(e) => handleChange(q._id, e.target.value, index)}
                        className="text-blue-600 focus:ring-blue-500"
                        required={q.required}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {
                  responses[q._id] && 
                    <div
                  className="text-sm text-gray-500 mt-2 ml-6 block hover:text-gray-700 underline pointer cursor-pointer"
                  onClick={() => {
                    if (isPreview) return;
                    handleChange(q._id, "", index);
                  }}
                >
                  Clear
                  </div>
                }

                </div>
                
              )}

              {/* RATING */}
              {q.questionType === "rating" && (
                <div className="flex flex-col md:gap-6 md:flex-row ">
                <div className="mt-4">
                  <StarRating
                    rating={responses[q._id] || 0}
                    onRatingChange={(val) => handleChange(q._id, val, index)}
                    disabled={isPreview}
                  />
                </div>

                {responses[q._id] && <div
                  className="text-sm text-gray-500 mt-2 md:mt-4 block hover:text-gray-700 underline pointer cursor-pointer"
                  onClick={() => {
                    if (isPreview) return;
                    handleChange(q._id, "", index);
                  }}
                >
                  Clear
                  </div>}

                </div>
              )}
            </div>
          ))}

       <button
  disabled={isPreview}
  type="submit"
  className="
  min-w-[15%]
    mt-6 mr-3
    py-3 px-6
    font-semibold text-white
    rounded-lg
    bg-blue-600
    shadow-md
    hover:bg-blue-700 hover:shadow-lg
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    active:bg-blue-800
    transform hover:-translate-y-0.5
    transition-all duration-150 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
  "
>
  Submit
</button>
        </form>
      </div>
    </div>
  }
    </>
  );
};

export default FormSubmit;
