import express, { response } from "express"
import Response from "../models/response.model.js";
import Form from "../models/form.model.js";
import Report from "../models/report.model.js";
import {dataPreProcessing, textQuestionPreProcessing} from "../services/dataPreProcessing.js";
import {callAI as generateReport, summaryAndSuggestionPrompt, summaryAndSuggestionResponseSchema} from "../services/AI.js";
import mongoose from "mongoose";
import jwtAuthorisation from "../middleware/jwtAuthorisation.js";
import {AsyncParser} from 'json2csv';
const router = express.Router();

// Middleware to parse JSON and URL-encoded data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// middleware to verify JWT token and attach user id to request. refer to ../middleware/jwtAuthorisation.js for implementation
router.use(jwtAuthorisation);

// This route retrieves the columns name of a speicific form for tanstack table in frontend
// this is a two step process for showing raw data of a form in tabular format
// 1. get the column names using this route
// 2. get the row data using the /raw-data route
// Both routes are protected and require authentication
router.get("/:formId/table-structure", async (req, res) => {
    try{
        const {formId} = req.params;
        // check if form exists and belongs to the user
        const resp = await Form.findOne({_id: formId, userId: req.user.id});
        if(!resp){
            return res.status(404).json({success: false, message: "Form Not Found" });
        }
        // get all responses for the form
        const userResponses = await Response.find({formId: formId});
        // extract unique question texts from the responses to form the columns of the table
        // by going through each response and then through each answer in the response
        // using a Set to store unique question texts
        const columns = new Set();
        // also include all questions from the form in case some questions were never answered
        resp.questions.forEach((question)=>{
            const key = question.questionText + "_" + question._id;
            columns.add(key);
        });
        userResponses.forEach((response)=>{
            response.responses.forEach((ans)=>{
                const key = ans.questionText + "_" + ans.questionId;
                if(!columns.has(key)) columns.add(key);
            });
        });
        
        var c = [{header: "createdAt", accessorKey: "createdAt"}]; // adding a default column for submission time
        // convert the Set to an array of objects with header and accessorKey properties for tanstack table
        // both header and accessorKey are same as we are using question text as the key in the row data
        // refer to /raw-data route for how the row data is structured
        var headers = Array.from(columns).map((col)=>{
            return {header: col.slice(0, -25), accessorKey: col};
        })
        var columnHeaders = [...c, ...headers];
        return res.json({success: true, columnHeaders: columnHeaders});
    }
    catch(error){
        console.log(error);
        res.status(400).json({success: false, message: "Error fetching table structure"});
    }
});

// This route retrieves the raw response data of a specific form in a paginated manner for tanstack table in frontend
// this is a two step process for showing raw data of a form in tabular format
// 1. get the column names using the /table-structure route
// 2. get the row data using this route
// Both routes are protected and require authentication
// Query params:
// page: the page number to retrieve (default: 1)
// pageSize: number of responses per page (default: 10)
// sortBy: the field to sort by (default: createdAt)
// sortOrder: 'asc' for ascending or 'desc' for descending (default: desc)
// filter: string based on which data would be filtered, it is for global filtering across all columns
router.get("/:formId/raw-data", async (req, res) => {
    try{
        // get formId from params, page, pageSize, sortBy, sortOrder and filter string from query params
        const {formId} = req.params;
        const pageNum = req.query.page ? parseInt(req.query.page) : 0; // default page number is 1
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10; // default page size is 10
        const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt"; // default sorting by createdAt
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; // default sorting in descending order
        const filter = req.query.filter ? req.query.filter.toLowerCase() : null; // default no filter
        // check if form exists and belongs to the user
        
        const resp = await Form.findOne({_id: formId, userId: req.user.id});
        if(!resp){
            return res.status(404).json({success: false, message: "Form Not Found" });
        }
        const queryOptions = {formId: formId};
        // if filter string is provided, add a case-insensitive regex match condition on the answers in the responses
        if(filter && filter.trim() !== ""){
            queryOptions["responses.answer"] = {$regex: filter, $options: 'i'};
        }
        // get total number of responses for the form to calculate pageCount
        const totalResponses = await Response.countDocuments(queryOptions);
        const pageCount = Math.ceil(totalResponses / pageSize);
        // get the responses for the requested page using skip and limit
        // sorting the responses by sortBy and sortOrder
        // default sorting is by createdAt in descending order (newest first)
        // using the queryOptions object to filter responses based on formId and optional filter string
        const userResponses = await Response.find(queryOptions).sort({[sortBy]: sortOrder}).skip((pageNum) * pageSize).limit(pageSize);
        // structure the row data for tanstack table
        // each row is an object where keys are question texts and values are the answers
        // also adding a submittedAt field to show when the response was submitted
        // if a question was not answered in a response, that key will be absent in that row object
        // this key-value pair structure allows tanstack table to easily map columns to data, since key names are same as column accessorKeys
        const rowData = userResponses.map((response)=>{
            const row = {
                createdAt: response.createdAt,
                response_id: response._id
            };
            response.responses.forEach((ans)=>{
                row[ans.questionText + "_" + ans.questionId] = ans.answer;
            });
            return row;
        });
        return res.json({success: true, userResponses: rowData, pageCount: pageCount, totalResponses: totalResponses});
    }catch(error){
        console.log(error);
        res.status(400).json({success: false, message: "Error fetching raw data" });
    }
});

