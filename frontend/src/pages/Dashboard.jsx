import { useAppContext } from "../context/ContextAPI";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { logout, token } = useAppContext();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);

  // Fetch user forms
  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/forms/userForms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setForms(data.forms || []);
      } else {
        toast.error(data.message || 'Failed to fetch forms');
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Error fetching forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchForms();
    }
  }, [token]);

  // Handle form deletion
  const handleDeleteForm = async (formId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/forms/userForms/${formId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Form deleted successfully');
        fetchForms(); // Refresh the forms list
      } else {
        toast.error(data.message || 'Failed to delete form');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Error deleting form');
    }
    setShowDeleteModal(false);
    setFormToDelete(null);
  };

  // Handle create new form
  const handleCreateForm = () => {
    const title = prompt('Enter form title:');
    const objective = prompt('Enter form objective:');
    
    if (title && objective) {
      createNewForm(title, objective);
    }
  };

  const createNewForm = async (title, objective) => {
    try {
      const response = await fetch('http://localhost:5000/api/forms/userForms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, objective })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Form created successfully');
        fetchForms(); // Refresh the forms list
        // Navigate to form editor (you can implement this navigation)
        window.location.href = `/form-editor/${data.formId}`;
      } else {
        toast.error(data.message || 'Failed to create form');
      }
    } catch (error) {
      console.error('Error creating form:', error);
      toast.error('Error creating form');
    }
  };

  // Toggle form live status
  const toggleFormStatus = async (formId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/forms/userForms/${formId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formBody: { isLive: !currentStatus }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Form ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchForms(); // Refresh the forms list
      } else {
        toast.error(data.message || 'Failed to update form status');
      }
    } catch (error) {
      console.error('Error updating form status:', error);
      toast.error('Error updating form status');
    }
  };

  // Toggle authentication requirement
  const toggleAuthRequirement = async (formId, currentAuthRequired) => {
    try {
      const response = await fetch(`http://localhost:5000/api/forms/userForms/${formId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formBody: { authRequired: !currentAuthRequired }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Authentication requirement ${!currentAuthRequired ? 'enabled' : 'disabled'} successfully`);
        fetchForms(); // Refresh the forms list
      } else {
        toast.error(data.message || 'Failed to update authentication requirement');
      }
    } catch (error) {
      console.error('Error updating authentication requirement:', error);
      toast.error('Error updating authentication requirement');
    }
  };

  // Toggle anonymous status
  const toggleAnonymousStatus = async (formId, currentIsAnonymous) => {
    try {
      const response = await fetch(`http://localhost:5000/api/forms/userForms/${formId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formBody: { isAnonymous: !currentIsAnonymous }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Anonymous status ${!currentIsAnonymous ? 'enabled' : 'disabled'} successfully`);
        fetchForms(); // Refresh the forms list
      } else {
        toast.error(data.message || 'Failed to update anonymous status');
      }
    } catch (error) {
      console.error('Error updating anonymous status:', error);
      toast.error('Error updating anonymous status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={handleCreateForm}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Create New Form
              </button>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Welcome to InsightForm!</h2>
            <p className="text-green-700">
              Manage your forms and view their status. Click on form names to edit them.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No forms found. Create your first form!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
                <div key={form._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 
                        className="text-xl font-semibold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                        onClick={() => window.location.href = `/form-editor/${form._id}`}
                      >
                        {form.title}
                      </h3>
                      <p className="text-gray-600 mt-1">Click to edit this form</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFormStatus(form._id, form.isLive)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          form.isLive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {form.isLive ? 'Live' : 'Offline'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleAuthRequirement(form._id, form.authRequired)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        form.authRequired 
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      Auth: {form.authRequired ? 'Required' : 'Not Required'}
                    </button>
                    
                    <button
                      onClick={() => toggleAnonymousStatus(form._id, form.isAnonymous)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        form.isAnonymous 
                          ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      Anonymous: {form.isAnonymous ? 'Yes' : 'No'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setFormToDelete(form);
                        setShowDeleteModal(true);
                      }}
                      className="px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the form "{formToDelete?.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setFormToDelete(null);
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteForm(formToDelete._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
