import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {toast } from 'react-toastify';
import { useAppContext } from '../context/ContextAPI';
import axios from "axios";

const Report = () => {
    const carouselRef = useRef(null);
    const { token, logout } = useAppContext();
    const { formID } = useParams();
    const [summarySuggestions, setSummarySuggestions] = useState({});

    useEffect(() => {
        const fetchSummarySuggestions = async () => {
            try{
                const response = await axios.get(`http://localhost:3000/api/report/${formID}/latest-report`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.data.success){

                }
                else{
                    if(response.data.message === "invalid/expired token"){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
                    else{
                        toast.error(response.data.message || "Failed to fetch report data.");

                    }
                }
            }
            catch{

            }
        }
    }, []);
    const scrollToSlide = (targetIndex) => {
        const container = carouselRef.current;
        if (!container) return;
        const slides = Array.from(container.querySelectorAll('[data-slide="true"]'));
        if (slides.length === 0) return;
        const clamped = Math.max(0, Math.min(targetIndex, slides.length - 1));
        slides[clamped].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };

    const getCurrentIndex = () => {
        const container = carouselRef.current;
        if (!container) return 0;
        const slides = Array.from(container.querySelectorAll('[data-slide="true"]'));
        if (slides.length === 0) return 0;
        const scrollLeft = container.scrollLeft;
        let closestIndex = 0;
        let smallestDelta = Infinity;
        slides.forEach((slide, idx) => {
            const delta = Math.abs(slide.offsetLeft - scrollLeft);
            if (delta < smallestDelta) {
                smallestDelta = delta;
                closestIndex = idx;
            }
        });
        return closestIndex;
    };

    const handlePrev = () => {
        const current = getCurrentIndex();
        scrollToSlide(current - 1);
    };

    const handleNext = () => {
        const current = getCurrentIndex();
        scrollToSlide(current + 1);
    };
    return (
        <div className="px-4 py-6 space-y-6">
            {/* Section 1: Summary & Suggestions (simplified) */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Summary & Suggestions</h2>
                        <p className="text-sm text-gray-500">High-level takeaways and recommended actions</p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span>New Report</span>
                    </button>
                </div>
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="rounded-md border border-gray-200 p-4">
                        <h3 className="text-sm font-medium text-gray-900">Summary</h3>
                        <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
                            <li>Overall sentiment trends positive over the last two weeks</li>
                            <li>Higher engagement on mobile compared to desktop</li>
                            <li>Drop-offs concentrated around longer open-ended questions</li>
                        </ul>
                    </div>
                    <div className="rounded-md border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">Suggestions</h3>
                            <span className="text-xs text-gray-500">From SuggestionSchema</span>
                        </div>
                        <ul className="mt-2 space-y-3">
                            {[{ title: 'Shorten Q5', detail: 'Reduce description length to lower cognitive load.', suggestionType: 'action' }, { title: 'Reorder demographics', detail: 'Place demographic questions at the end to improve flow.', suggestionType: 'insight' }, { title: 'Add tooltips', detail: 'Help texts for matrix questions to clarify choices.', suggestionType: 'warning' }].map((s, idx) => (
                                <li key={idx} className="border border-gray-200 rounded-md p-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{s.title}</p>
                                            <p className="mt-1 text-sm text-gray-700">{s.detail}</p>
                                        </div>
                                        <span className={`ml-3 shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${s.suggestionType === 'action' ? 'bg-emerald-100 text-emerald-700' : s.suggestionType === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700' }`}>
                                            {s.suggestionType}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Section 2: Raw Data Table */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Raw Responses</h2>
                            <p className="text-sm text-gray-500">Explore form submissions with filters and sorting</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                className="w-64 max-w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Global filter..."
                                readOnly
                            />
                            <button className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Export CSV</button>
                        </div>
                    </div>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="inline-flex items-center gap-2">
                                        ID
                                        <span className="text-gray-400">↕</span>
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="inline-flex items-center gap-2">
                                        Submitted At
                                        <span className="text-gray-400">↕</span>
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="inline-flex items-center gap-2">
                                        Q1
                                        <span className="text-gray-400">↕</span>
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="inline-flex items-center gap-2">
                                        Q2
                                        <span className="text-gray-400">↕</span>
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="inline-flex items-center gap-2">
                                        Q3
                                        <span className="text-gray-400">↕</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900">#{i.toString().padStart(3, '0')}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">2025-10-08 12:3{i}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">Good</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">Average</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">Yes</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-gray-600">Showing 1 to 10 of 128 results</p>
                    <div className="inline-flex items-center gap-2">
                        <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">Previous</button>
                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <button key={idx} className={`rounded-md px-3 py-1.5 text-sm ${idx === 0 ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50 border border-gray-300'}`}>{idx + 1}</button>
                            ))}
                        </div>
                        <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>

            {/* Section 3: Charts Carousel (CSS scroll-snap) */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Question Insights</h2>
                            <p className="text-sm text-gray-500">Swipe or scroll horizontally to view charts</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <a key={idx} href={`#slide-${idx + 1}`} className={`h-2 w-2 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-gray-300'} hover:bg-indigo-500`} aria-label={`Go to slide ${idx + 1}`}></a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-4 sm:p-6">
                    <div ref={carouselRef} className="relative overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div id={`slide-${i}`} data-slide="true" key={i} className="snap-center shrink-0 w-full max-w-[100%] rounded-md border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium text-gray-900">Q{i} - Sample Chart</h3>
                                        <span className="text-xs text-gray-500">Bar</span>
                                    </div>
                                    <div className="h-40 flex items-end gap-2">
                                        {[40, 72, 55, 20, 90].map((h, idx) => (
                                            <div key={idx} className="flex-1 bg-indigo-200 rounded-sm relative">
                                                <div style={{ height: `${h}%` }} className="absolute bottom-0 left-0 right-0 bg-indigo-600 rounded-sm"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 flex justify-between text-xs text-gray-500">
                                        <span>A</span>
                                        <span>B</span>
                                        <span>C</span>
                                        <span>D</span>
                                        <span>E</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <button onClick={handlePrev} className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Prev</button>
                        <div className="flex items-center justify-center gap-2">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <a key={idx} href={`#slide-${idx + 1}`} className={`h-2 w-2 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-gray-300'} hover:bg-indigo-500`} aria-label={`Go to slide ${idx + 1}`}></a>
                            ))}
                        </div>
                        <button onClick={handleNext} className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Report;