// This route retrieves the latest report (summary and suggestions) for a specific form
router.get("/:formId/latest-report", async (req, res) => {
    try{
        // check if form exists and belongs to the user and get the latest report (summary and suggestions) for that form
        const response = await Report.findOne({formId: req.params.formId, userId: req.user.id}).sort({createdAt: -1}).select("summary suggestions");
        // console.log(response);
        
        if(!response){
            // if no report found
            return res.status(400).json({success: false, message: "No report found" });
        }
        // if report found, return the report
        return res.json({success: true, report: response});
    }
    catch(error){
        console.log(error);
        res.status(400).json({success: false, message: "Error fetching latest report" });
    }
});

// This route generates a new report (summary and suggestions) for a specific form using AI service
// The report is generated based on all the responses received for that form so far
// The route is protected and requires authentication
// Rate limiting is implemented to allow a maximum of 3 report generations per form per 24 hours
// If there are no new responses since the last report generation, a new report will not be generated
router.post("/:formId/generate-report", async (req, res) => {
    const session = await mongoose.startSession(); // initialize a mongoose session for transaction
    try{
        const {formId} = req.params;
        // check if form exists and belongs to the user
        const form = await Form.findOne({_id: formId, userId: req.user.id});
        if(!form){
            return res.status(404).json({success: false, message: "Form Not Found" });
        }
        // check and update report generation limit if expiry time has passed
        if(form.reportGenerationLimitExpiry < Date.now()){
            form.reportGenerationLimit = 3;
            form.reportGenerationLimitExpiry = Date.now() + 24*60*60*1000; // extend expiry by 24 hours
            await form.save();
        }
        // if report generation limit is reached, return an error
        if(form.reportGenerationLimit <= 0){
            return res.status(400).json({success: false, message: "Report generation limit reached. Try again later."});
        }
        // If a report exists and it was created after the last modification, then there's no new data.
        const latestReport = await Report.findOne({formId: formId}).sort({createdAt: -1});
        if(latestReport && latestReport.createdAt >= form.lastEdited){
            return res.status(400).json({sucess: false, message: "No change in responses since last report generation"});
        }
        // get all responses for the form
        // preprocess the data to get aggregated information for each question
        // create a structured prompt using the form objective and the preprocessed data
        const allResponses = await Response.find({formId: formId}).select("responses -_id");
        
        if(!allResponses || allResponses.length === 0){
            return res.status(400).json({success: false, message: "No responses found for this form"});
        }
        const preProcessedData = await dataPreProcessing(form, allResponses, 'ai');
        const structuredPrompt = summaryAndSuggestionPrompt(form.objective, preProcessedData);
        // call the AI service with the structured prompt and the expected response schema
        const aiResponse = await generateReport(structuredPrompt, summaryAndSuggestionResponseSchema);
        const aiResponseData = JSON.parse(aiResponse.text); // parse the response text to get the summary and suggestions
        
        // if AI service fails to provide a valid response, return an error
        if(!aiResponseData || !aiResponseData.summary || !aiResponseData.suggestions){
            return res.status(500).json({success:false, message:"Failed to get report from AI"});
        }
        // create a new report document
        const newReport = new Report({
            formId: form._id,
            userId: req.user.id,
            summary: aiResponseData.summary,
            suggestions: aiResponseData.suggestions
        });
        // use a transaction to ensure both report creation and report generation limit update are atomic
        // if either operation fails, the transaction will be aborted and no changes will be made to the database
        session.startTransaction();
        await newReport.save({session});
        form.reportGenerationLimit -= 1;
        await form.save({session});
        await session.commitTransaction();
        return res.json({success: true, message: "Report generated successfully", report: aiResponseData});
    }
    catch(error){
        // Only abort the transaction if it was actually started
        if (session.inTransaction()) {
            await session.abortTransaction(); // abort the transaction in case of error
        } 
        console.log(error);
        res.status(404).json({success: false, message: "Error generating report" });
    }
    finally{
        session.endSession(); // end the mongoose session
    }
});

// This route retrieves the processed data for chart generation for a specific form
// it first preprocess data in the same way for generate report route
// then it converts text based question using textQuestionPreProcessing function (refer implementation for more details in ../services/dataPreProcessing.js)
router.get("/:formId/chart-data", async (req, res) => {
    try{
        const formId = req.params.formId;
        const resp = await Form.findOne({_id: formId, userId: req.user.id});
        if(!resp){
            return res.status(404).json({success: false, message: "Form Not Found" });
        }
        const allResponses = await Response.find({formId: formId}).select("responses -_id");
        if(!allResponses || allResponses.length === 0){
            return res.status(400).json({success: false, message: "No responses found for this form"});
        }
        const preProcessedData = await dataPreProcessing(resp, allResponses, 'chart');
        const chartData = await textQuestionPreProcessing(preProcessedData);
        // console.log(chartData);
        
        return res.json({success: true, chartData: chartData});
    }
    catch(error){
        console.log(error);
        res.status(400).json({success: false, message: "Error fetching chart data" });
    }
});

// This route allows the user to download all the responses of a specific form in CSV format
// It uses the json2csv library to convert JSON data to CSV
// The route is protected and requires authentication
router.get("/:formId/download-data", async (req, res) => {
    try{
        const formId = req.params.formId;
        // check if form exists and belongs to the user
        const form = await Form.findOne({_id: formId, userId: req.user.id});
        if(!form){
            return res.status(404).json({success: false, message: "Form Not Found" });
        }
        // get all responses for the form
        // calculate unique question texts to form the headers of the CSV
        // structure the data in a way that each row is an object where keys are question texts and values are the answers
        // this structure is suitable for conversion to CSV format
        const allResponses = await Response.find({formId: formId}).select("responses -_id createdAt");
        // --- 1. Find all Unique Question Versions and Map Keys to Headers ---
        const uniqueQuestionVersions = new Map(); // Map: uniqueKey -> headerText
        uniqueQuestionVersions.set('createdAt', 'createdAt'); // Add static column
        form.questions.forEach((question)=>{
            uniqueQuestionVersions.set(`${question._id}_${question.questionText}`, question.questionText);
        });
        const rows = allResponses.map((response) => {
            const rowObj = {};
            rowObj["createdAt"] = response.createdAt;
            response.responses.forEach((ans) => {
                if(!uniqueQuestionVersions.has(`${ans.questionId}_${ans.questionText}`)) uniqueQuestionVersions.set(`${ans.questionId}_${ans.questionText}`, ans.questionText);
                rowObj[`${ans.questionId}_${ans.questionText}`] = ans.answer;
            });
            return rowObj;
        });
        // --- 2. Prepare Fields for CSV Parser ---
        const fieldsForParser = [];
        uniqueQuestionVersions.forEach((headerText, uniqueKey) => {
            fieldsForParser.push({
                label: headerText, // The user-friendly column header
                value: uniqueKey   // The unique key used in the row data
            });
        });
        
        // Convert the JSON data to CSV format
        // using AsyncParser from json2csv for better performance with large datasets
        const parser = new AsyncParser({ fields: fieldsForParser });
        const csv = await parser.parse(rows).promise();
        console.log(csv);
        
        // Set the response headers to indicate a file attachment with CSV content
        res.header('Content-Type', 'text/csv');
        res.attachment(`${form.title}-responses.csv`);
        
        // Send the CSV data
        res.send(csv);
    }
    catch(error){
        console.log(error);
        res.status(400).json({success: false, message: "Error downloading data" });
    }
});


export default router;