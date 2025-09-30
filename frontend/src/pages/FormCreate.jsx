import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/ContextAPI';

const FormCreate = () => {
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  // State to control the animation
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { token } = useAppContext();
  const navigate = useNavigate();
  // Trigger the animation shortly after the component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsModalVisible(true), 100);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // Handles the form submission
  const handleCreateForm = async(e) => {
    e.preventDefault(); // Prevent page reload
    // Simple validation
    if (title.trim() === '' || objective.trim() === '') {
      alert('Please fill out both fields to create the form.');
      return;
    }
    // Log the data to the console (replace with your form creation logic)
    console.log('Form Creation Initiated:', { title, objective });
    // alert(`Starting form creation for: "${title}"`);
    // Here, you would typically navigate away or close the modal

    try{
        const res = await axios.post("http://localhost:3000/api/form/userForms", {
            title : title,
            objective : objective,
        },
        {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
        if(res.data.success){
            console.log("Form Created with ID:", res.data);
            toast.success("Form Created Successfully");
            navigate("/formbuilder/" + res.data.formId);
        }
    }catch(err){
        console.log(err);
    }
  };

  return (
    <div className="relative font-sans">
      {/* The semi-transparent backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"></div>

      {/* Modal container centered on the screen */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        {/* The modal box with animation */}
        <div
          className={`
            bg-white w-full max-w-md p-8 rounded-xl shadow-2xl text-center
            transform transition-all duration-500 ease-in-out
            ${isModalVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
          `}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create a New Form ✨
          </h2>
          <p className="text-gray-500 mb-6">
            Let's begin by defining the purpose of your form.
          </p>
          
          <form onSubmit={handleCreateForm} className="space-y-5 text-left">
            {/* Title Input Field */}
            <div>
              <label htmlFor="form-title" className="block mb-1.5 text-sm font-semibold text-gray-700">
                Title
              </label>
              <input
                id="form-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title of the form"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                required
                autoFocus
              />
            </div>
            
            {/* Objective Input Field */}
            <div>
              <label htmlFor="form-objective" className="block mb-1.5 text-sm font-semibold text-gray-700">
                Objective
              </label>
              <input
                id="form-objective"
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Enter Objective of the Form"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                required
              />
            </div>
            
            {/* Create Form Button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 text-white font-bold bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:-translate-y-0.5"
            >
              Create Form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormCreate;