import { useRef, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {toast } from 'react-toastify';
import NormalLoader from "../components/NormalLoader";
import { useAppContext } from '../context/ContextAPI';
import axios from "axios";
import Bubble from "../components/bubble";
import {useReactTable, getCoreRowModel, flexRender} from '@tanstack/react-table';
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
    const [filter, setFilter] = useState("");
    const [searching, setSearching] = useState(false);
    const [filterInput, setFilterInput] = useState("");
    const [chartData, setChartData] = useState([]);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const { formID } = useParams();
    const [summarySuggestions, setSummarySuggestions] = useState({summary: "", suggestions: []});
    const [loading, setLoading] = useState({summarySuggestionsLoading: true, rawDataLoading: true, chartDataLoading: true});
    const [pageCount, setPageCount] = useState(0);
    const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 10});
    const [sorting, setSorting] = useState([{id: 'createdAt', desc: true}]); // default sorting by createdAt 
    const [maxPageIndex, setMaxPageIndex] = useState(1);
    const [responses, setResponses] = useState({start: 0, end: 0, totalResponses: 0});

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
        const fetchColumns = async () => {
            try{
                const response = await axios.get(`http://localhost:3000/api/report/${formID}/table-structure`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.data.success){
                    const rawColumn = response.data.columnHeaders.map((col) => {
                        const cellRenderer = ({ getValue }) => {
                            const value = getValue();

                            // 1. Check if it's the 'createdAt' column
                            if (col.accessorKey === 'createdAt') {
                                const date = new Date(value);
                                // Use locale-specific formatting
                                return date.toLocaleString();
                            }

                            // 2. For ALL other columns, check if the value is empty
                            if (value === null || value === undefined || value === '') {
                                return <span className="text-gray-400 italic">No response</span>;
                            }

                            // 3. Otherwise, just return the value
                            return String(value);
                        };
                    // --- End of Renderer Logic ---

                    // Return the column definition with the renderer
                    return {
                        ...col,
                        cell: cellRenderer // Assign the function we just defined
                    };
                    })
                    setColumns(rawColumn);
                }
            }
            catch(error){
                setColumns([]);
                if(error.response){
                    if(error.response.data.message === "invalid/expired token" && token){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
                    else{
                        toast.error(error.response.data.message || "Failed to fetch raw data");
                    }
                }
                else{
                    toast.error("Failed to fetch raw data");
                }
            }
        }

        fetchSummarySuggestions();
        fetchChartData();
        fetchColumns();
    }, []);

    useEffect(() => {
        const fetchRawData = async () => {
            try{
                setLoading((prev) => {
                    return {...prev, rawDataLoading: true};
                });
                if(columns.length !== 0){
                    const response = await axios.get(`http://localhost:3000/api/report/${formID}/raw-data?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&sortBy=${sorting[0].id}&sortOrder=${sorting[0].desc === true ? "desc" : "asc"}&filter=${filter}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if(response.data.success){
                        setData(response.data.userResponses);
                        setPageCount(response.data.pageCount);
                        setResponses({
                            start: (pagination.pageIndex) * pagination.pageSize + 1,
                            end: Math.min((pagination.pageIndex + 1) * pagination.pageSize, response.data.totalResponses),
                            totalResponses: response.data.totalResponses
                        });
                        if(pagination.pageIndex + 1 > maxPageIndex + 3){
                            setMaxPageIndex(pagination.pageIndex);
                        }
                    }
                }
            }
            catch(error){
                if(error.response){
                    if(error.response.data.message === "invalid/expired token" && token){
                        toast.error("Session expired. Please log in again.");
                        logout();
                    }
                    else{
                        toast.error(error.response.data.message || "Failed to fetch raw data");
                    }
                }
                else{
                    toast.error("Failed to fetch raw data");
                }
            }
            finally{
                setSearching(false);
                setLoading((prev) => {
                    return {...prev, rawDataLoading: false};
                });
            }
        }
        fetchRawData();
    }, [sorting, pagination, columns, filter]);
    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        manualPagination: true,
        enableSortingRemoval: false,
        pageCount,
        state:{
            pagination,
            sorting
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
    });

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

    const downloadData = async () => {
        try{
            setDownloading(true);
            const response = await axios.get(`http://localhost:3000/api/report/${formID}/download-data`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if(response.data){
                const blob = new Blob([response.data], { type: 'text/csv' });

                // 4. Create a temporary URL for the Blob
                const url = window.URL.createObjectURL(blob);

                // 5. Create a temporary link element to trigger the download
                const a = document.createElement('a');
                a.href = url;
                a.download = `responses.csv`; // Set the desired filename
                document.body.appendChild(a); // Add link to the DOM
                a.click(); // Programmatically click the link

                // 6. Clean up: Remove the link and revoke the temporary URL
                a.remove();
                window.URL.revokeObjectURL(url);
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
            setDownloading(false);
        }
    }

    const startFiltering = () => {
        if(filterInput.trim() === filter.trim()) return;
        setSearching(true);
        setFilter(filterInput.trim());
        setPagination({pageIndex: 0, pageSize: 10});
    }

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
                                disabled={searching}
                                value={filterInput}
                                onChange={(e) => setFilterInput(e.target.value)}
                            />
                            <button disabled={searching} onClick={startFiltering} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:opacity-75 disabled:cursor-not-allowed">Search</button>
                            <button disabled={downloading} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:opacity-75 disabled:cursor-not-allowed" onClick={downloadData}>Export CSV</button>
                        </div>
                    </div>
                </div>
                {loading.rawDataLoading ?
                <div className = "flex justify-center items-center h-[15rem]">
                    <NormalLoader />
                </div> :
                data.length === 0 ?
                <div className = "flex justify-center items-center h-[15rem]">
                    <p className="mt-2 pl-5 text-sm text-gray-600">No Raw data available.</p>
                </div> :
                <div>
                    <div className="p-0 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => {
                                            {if(header.column.columnDef.header === 'createdAt'){
                                                return (
                                                    <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:cursor-pointer">
                                                        <div className="inline-flex w-full items-center gap-2">
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                            
                                                            {{
                                                                asc: ' 🔼',
                                                                desc: ' 🔽',
                                                            }[header.column.getIsSorted()]}
                                                            
                                                        </div>
                                                    </th>
                                                )
                                            }else{
                                                return (
                                                    <th key={header.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        <div className="inline-flex w-full items-center gap-2">
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                            
                                                        </div>
                                                    </th>
                                                )
                                            }
                                            }
                                        })}
                                    </tr>
                                ))}                           
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {table.getRowModel().rows.map(row => {
                                    return (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            {row.getVisibleCells().map(cell => {
                                                return (
                                                    <td key={cell.id} className="px-4 py-3 text-sm text-gray-900">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-sm text-gray-600">Showing {responses.start} to {responses.end} of {responses.totalResponses} results</p>
                        <div className="inline-flex items-center gap-2">
                            <button className={`rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 ${!table.getCanPreviousPage() ? 'opacity-50':''}`} onClick={()=>table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: maxPageIndex + 3 > pageCount ? pageCount - maxPageIndex + 1 : 4}).map((_, idx) => (
                                    <button key={idx} onClick={()=>setPagination((previous) => ({...previous, pageIndex: maxPageIndex + idx - 1}))} className={`rounded-md px-3 py-1.5 text-sm ${maxPageIndex + idx === pagination.pageIndex + 1? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50 border border-gray-300'}`}>{maxPageIndex + idx}</button>
                                ))}
                            </div>
                            <button className={`rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 ${!table.getCanNextPage() ? 'opacity-50':''}`} onClick={()=>table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
                        </div>
                    </div>
                </div>}
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
                                <div id={`slide-${i}`} data-slide="true" key={i} className="relative snap-center shrink-0 w-full max-w-[100%] rounded-md border border-gray-200 p-4 h-[27rem]">
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