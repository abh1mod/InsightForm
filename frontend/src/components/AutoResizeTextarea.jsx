import { useRef, useEffect } from "react";

const AutoResizeTextarea = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // adjust
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1} // start with 1 line
      className="flex-1 text-lg font-semibold text-gray-800 ml-2 p-1
                 border-b border-gray-200 focus:outline-none focus:border-blue-500
                 transition-colors duration-200 bg-transparent resize-none overflow-hidden"
    />
  );
};

export default AutoResizeTextarea;
