import { useAppContext } from "../context/ContextAPI";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { logout, token } = useAppContext();

  // Hover states for floating buttons
  const [isHovered, setIsHovered] = useState(false);
  const [isCreateHovered, setIsCreateHovered] = useState(false);

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const seenEventKeys = useRef(new Set());
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const NOTIF_STORAGE_KEY = "if:notifications";
  const NOTIF_NEWCOUNT_KEY = "if:notifications:newCount";

  const clearNotificationsStorage = () => {
    try {
      sessionStorage.removeItem(NOTIF_STORAGE_KEY);
      sessionStorage.removeItem(NOTIF_NEWCOUNT_KEY);
    } catch {}
    setNotifications([]);
    setNewNotificationCount(0);
  };

  // Broadcast channel for cross-tab updates
  const channel = useRef(
    (() => {
      try {
        return new BroadcastChannel("insightform");
      } catch {
        return null;
      }
    })()
  );

  // Add a notification entry (session only; not persisted)
  const pushNotification = (message) => {
    setNotifications((prev) => {
      const next = [
        {
          id: `${Date.now()}-${Math.random()}`,
          message,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 10); // cap at 10
      try {
        sessionStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    setNewNotificationCount((prev) => {
      const next = Math.min((prev || 0) + 1, 10);
      try {
        sessionStorage.setItem(NOTIF_NEWCOUNT_KEY, String(next));
      } catch {}
      return next;
    });
  };

  // Fetch user forms
  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/form/userForms", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        const incoming = Array.isArray(data.forms) ? data.forms : [];
        incoming.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setForms(incoming);
      } else {
        if (data.message === "invalid/expired token") {
          toast.error("Your session has expired. Please log in again.");
          logout();
          return;
        }
        if (data.message && data.message.toLowerCase().includes("no forms")) {
          setForms([]);
        } else {
          toast.error(data.message || "Failed to fetch forms");
        }
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Error fetching forms");
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

  useEffect(() => {
    if (token) fetchForms();
  }, [token]);

  // If token disappears (logout/session expired), clear session notifications
  useEffect(() => {
    if (!token) {
      clearNotificationsStorage();
    }
  }, [token]);

  // Restore notifications for this session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(NOTIF_STORAGE_KEY);
      const initial = saved ? JSON.parse(saved) : [];
      if (Array.isArray(initial)) setNotifications(initial);
      const savedCount = Number(
        sessionStorage.getItem(NOTIF_NEWCOUNT_KEY) || 0
      );
      setNewNotificationCount(Number.isFinite(savedCount) ? savedCount : 0);
    } catch {}
  }, []);

  // Cross-tab communication: BroadcastChannel
  useEffect(() => {
    if (!channel.current) return;
    const onMessage = (ev) => {
      const { type, payload } = ev.data || {};
      const key =
        payload?.eventId ||
        `${type}:${payload?.formId || payload?.title || ""}:${payload?.isLive}`;
      if (key && seenEventKeys.current.has(key)) return;
      if (key) seenEventKeys.current.add(key);
      if (type === "FORM_CREATED") {
        pushNotification(
          `New form created: ${payload?.title || payload?.formId}`
        );
        fetchForms();
      }
      if (type === "FORM_DELETED") {
        pushNotification(`Form deleted: ${payload?.title || payload?.formId}`);
        fetchForms();
      }
      if (type === "FORM_STATUS") {
        pushNotification(
          `Form ${payload?.title || payload?.formId} is now ${
            payload?.isLive ? "Live" : "Offline"
          }`
        );
        setForms((prev) =>
          prev.map((f) =>
            f._id === payload.formId ? { ...f, isLive: payload.isLive } : f
          )
        );
      }
    };
    channel.current.addEventListener("message", onMessage);
    return () => channel.current.removeEventListener("message", onMessage);
  }, []);

  // Fallback: localStorage events
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "insightform:event" && e.newValue) {
        try {
          const { type, payload } = JSON.parse(e.newValue);
          const key =
            payload?.eventId ||
            `${type}:${payload?.formId || payload?.title || ""}:${
              payload?.isLive
            }`;
          if (key && seenEventKeys.current.has(key)) return;
          if (key) seenEventKeys.current.add(key);
          if (type === "FORM_CREATED") {
            pushNotification(
              `New form created: ${payload?.title || payload?.formId}`
            );
            fetchForms();
          }
          if (type === "FORM_DELETED") {
            pushNotification(
              `Form deleted: ${payload?.title || payload?.formId}`
            );
            fetchForms();
          }
          if (type === "FORM_STATUS") {
            pushNotification(
              `Form ${payload?.title || payload?.formId} is now ${
                payload?.isLive ? "Live" : "Offline"
              }`
            );
            setForms((prev) =>
              prev.map((f) =>
                f._id === payload.formId ? { ...f, isLive: payload.isLive } : f
              )
            );
          }
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Clear notification count when notifications panel is opened
  const handleNotificationToggle = () => {
    setShowNotifications((v) => !v);
    if (!showNotifications) {
      setNewNotificationCount(0);
      try {
        sessionStorage.setItem(NOTIF_NEWCOUNT_KEY, "0");
      } catch {}
    }
  };

  // Handle form deletion
  const handleDeleteForm = async (formId) => {
    const previousForms = forms;
    setForms((prev) => prev.filter((f) => f._id !== formId));
    setShowDeleteModal(false);
    setFormToDelete(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/form/userForms/${formId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Form deleted successfully");
        pushNotification(`Form deleted: ${formToDelete?.title || formId}`);
        channel.current &&
          channel.current.postMessage({
            type: "FORM_DELETED",
            payload: { formId },
          });
        localStorage.setItem(
          "insightform:event",
          JSON.stringify({ type: "FORM_DELETED", payload: { formId } })
        );
      } else {
        if (data.message === "invalid/expired token") {
          toast.error("Your session has expired. Please log in again.");
          logout();
          clearNotificationsStorage();
          return;
        }
        toast.error(data.message || "Failed to delete form");
        setForms(previousForms);
      }
    } catch (error) {
                if(error.response){
                    if(error.response.data.message === "invalid/expired token" && token){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
                    else{
                        toast.error(error.response.data.message);
                    }
                }
      console.error("Error deleting form:", error);
      toast.error("Error deleting form");
      setForms(previousForms);
    }
  };

  // Handle create new form
  const handleOpenFormCreate = () => {
    const url = `/formcreate`;
    window.open(url, "_blank", "noopener");
  };

  // Copy the public link for a form to clipboard
  const handleCopyLink = async (formId) => {
    const link = `${window.location.origin}/formsubmit/${formId}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Form link copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy link");
    }
  };

  // Toggle form live status
  const toggleFormStatus = async (formId, currentStatus, title) => {
    setForms((prev) =>
      prev.map((f) => (f._id === formId ? { ...f, isLive: !currentStatus } : f))
    );
    try {
      const getRes = await fetch(
        `http://localhost:3000/api/form/userForms/${formId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const getData = await getRes.json();
      if (!getData?.success || !getData?.form) {
        throw new Error(getData?.message || "Failed to load form");
      }
      const updatedBody = {
        ...getData.form,
        isLive: !currentStatus,
      };
      const patchRes = await fetch(
        `http://localhost:3000/api/form/userForms/${formId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formBody: updatedBody }),
        }
      );
      const data = await patchRes.json();
      if (data.success) {
        toast.success(
          `Form ${!currentStatus ? "activated" : "deactivated"} successfully`
        );
        const nextStatus = !currentStatus;
        pushNotification(
          `Form ${title || formId} is now ${nextStatus ? "Live" : "Offline"}`
        );
        channel.current &&
          channel.current.postMessage({
            type: "FORM_STATUS",
            payload: { formId, isLive: nextStatus, title },
          });
        localStorage.setItem(
          "insightform:event",
          JSON.stringify({
            type: "FORM_STATUS",
            payload: { formId, isLive: nextStatus, title },
          })
        );
      } else {
        if (data.message === "invalid/expired token") {
          toast.error("Your session has expired. Please log in again.");
          logout();
          clearNotificationsStorage();
          return;
        }
        setForms((prev) =>
          prev.map((f) =>
            f._id === formId ? { ...f, isLive: currentStatus } : f
          )
        );
        toast.error(data.message || "Failed to update form status");
      }
    } catch (error) {
      console.error("Error updating form status:", error);
      setForms((prev) =>
        prev.map((f) =>
          f._id === formId ? { ...f, isLive: currentStatus } : f
        )
      );
                if(error.response){
                    if(error.response.data.message === "invalid/expired token" && token){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
                    else{
                        toast.error(error.response.data.message);
                    }
                }
      toast.error(error.message || "Error updating form status");
    }
  };

  return (
    <div className="w-full bg-gray-00">
      <div className="w-full px-0 sm:px- lg:px-24 py-6 sm:py-8">
        <div className="bg-white sm:rounded-xl shadow-none sm:shadow-md border-t sm:border border-gray-200 p-4 sm:p-10 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-gray-500 text-lg mb-4">
                No forms to display
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2">
              {forms.map((form) => (
                <div
                  key={form._id}
                  className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3
                        className="truncate text-xl font-semibold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                        onClick={() =>
                          window.open(
                            `/formbuilder/${form._id}`,
                            "_blank",
                            "noopener"
                          )
                        }
                        title="Open form in editor"
                      >
                        {form.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Live</span>
                      <button
                        onClick={() =>
                          toggleFormStatus(form._id, form.isLive, form.title)
                        }
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                          form.isLive ? "bg-green-500" : "bg-gray-300"
                        }`}
                        title={
                          form.isLive
                            ? "Live: Authenticated users with the link can open and submit."
                            : "Offline: Authenticated users can open, but submission is disabled."
                        }
                      >
                        <span
                          className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            form.isLive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          window.open(
                            `/report/${form._id}`,
                            "_blank",
                            "noopener"
                          )
                        }
                        className="px-3 py-1 rounded text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title="Open report in new tab"
                      >
                        Report
                      </button>
                      <button
                        onClick={() => handleCopyLink(form._id)}
                        className="px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                        title="Copy shareable link"
                      >
                        Copy Link
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setFormToDelete(form);
                        setShowDeleteModal(true);
                      }}
                      className="px-3 py-1 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                      title="Delete this form"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the form "
                  {formToDelete?.title}"? This action cannot be undone.
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

          {/* Right-side slide-in notifications panel */}
          <div
            className={`fixed top-20 right-0 h-[70vh] w-80 bg-white border-l border-gray-200 shadow-xl z-40 transform transition-transform duration-300 ${
              showNotifications ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800">
                Session Notifications
              </h4>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowNotifications(false)}
                aria-label="Close notifications"
              >
                ✕
              </button>
            </div>
            <div className="h-full overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-200"
                  >
                    <div className="text-sm text-gray-800">{n.message}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(n.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Floating Action Buttons - Fixed bottom right */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
            {/* Notification Button */}
            <div
              className="relative"
              style={{ width: "12rem", height: "3.5rem" }}
            >
              <button
                onClick={handleNotificationToggle}
                className="absolute right-0 top-0 h-full flex items-center rounded-xl bg-white dark:bg-gray-800
                  shadow-md border border-gray-200 dark:border-gray-700
                  transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  width: isHovered ? "12rem" : "3.5rem",
                  minWidth: "3.5rem",
                  height: "3.5rem",
                  padding: 0,
                }}
              >
                <span className="flex items-center justify-center w-full h-full">
                  <svg
                    className={`w-6 h-6 ${
                      isHovered ? "hidden" : ""
                    } text-blue-700 dark:text-blue-300`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                  <span
                    className={`text-base font-medium whitespace-nowrap transition-all duration-200 w-full text-center ${
                      isHovered
                        ? "opacity-100 scale-100 text-blue-700 dark:text-blue-300"
                        : "opacity-0 scale-95 text-blue-700 dark:text-blue-300"
                    }`}
                    style={{
                      display: isHovered ? "inline" : "none",
                    }}
                  >
                    Notifications
                  </span>
                </span>
                {/* Notification badge */}
                {newNotificationCount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {newNotificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Create New Form Button */}
            <div
              className="relative"
              style={{ width: "12rem", height: "3.5rem" }}
            >
              <button
                onClick={handleOpenFormCreate}
                className="absolute right-0 top-0 h-full flex items-center rounded-xl bg-white dark:bg-gray-800
                  shadow-md border border-gray-200 dark:border-gray-700
                  transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
                onMouseEnter={() => setIsCreateHovered(true)}
                onMouseLeave={() => setIsCreateHovered(false)}
                style={{
                  width: isCreateHovered ? "12rem" : "3.5rem",
                  minWidth: "3.5rem",
                  height: "3.5rem",
                  padding: 0,
                }}
              >
                <span className="flex items-center justify-center w-full h-full">
                  <svg
                    className={`w-6 h-6 ${
                      isCreateHovered ? "hidden" : ""
                    } text-blue-600`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span
                    className={`text-base font-medium whitespace-nowrap transition-all duration-200 w-full text-center ${
                      isCreateHovered
                        ? "opacity-100 scale-100 text-blue-600"
                        : "opacity-0 scale-95 text-blue-600"
                    }`}
                    style={{
                      display: isCreateHovered ? "inline" : "none",
                    }}
                  >
                    Create New Form
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
