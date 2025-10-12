import React, { use, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {toast } from 'react-toastify';
import { useAppContext } from '../context/ContextAPI';
import useDebounce from '../debounceHook/useDebounce';
import AutoResizeTextarea from '../components/AutoResizeTextarea';
import HamsterLoader from '../components/HamsterLoader';
import { useNavigate } from 'react-router-dom';

import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  EyeIcon,
  ShareIcon,
  LinkIcon,
  LockClosedIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  Squares2X2Icon, // Used for Multiple Choice icon
  PencilSquareIcon, // Used for Text Input icon
  ChevronDownIcon, // Used for Dropdown icon
  HashtagIcon, // Used for Numbers icon
  CalendarDaysIcon, // Used for Date icon
  XMarkIcon 
} from '@heroicons/react/24/outline';


const FormBuilder = () => {
  const  formID = useParams();  // returns an object of key value pairs of URL parameters
  // Example: If the route is defined as /formbuilder/:formID and the URL is /formbuilder/123,
  // then useParams() will return { formID: "123" }.

  const [formState, setFormState] = useState(null);
  const { token } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('Form Description');
  const [formObjective, setFormObjective] = useState('Form Objective');

  // State for top toggles
  const [isLive, setIsLive] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // State for questions (example: one Multiple Choice question)
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate(); 

  const firstRender = (fetchedForm) => {
    if (fetchedForm) {
      setFormTitle(fetchedForm.title || 'Untitled Form');
      setFormDescription(fetchedForm.description || 'Form Description');
      setFormObjective(fetchedForm.objective || 'Form Objective');
      setIsLive(fetchedForm.isLive || false);
      setAuthRequired(fetchedForm.authRequired || false);
      setIsAnonymous(fetchedForm.isAnonymous || false);
      setQuestions(fetchedForm.questions || []);
    }
  }

  useEffect(() => {
    if (formID) {
      try{
        const fetchFormData = async () => {
          const res = await axios.get(`http://localhost:3000/api/form/userForms/${formID.formID}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("Fetched Form Data:", res.data);
          if(res.data.success) setFormState(res.data.form);
          firstRender(res.data.form);
        };

        fetchFormData();

      }catch(error){
        console.error("Error fetching form data:", error);
        toast.error("Failed to fetch form data");
      }
  }
  }, [formID]);

  const debouncedFormState = useDebounce(formState, 500);

  useEffect(() => {
    if (debouncedFormState) {
      const updateFormData = async () => {
        try {
          const res = await axios.patch(`http://localhost:3000/api/form/userForms/${formID.formID}`, {
            formBody: debouncedFormState
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("Auto-saved Form Data:", res.data);
        } catch (error) {
          console.error("Error auto-saving form data:", error);
        }
      };
      updateFormData();
    }
  }, [debouncedFormState, formID]);



  useEffect(() => {
    // function to check whether any question text is not empty
      const hasEmptyQuestion = questions.some(q => q.questionText.trim() === "");
      if (hasEmptyQuestion) {
        return;
      }
    if (formTitle && formObjective) {
      const updatedFormState = {
        ...formState,

        title: formTitle,
        description: formDescription,
        objective: formObjective,
        isLive,
        authRequired,
        isAnonymous,
        questions
      };
      
      setFormState(updatedFormState);
    }
  }, [formTitle, formDescription, formObjective, isLive, authRequired, isAnonymous, questions]);


  // Function to add a new question (placeholder)
  const addQuestion = (type) => {
    const newQuestion = {
      id: `q${questions.length + 1}`,
      questionType: type,
      questionText: `New Question`,
      options: [],
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  
  const removeQuestion = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions.splice(qIndex, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionTextChange = (qIndex, newText) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].questionText = newText;
    setQuestions(newQuestions);
  }

  const toggleQuestionRequired = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].required = !newQuestions[qIndex].required;
    setQuestions(newQuestions);
  }

const addOptionToQuestion = (qIndex) => {
  const newQuestions = [...questions];
  newQuestions[qIndex].options.push(`Option ${newQuestions[qIndex].options.length + 1}`);
  setQuestions(newQuestions);
};

  const removeOptionFromQuestion = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const handleOptionTextChange = (qIndex, oIndex, newText) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = newText;
    setQuestions(newQuestions);
  };

  const renderQuestionIcon = (type) => {
    switch (type) {
      case 'mcq': return <Squares2X2Icon className="w-5 h-5" />;
      case 'text': return <PencilSquareIcon className="w-5 h-5" />;
      case 'rating': return <StarIcon className="w-5 h-5" />;
      case 'number': return <HashtagIcon className="w-5 h-5" />;
      case 'date': return <CalendarDaysIcon className="w-5 h-5" />;
      default: return <QuestionMarkCircleIcon className="w-5 h-5" />;
    }
  };


 const handleGenerateQuestion = async () => {
  setLoading(true);
  try {
    const res = await axios.get(
      `http://localhost:3000/api/form/${formID.formID}/suggestQuestions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      toast.success("Questions Loaded Successfully");
      setQuestions((prev) => [...prev, ...res.data.suggestions]);
    } else {
      toast.error(res.data.message || "Failed to generate questions");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if(loading) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  },[loading]);

  return (
    <div >
      {loading && <HamsterLoader />}

        <div className="min-h-screen flex font-sans relative ">
      {/* Fixed Left Sidebar - Add Question */}
      <aside className="w-64 pt-20 bg-white p-6 shadow-lg fixed top-0 left-0 h-full flex flex-col z-20 overflow-y-auto custom-scrollbar">
        {/* <h2 className="text-xl font-bold text-gray-800 mb-6">Add Question</h2> */}
        
        <div className="space-y-4 mt-4">
          {[
            { type: 'Multiple Choice', icon: <Squares2X2Icon className="w-5 h-5 mr-2 text-blue-500" />, key: 'mcq' },
            { type: 'Text Input', icon: <PencilSquareIcon className="w-5 h-5 mr-2 text-green-500" />, key: 'text' },
            { type: 'Rating', icon: <StarIcon className="w-5 h-5 mr-2 text-purple-500" />, key: 'rating' },
            /* { type: 'Numbers', icon: <HashtagIcon className="w-5 h-5 mr-2 text-yellow-500" />, key: 'number' },
            { type: 'Date', icon: <CalendarDaysIcon className="w-5 h-5 mr-2 text-red-500" />, key: 'date' }, */
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                 onClick={() => addQuestion(item.key)}>
              <span className="flex items-center text-gray-700 font-medium">
                {item.icon}
                {item.type}
              </span>
              <PlusIcon className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64  px-8  min-h-screen"> {/* Increased padding-top for fixed header */}

        {/* Top Header Controls - Fixed */}
       <div className="left-64 mb-8 rounded-xl right-0 bg-white shadow-md p-6 px-8">
  {/* Header Row */}
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-6">
      {/* Toggles */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-600">Is Live</span>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${isLive ? "bg-blue-500" : "bg-gray-300"}`}
        >
          <span
            className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isLive ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <LockClosedIcon className="w-4 h-4 text-gray-500" />
        <span className="text-xs text-gray-600">Auth Required</span>
        <button
          onClick={() => setAuthRequired(!authRequired)}
          className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${authRequired ? "bg-blue-500" : "bg-gray-300"}`}
        >
          <span
            className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${authRequired ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
        <span className="text-xs text-gray-600">Is Anonymous</span>
        <button
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${isAnonymous ? "bg-blue-500" : "bg-gray-300"}`}
        >
          <span
            className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAnonymous ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>
    </div>

    {/* Actions */}
    <div className="flex items-center space-x-3">
      <button
        onClick={() => navigate(`/formsubmit/${formID.formID}`, { state: { isPreview: true }})}

       className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-blue-50">
        <EyeIcon className="w-4 h-4 mr-1.5" /> Preview
      </button>
      <button
        onClick={() => {
          navigator.clipboard.writeText(`http://localhost:5000/formsubmit/${formID.formID}`);
          toast.success("Form link copied to clipboard");
        }}
       className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-blue-50">
        <LinkIcon className="w-4 h-4 mr-1.5" /> Copy Link
      </button>
    </div>
  </div>

  {/* Divider */}
  <hr className="border-gray-200 mb-6" />

  {/* Form Title Section */}
  <div className='flex flex-col gap-2 mb-4'>
      <input
    type="text"
    value={formTitle}
    placeholder="Form Title"
    onChange={(e) => setFormTitle(e.target.value)}
    className="text-3xl font-bold text-gray-800 w-full mb-2 border-b border-transparent focus:border-blue-500 hover:border-blue-400 transition-colors duration-200 focus:outline-none"
  />
  <input
    type="text"
    value={formDescription}
    placeholder="Form Description"
    onChange={(e) => setFormDescription(e.target.value)}
    className="text-gray-600 text-lg w-full mb-2 border-b border-transparent focus:border-blue-500 hover:border-blue-400 transition-colors duration-200 focus:outline-none"
  />
  <input
    type="text"
    value={formObjective}
    placeholder="Form Objective"
    onChange={(e) => setFormObjective(e.target.value)}
    className="text-gray-500 text-md italic w-full border-b border-transparent focus:border-blue-500 hover:border-blue-400 transition-colors duration-200 focus:outline-none"
  />
  </div>
</div>


        {/* Questions Section */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-lg border-2 border-dashed border-gray-300 text-center text-gray-500 text-lg py-20 mt-10">
              <p>Start Building Your Form</p>
              <p className="text-md mt-2">Select a question type or use Generate Question feature</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={question.id} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <div className="flex justify-between items-center mb-4">
          <div className="flex items-center flex-1">
            {renderQuestionIcon(question.questionType)}

            <AutoResizeTextarea
              value={question.questionText}
              onChange={(e) => handleQuestionTextChange(index, e.target.value)}
              placeholder="Enter your question"
            />
          </div>

          <div className="flex items-center space-x-3 ml-4">
            <TrashIcon
              onClick={() => removeQuestion(index)}
              className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer"
            />
            <span className="text-sm text-gray-600">Required</span>
            <button
              className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 
                ${question.required ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => toggleQuestionRequired(index)}
            >
              <span
                className={`h-5 w-5 bg-white rounded-full shadow-md transform transition-transform duration-300 
                  ${question.required ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </div>


                {/* Options for Multiple Choice/Rating */}
                  {question.questionType === 'mcq' && (
                  <div className="space-y-3 mt-4 ml-6">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center group">
                        <input type="radio" disabled className="mr-3" />
                          <>
                            <input type="text" value={option} onChange={(e) => handleOptionTextChange(index, oIndex, e.target.value)} className="flex-1 p-1 border-b border-transparent focus:outline-none focus:border-blue-400 focus:bg-gray-50 rounded-sm text-gray-700" />
                            <XMarkIcon onClick={() => removeOptionFromQuestion(index, oIndex)} className="w-5 h-5 text-gray-400 ml-2 cursor-pointer hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
      
                      </div>
                    ))}
                    <div className="flex items-center max-w-[40%] text-gray-400 italic cursor-pointer" onClick={() => addOptionToQuestion(index)}>
                            <input type="text" readOnly value="Add Option" className="bg-transparent focus:outline-none flex-1 p-1" />
                            <PlusIcon className="w-5 h-5 text-gray-400 ml-2 hover:text-blue-500" />
                    </div>
                  </div>
                )}

                {/* Placeholder for other question types */}
                {( question.questionType === 'text') && (
                  <div className="mt-4 ml-6"><input type="text" placeholder="User will enter text here..." disabled className="w-full p-2 border-b border-gray-200 rounded-md bg-gray-50 text-gray-500 italic" /></div>
                )}
                {( question.questionType === 'rating') && (
                  <div className="mt-4 ml-6"><input type="text" placeholder="User will provide rating " disabled className="w-full p-2 border-b border-gray-200 rounded-md bg-gray-50 text-gray-500 italic" /></div>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* Spacer for floating button */}
        <div className="h-40"></div>
      </div>

      {/* Floating Action Button - Generate Question */}
      <button 
        onClickCapture={() => handleGenerateQuestion()}
      className="fixed bottom-8 right-8 z-30 px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-full shadow-2xl hover:bg-green-600 transition-all transform hover:-translate-y-1">
        Generate Question
      </button>

    </div>
     
    </div>



  );
};

export default FormBuilder;