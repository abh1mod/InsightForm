import express, { response } from "express"
import Response from "../models/response.model.js";
import {Form, Report} from "../models/form.model.js";
import mongoose from "mongoose";
import jwtAuthorisation from "../middleware/jwtAuthorisation.js";
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
        const res = await Form.findOne({_id: formID, userId: req.user.id});
        if(!res){
            return res.status(404).json({success: false, message: "Form Not Found" });
        }
        // get all responses for the form
        const userResponses = await Response.find({formId: formId});
        // extract unique question texts from the responses to form the columns of the table
        // by going through each response and then through each answer in the response
        // using a Set to store unique question texts
        const columns = new Set();
        columns.add("submittedAt");
        userResponses.forEach((response)=>{
            response.responses.forEach((ans)=>{
                if(!columns.has(ans.questionText)) columns.add(ans.questionText);
            });
        });
        // convert the Set to an array of objects with header and accessorKey properties for tanstack table
        // both header and accessorKey are same as we are using question text as the key in the row data
        // refer to /raw-data route for how the row data is structured
        const columnHeaders = Array.from(columns).map((col)=>{
            return {header: col, accessorKey: col};
        })
        return res.json({success: true, columnHeaders: columnHeaders});
    }
    catch(error){
        console.log(error);
        res.json({success: false, message: "Error fetching table structure"});
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
router.use("/:formId/raw-data", async (req, res, next) => {
    try{
        // get formId from params, page, pageSize, sortBy, sortOrder and filter string from query params
        const {formId} = req.params;
        const pageNum = req.query.page ? parseInt(req.query.page) : 1; // default page number is 1
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10; // default page size is 10
        const sortBy = req.query.sortBy ? req.query.sortBy : "createdAt"; // default sorting by createdAt
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; // default sorting in descending order
        const filter = req.query.filter ? req.query.filter.toLowerCase() : null; // default no filter
        // check if form exists and belongs to the user
        const res = await Form.findOne({_id: formId, userId: req.user.id});
        if(!res){
            return res.status(404).json({success: false, message: "Form Not Found" });
        }
        const queryOptions = {formId: formId};
        // if filter string is provided, add a case-insensitive regex match condition on the answers in the responses
        if(filter){
            queryOptions["responses.answer"] = {$regex: filter, $options: 'i'};
        }
        // get total number of responses for the form to calculate pageCount
        const totalResponses = await Response.countDocuments(queryOptions);
        const pageCount = Math.ceil(totalResponses / pageSize);
        // get the responses for the requested page using skip and limit
        // sorting the responses by sortBy and sortOrder
        // default sorting is by createdAt in descending order (newest first)
        // using the queryOptions object to filter responses based on formId and optional filter string
        const userResponses = await Response.find(queryOptions).sort({[sortBy]: sortOrder}).skip((pageNum - 1) * pageSize).limit(pagesize);
        // structure the row data for tanstack table
        // each row is an object where keys are question texts and values are the answers
        // also adding a submittedAt field to show when the response was submitted
        // if a question was not answered in a response, that key will be absent in that row object
        // this key-value pair structure allows tanstack table to easily map columns to data, since key names are same as column accessorKeys
        const rowData = userResponses.map((response)=>{
            const row = {
                submittedAt: response.createdAt
            };
            response.responses.forEach((ans)=>{
                row[ans.questionText] = ans.answer;
            });
            return row;
        });
        return res.json({success: true, userResponses: rowData, pageCount: pageCount });
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Error fetching raw data" });
    }
});

// This route retrieves the latest report (summary and suggestions) for a specific form
router.get("/:formId/latest-report", async (req, res) => {
    try{
        // check if form exists and belongs to the user and get the latest report (summary and suggestions) for that form
        const res = await Report.findOne({_id: req.params.formId, userId: req.user.id}).sort({createdAt: -1}).select("summary suggestions");
        if(!res){
            // if no report found
            return res.json({success: false, message: "No report found" });
        }
        // if report found, return the report
        return res.json({success: true, report: res});
    }
    catch(error){
        console.log(error);
        res.json({success: false, message: "Error fetching latest report" });
    }
});

router.post("/:formId/generate-report", async (req, res) => {
    try{
        const {formId} = req.params;
        const form = await Form.findOne({_id: formId, userId: req.user.id});
        if(!form){
            return res.status(404).json({success: false, message: "Form Not Found" });
        }
        const responseCount = await Response.countDocuments({formId: formId});
        const reportCount = await Report.countDocuments({formId: formId});
        const latestReport = await Report.findOne({formId: formId}).sort({createdAt: -1});
        if(latestReport && latestReport.responseCount === responseCount){
            return res.json({sucess: false, message: "No new responses since last report generation"});
        }
        if(reportCount >= 3){
            return res.json({success: false, message: "Report generation limit reached. Maximum 3 reports allowed per form."});
        }
        
    }
    catch(error){
        console.log(error);
        res.json({success: false, message: "Error generating report" });
    }
});


export default router;