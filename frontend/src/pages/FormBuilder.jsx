import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppContext } from "../context/ContextAPI";
import useDebounce from "../debounceHook/useDebounce";
import HamsterLoader from "../components/HamsterLoader";
import { useNavigate } from "react-router-dom";
import SortableItem from "../components/sortableItem";
import { Item } from "../components/item";
import { API_URL } from "../config/api.js";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

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
  XMarkIcon,
  CheckIcon,
  Bars3Icon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const FormBuilder = () => {
  // const formID = useParams(); // returns an object of key value pairs of URL parameters
  // Example: If the route is defined as /formbuilder/:formID and the URL is /formbuilder/123,
  // then useParams() will return { formID: "123" }.
  
  const { formID } = useParams();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [activeId, setActiveId] = useState(null);
  const [formState, setFormState] = useState(null);
  const { token, logout } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showDraftSaved, setShowDraftSaved] = useState(false);
  

  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formDescription, setFormDescription] = useState("Form Description");
  const [formObjective, setFormObjective] = useState("Form Objective");

  // State for top toggles
  const [isLive, setIsLive] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // State for questions (example: one Multiple Choice question)
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();

  // Broadcast channel for cross-tab sync with Dashboard
  const [channel] = useState(() => {
    try {
      return new BroadcastChannel("insightform");
    } catch (e) {
      return null;
    }
  });

  // Skip broadcasting from autosave when we've already broadcasted due to a direct user toggle
  const skipNextAutosaveBroadcast = React.useRef(false);
  
  const broadcastFormStatus = (status, source = 'auto') => {
    const payload = {
      formId: formID,
      isLive: status,
      title: formTitle,
      eventId: `${Date.now()}-${Math.random()}`,
    };
    
    if (source === 'user') {
      skipNextAutosaveBroadcast.current = true;
    }

    if (channel) {
      channel.postMessage({ type: "FORM_STATUS", payload });
    }
    
    try {
      localStorage.setItem(
        "insightform:event",
        JSON.stringify({ type: "FORM_STATUS", payload })
      );
    } catch (error) {
      console.error("Failed to set localStorage:", error);
    }
  };

  // Toggle isLive with immediate broadcast to keep Dashboard in sync
  const handleToggleIsLive = () => {
    const next = !isLive;
    setIsLive(next);
    setFormState((prev) => ({ ...(prev || {}), isLive: next }));
    broadcastFormStatus(next, 'user');
  };

  const firstRender = (fetchedForm) => {
    if (fetchedForm) {
      setFormTitle(fetchedForm.title || "Untitled Form");
      setFormDescription(fetchedForm.description || "Form Description");
      setFormObjective(fetchedForm.objective || "Form Objective");
      setIsLive(fetchedForm.isLive || false);
      setAuthRequired(fetchedForm.authRequired || false);
      setIsAnonymous(fetchedForm.isAnonymous || false);
      
      // Ensure all questions have unique IDs
      const questionsWithIds = (fetchedForm.questions || []).map((question, index) => ({
        ...question,
        id: question.id || `q_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
      }));
      
      setQuestions(questionsWithIds);
    }
  };

  useEffect(() => {
    if (formID) {
      try{
        const fetchFormData = async () => {
          const res = await axios.get(`${API_URL}/api/form/userForms/${formID}`, {
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
        if(error.response){
                    if(error.response.data.message === "invalid/expired token" && token){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
                    else{
                        toast.error(error.response.data.message);
                    }
                }
      }
  }
  }, [formID]);

  const debouncedFormState = useDebounce(formState, 2500);

  useEffect(() => {
    if (debouncedFormState) {
      let isValid = true;
      questions.forEach((q) => {
        if(q.questionType === 'number'){
          const minVal = (q.min === '' || q.min === null) ? null : parseFloat(q.min);
          const maxVal = (q.max === '' || q.max === null) ? null : parseFloat(q.max);

          if (minVal === null || maxVal === null) {
              isValid = false;
              return false;
          }

          if (isNaN(minVal) || isNaN(maxVal)) {
              isValid = false;
              return false;
          }

          if (maxVal < minVal) {
              isValid = false;
              return false;
          }
        }
      });
      if (!isValid) {
        console.log("Form data invalid, skipping auto-save.");
        return;
      }
      const updateFormData = async () => {
        try {
          const res = await axios.patch(
            `${API_URL}/api/form/userForms/${formID}`,
            {
              formBody: debouncedFormState,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Auto-saved Form Data:", res.data);
          
          // Show draft saved popup
          setShowDraftSaved(true);
          setTimeout(() => setShowDraftSaved(false), 3000);
          
          // If isLive changed, broadcast to Dashboard and other tabs with a unique eventId
          if (typeof debouncedFormState.isLive === "boolean") {
            // If we recently broadcasted a user-initiated toggle, skip the autosave broadcast to avoid duplicates
            if (skipNextAutosaveBroadcast.current) {
              skipNextAutosaveBroadcast.current = false;
            } else {
              broadcastFormStatus(debouncedFormState.isLive, 'auto');
            }
          }
        } catch (error) {
          console.error("Error auto-saving form data:", error);
          if(error.response){
                    if(error.response.data.message === "invalid/expired token" && token){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
                    else{
                        toast.error(error.response.data.message);
                    }
                }
        }
      };
      updateFormData();
    }
  }, [debouncedFormState, formID]);

  // Listen for external status changes to keep local toggle in sync
  useEffect(() => {
    const onMessage = (ev) => {
      const { type, payload } = ev.data || {};
      if (type === "FORM_STATUS" && payload?.formId === formID) {
        setIsLive(!!payload.isLive);
      }
    };
    channel && channel.addEventListener("message", onMessage);
    const onStorage = (e) => {
      if (e.key === "insightform:event" && e.newValue) {
        try {
          const { type, payload } = JSON.parse(e.newValue);
          if (type === "FORM_STATUS" && payload?.formId === formID) {
            setIsLive(!!payload.isLive);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      channel && channel.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
    };
  }, [channel, formID]);

  useEffect(() => {
    // function to check whether any question text is not empty
    const hasEmptyQuestion = questions.some(
      (q) => q.questionText.trim() === ""
    );
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
        questions,
      };

      setFormState(updatedFormState);
    }
  }, [
    formTitle,
    formDescription,
    formObjective,
    isLive,
    authRequired,
    isAnonymous,
    questions,
  ]);

  // Function to add a new question (placeholder)
  const addQuestion = (type) => {
    const newQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      questionType: type,
      questionText: `New Question`,
      options: [],
      min: type === "number" ? -1000 : null,
      max: type === "number" ? 1000 : null,
      required: false,
    };
    setQuestions([...questions, newQuestion]);
    
    // Scroll to bottom after adding question
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleGenerateQuestion = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/form/${formID}/suggestQuestions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Questions Loaded Successfully");
        setQuestions((prev) => [...prev, ...res.data.suggestions]);
        
        // Scroll to bottom after generating questions
        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      } else {
        toast.error(res.data.message || "Failed to generate questions");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
      if(error.response){
                    if(error.response.data.message === "invalid/expired token" && token){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
                    else{
                        toast.error(error.response.data.message );
                    }
                }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [loading]);

  function handleDragEnd(event) {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }

  function handleDragStart(event) {
    const {active} = event;
    setActiveId(active.id);
  }


  return (
    <div>
      {loading && <HamsterLoader />}

      <div className="min-h-screen flex font-sans relative ">
        {/* Fixed Left Sidebar - Add Question */}
        <aside className="w-64 pt-20 bg-white p-6 shadow-lg fixed top-0 left-0 h-full flex flex-col z-20 overflow-y-auto custom-scrollbar">
          {/* <h2 className="text-xl font-bold text-gray-800 mb-6">Add Question</h2> */}

          <div className="space-y-4 mt-4">
            {[
              {
                type: "Multiple Choice",
                icon: <Squares2X2Icon className="w-5 h-5 mr-2 text-blue-500" />,
                key: "mcq",
              },
              {
                type: "Text Input",
                icon: (
                  <PencilSquareIcon className="w-5 h-5 mr-2 text-green-500" />
                ),
                key: "text",
              },
              {
                type: "Rating",
                icon: <StarIcon className="w-5 h-5 mr-2 text-purple-500" />,
                key: "rating",
              },
              {
                type: 'Numbers',
                icon: <HashtagIcon className="w-5 h-5 mr-2 text-yellow-500" />,
                key: 'number',
              }
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                onClick={() => addQuestion(item.key)}
              >
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
        <div className="flex-1 ml-64  px-8  min-h-screen">
          {" "}
          {/* Increased padding-top for fixed header */}
          {/* Top Header Controls - Fixed */}
          <div className="left-64 mb-8 rounded-xl right-0 bg-white shadow-md p-6 px-8">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-6">
                {/* Toggles */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Is Live</span>
                  <button
                    onClick={handleToggleIsLive}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                      isLive ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        isLive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <LockClosedIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">Auth Required</span>
                  <button
                    onClick={() => setAuthRequired(!authRequired)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                      authRequired ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        authRequired ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">Is Anonymous</span>
                  <button
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                      isAnonymous ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        isAnonymous ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    navigate(`/formsubmit/${formID}`, {
                      state: { isPreview: true, formOwnerId: formID },
                    })
                  }
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-blue-50"
                >
                  <EyeIcon className="w-4 h-4 mr-1.5" /> Preview
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/formsubmit/${formID}`
                    );
                    toast.success("Form link copied to clipboard");
                  }}
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-blue-50"
                >
                  <LinkIcon className="w-4 h-4 mr-1.5" /> Copy Link
                </button>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 mb-6" />

            {/* Form Title Section */}
            <div className="flex flex-col gap-2 mb-4">
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
                <p className="text-md mt-2">
                  Select a question type or use Generate Question feature
                </p>
              </div>
            ) : (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
              >
                <SortableContext 
                  items={questions.map(question => question.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {questions.map((question, index) => (
                    <SortableItem key={question.id} question={question} index={index} questions={questions} setQuestions={setQuestions} />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <Item 
                      id={activeId} 
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
          {/* Spacer for floating button */}
          <div className="h-40"></div>
        </div>

        {/* Floating Action Button - Generate Question */}
        <button
          onClickCapture={() => handleGenerateQuestion()}
          className="fixed bottom-8 right-8 z-30 px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-full shadow-2xl hover:bg-green-600 transition-all transform hover:-translate-y-1"
        >
          Generate Question
        </button>

        {/* Draft Saved Popup */}
        {showDraftSaved && (
          <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
            <div className="bg-green-500 text-white px-3 py-2 rounded-md shadow-md flex items-center space-x-1.5">
              <CheckIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Draft Saved</span>
            </div>
          </div>
        )}




      </div>
    </div>
  );
};

export default FormBuilder;
