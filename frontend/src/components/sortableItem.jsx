import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import AutoResizeTextarea from "../components/AutoResizeTextarea";
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

function SortableItem(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: props.question.id});
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const renderQuestionIcon = (type) => {
    switch (type) {
      case "mcq":
        return <Squares2X2Icon className="w-5 h-5" />;
      case "text":
        return <PencilSquareIcon className="w-5 h-5" />;
      case "rating":
        return <StarIcon className="w-5 h-5" />;
      case "number":
        return <HashtagIcon className="w-5 h-5" />;
      case "date":
        return <CalendarDaysIcon className="w-5 h-5" />;
      default:
        return <QuestionMarkCircleIcon className="w-5 h-5" />;
    }
  };

  const removeQuestion = (qIndex) => {
    const newQuestions = [...props.questions];
    newQuestions.splice(qIndex, 1);
    props.setQuestions(newQuestions);
  };

  const addOptionToQuestion = (qIndex) => {
    const newQuestions = [...props.questions];
    newQuestions[qIndex].options.push(
      `Option ${newQuestions[qIndex].options.length + 1}`
    );
    props.setQuestions(newQuestions);
  };

  const removeOptionFromQuestion = (qIndex, oIndex) => {
    const newQuestions = [...props.questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    props.setQuestions(newQuestions);
  };

  const handleQuestionTextChange = (qIndex, newText) => {
    const newQuestions = [...props.questions];
    newQuestions[qIndex].questionText = newText;
    props.setQuestions(newQuestions);
  };

  const toggleQuestionRequired = (qIndex) => {
    const newQuestions = [...props.questions];
    newQuestions[qIndex].required = !newQuestions[qIndex].required;
    props.setQuestions(newQuestions);
  };

  const handleOptionTextChange = (qIndex, oIndex, newText) => {
    const newQuestions = [...props.questions];
    newQuestions[qIndex].options[oIndex] = newText;
    props.setQuestions(newQuestions);
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} className={isDragging ? "relative z-10" : ""}>
        <div
            key={props.question.id}
            className="bg-white px-6 pt-6 rounded-xl shadow-lg border-l-4 border-blue-500 transition-all duration-300 hover:shadow-xl"
        >
            {/* Question Header with Arrow Buttons */}
            <div className="flex justify-between items-center mb-4">
            <div className="flex items-center flex-1">
                {renderQuestionIcon(props.question.questionType)}

                <AutoResizeTextarea
                value={props.question.questionText}
                onChange={(e) =>
                    handleQuestionTextChange(props.index, e.target.value)
                }
                placeholder="Enter your question"
                />
            </div>

                <TrashIcon
                onClick={() => removeQuestion(props.index)}
                className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 p-2">Required</span>
                <button
                className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 
        ${props.question.required ? "bg-blue-500" : "bg-gray-300"}`}
                onClick={() => toggleQuestionRequired(props.index)}
                >
                <span
                    className={`h-5 w-5 bg-white rounded-full shadow-md transform transition-transform duration-300 
            ${props.question.required ? "translate-x-6" : "translate-x-0"}`}
                />
                </button>
            </div>

            {/* Options for Multiple Choice/Rating */}
            {props.question.questionType === "mcq" && (
            <div className="space-y-3 mt-4 ml-6">
                {props.question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center group">
                    <input type="radio" disabled className="mr-3" />
                    <>
                    <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                        handleOptionTextChange(
                            props.index,
                            oIndex,
                            e.target.value
                        )
                        }
                        className="flex-1 p-1 border-b border-transparent focus:outline-none focus:border-blue-400 focus:bg-gray-50 rounded-sm text-gray-700"
                    />
                    <XMarkIcon
                        onClick={() =>
                        removeOptionFromQuestion(props.index, oIndex)
                        }
                        className="w-5 h-5 text-gray-400 ml-2 cursor-pointer hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    </>
                </div>
                ))}
                <div
                className="flex items-center max-w-[40%] text-gray-400 italic cursor-pointer"
                onClick={() => addOptionToQuestion(props.index)}
                >
                <input
                    type="text"
                    readOnly
                    value="Add Option"
                    className="bg-transparent focus:outline-none flex-1 p-1"
                />
                <PlusIcon className="w-5 h-5 text-gray-400 ml-2 hover:text-blue-500" />
                </div>
            </div>
            )}

            {/* Placeholder for other question types */}
            {props.question.questionType === "text" && (
            <div className="mt-4 ml-6">
                <input
                type="text"
                placeholder="User will enter text here..."
                disabled
                className="w-full p-2 border-b border-gray-200 rounded-md bg-gray-50 text-gray-500 italic"
                />
            </div>
            )}
            {props.question.questionType === "rating" && (
            <div className="mt-4 ml-6">
                <input
                type="text"
                placeholder="User will provide rating "
                disabled
                className="w-full p-2 border-b border-gray-200 rounded-md bg-gray-50 text-gray-500 italic"
                />
            </div>
            )}
            {props.question.questionType === "number" && (
            <div className="mt-4 ml-6">
                <input
                type="number"
                placeholder="User will provide number"
                disabled
                className="w-full p-2 border-b border-gray-200 rounded-md bg-gray-50 text-gray-500 italic"
                />
            </div>
            )}
            <div className="p-6 flex items-center justify-center" {...listeners}>
                <Bars3Icon className="w-5 h-5 text-gray-400" />
            </div>
        </div>
    </div>
  );
}

export default SortableItem;