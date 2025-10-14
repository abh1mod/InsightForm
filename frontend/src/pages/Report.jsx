import { useRef, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {toast } from 'react-toastify';
import NormalLoader from "../components/NormalLoader";
import { useAppContext } from '../context/ContextAPI';
import axios from "axios";
import Bubble from "../components/bubble";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ratingLabels = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];

const Report = () => {
    const carouselRef = useRef(null);
    const { token, logout } = useAppContext();
    const [newReportLoading, setNewReportLoading] = useState(false);
    const [chartData, setChartData] = useState([]);
    const { formID } = useParams();
    const [summarySuggestions, setSummarySuggestions] = useState({summary: "", suggestions: []});
    const [loading, setLoading] = useState({summarySuggestionsLoading: true, rawDataLoading: true, chartDataLoading: true});

    useEffect(() => {
        const fetchSummarySuggestions = async () => {
            try{
                const response = await axios.get(`http://localhost:3000/api/report/${formID}/latest-report`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.data.success){
                    setSummarySuggestions({summary: response.data.report.summary, suggestions: response.data.report.suggestions});
                }
            }
            catch(error){
                console.log(error);
                if(error.response){
                    if(error.response.data.message === "invalid/expired token" && token){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
                    else{
                        toast.error(error.response.data.message || "Failed to fetch latest report");
                    }
                }
                else{
                    toast.error("Failed to fetch latest report");
                }
            }
            finally{
                setLoading((prev) => {
                    return {...prev, summarySuggestionsLoading: false};
                });
            }
        }

        const fetchChartData = async () => {
            try{
                const response = await axios.get(`http://localhost:3000/api/report/${formID}/chart-data`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.data.success){
                    console.log(response);
                    
                    setChartData(response.data.chartData);
                }
            }
            catch(error){
                console.log(error);
                if(error.response){
                    if(error.response.data.message === "invalid/expired token" && token){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
                    else{
                        toast.error(error.response.data.message || "Failed to fetch chart data");
                    }
                }
                else{
                    toast.error("Failed to fetch chart data");
                }
            }
            finally{
                setLoading((prev) => {
                    return {...prev, chartDataLoading: false};
                });
            }
        }

        fetchSummarySuggestions();
        fetchChartData();
    }, []);
    
    async function generateReport(){
        try{
            setNewReportLoading(true);
            setLoading((prev) => {
                return {...prev, summarySuggestionsLoading: true};
            });
            const response = await axios.post(`http://localhost:3000/api/report/${formID}/generate-report`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            if(response.data.success){
                toast.success(response.data.message || "Report generated successfully");
                setSummarySuggestions({summary: response.data.report.summary, suggestions: response.data.report.suggestions});
            }
        }
        catch(error){
            console.log(error);
            if(error.response){
                if(error.response.data.message === "invalid/expired token" && token){
                    toast.error("Session expired. Please log in again.");
                    logout();
                }
                else{
                    toast.error(error.response.data.message || "Failed to generate report");
                }
            }
            else{
                toast.error("Failed to generate report");
            }
        }
        finally{
            setNewReportLoading(false);
            setLoading((prev) => {
                return {...prev, summarySuggestionsLoading: false};
            });
        }
    }

    var chartDataMemo = useMemo(() => {
        return Object.keys(chartData).map((question) => {
            if(chartData[question].questionType === 'text'){
                return {words: chartData[question].distribution, questionType: chartData[question].questionType, questionText: chartData[question].questionText};
            }
            else if(chartData[question].questionType === 'mcq'){
                return {
                    questionType: chartData[question].questionType,
                    chartOptions: {
                        responsive: true,
                        plugins: {
                            legend: {
                            position: 'top',
                            },
                            title: {
                            display: true,
                            text: chartData[question].questionText,
                            }
                        },
                        maintainAspectRatio: false
                    },
                    data: {
                        labels: Object.keys(chartData[question].distribution.count),
                        datasets: [{
                            label: "Responses",
                            data: Object.values(chartData[question].distribution.count),
                            backgroundColor: 'rgba(255, 159, 64, 0.6)'
                        }]
                    }
                }
            }
            else if(chartData[question].questionType === 'rating'){
                return {
                    questionType: chartData[question].questionType,
                    chartOptions: {
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                            legend: {
                            position: 'top',
                            },
                            title: {
                            display: true,
                            text: chartData[question].questionText,
                            }
                        },
                    },
                    data: {
                        labels: ratingLabels,
                        datasets: [{
                            label: "Responses",
                            data: ratingLabels.map((l) => chartData[question].distribution.count[l]),
                            backgroundColor: 'rgba(255, 159, 64, 0.6)'
                        }]
                    }
                }
            }
        });
    }, [chartData]);

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
                    <button onClick={generateReport} disabled={newReportLoading} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:opacity-75 disabled:cursor-not-allowed">
                        <span>New Report</span>
                    </button>
                </div>
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="rounded-md border border-gray-200 p-4 h-[15rem] overflow-y-auto">
        
                        {loading.summarySuggestionsLoading ?
                        <div class = "flex justify-center items-center h-full">
                            <NormalLoader /> 
                        </div> :
                        summarySuggestions.summary === "" ?
                        <div class = "flex justify-center items-center h-full">
                            <p className="mt-2 pl-5 text-sm text-gray-600">No summary available.</p> 
                        </div>:
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Summary</h3>
                            <p className="mt-2 pl-5 text-sm text-gray-600">
                                {summarySuggestions.summary || "No summary available."}
                            </p>
                        </div>
                        }
                    </div>
                    <div className="rounded-md border border-gray-200 p-4 h-[15rem] overflow-y-auto">
                        {loading.summarySuggestionsLoading ? 
                        <div class = "flex justify-center items-center h-full">
                            <NormalLoader /> 
                        </div>: 
                        summarySuggestions.suggestions.length === 0 ? 
                        <div class = "flex justify-center items-center h-full">
                            <p className="mt-2 pl-5 text-sm text-gray-600">No suggestions available.</p> 
                        </div>:
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Suggestions</h3>
                            <ul className="mt-2 space-y-3">
                                {summarySuggestions.suggestions.map((s, idx) => (
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
                        }
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
                    <h2 className="text-xl font-semibold text-gray-900">Question Insights</h2>
                    <p className="text-sm text-gray-500">Swipe or scroll horizontally to view charts</p>
                </div>
                {loading.chartDataLoading ?
                <div className = "flex justify-center items-center h-[15rem]">
                    <NormalLoader />
                </div> : chartDataMemo.length === 0 ?
                <div className = "flex justify-center items-center h-[15rem]">
                    <p className="mt-2 pl-5 text-sm text-gray-600">No chart data available.</p> 
                </div> :
                <div className="p-4 sm:p-6">
                    <div ref={carouselRef} className="relative overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex gap-4">
                            {chartDataMemo.map((item, i) => (
                                <div id={`slide-${i}`} data-slide="true" key={i} className="relative snap-center shrink-0 w-full max-w-[100%] rounded-md border border-gray-200 p-4 h-[40rem]">
                                    <div className="absolute top-0 left-0 w-full h-full">
                                        {item.questionType === 'mcq' || item.questionType === 'rating'? 
                                            <Bar options={item.chartOptions} data={item.data}/> :
                                            <Bubble data={item.words} title={item.questionText}/>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>  
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-4">
                        <button onClick={handlePrev} className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Prev</button>
                        <button onClick={handleNext} className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Next</button>
                    </div>
                </div>
                }
            </div>
        </div>
    );
}

export default Report;