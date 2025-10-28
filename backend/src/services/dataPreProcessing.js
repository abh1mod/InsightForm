import natural from 'natural';
import stopword from 'stopword';

const generateDataStructre = (key, processedData, questionText, questionType, options=[]) => {
    if(questionType === 'mcq'){
        // initialize structure for multiple choice question
        processedData[key] = {
            questionText: questionText, // Store the question text
            questionType: "mcq", // Type of question
            totalResponses: 0, // Total number of responses received for this question
            distribution: {
                // Initialize count and percentage for each option to 0
                count: options.reduce((acc, item) => {
                    acc[item] = 0;
                    return acc;
                }, {}),
                percentage: options.reduce((acc, item) => {
                    acc[item] = 0;
                    return acc;
                }, {})
            }
        };
    }
    else if(questionType === 'rating'){
        // initialize structure for rating question (assuming rating scale is 1 to 10)
        processedData[key] = {
            questionText: questionText, // Store the question text
            questionType: "rating", // Type of question
            totalResponses: 0, // Total number of responses received for this question
            avgRating: 0, // Average rating calculated later
            distribution: {
                // Initialize count and percentage for ratings 1 to 5 to 0
                count: {"0.5": 0, "1": 0, "1.5": 0, "2": 0, "2.5": 0, "3": 0, "3.5": 0, "4": 0, "4.5": 0, "5": 0},
                percentage: {"0.5": 0, "1": 0, "1.5": 0, "2": 0, "2.5": 0, "3": 0, "3.5": 0, "4": 0, "4.5": 0, "5": 0}
            }
        };
    }
    else if(questionType === 'number'){
        // initialize structure for number based question
        console.log("Initializing number question:", questionText);
        
        processedData[key] = {
            questionText: questionText, // Store the question text
            questionType: "number", // Type of question
            totalResponses: 0, // Total number of responses received for this question
            average: 0, // Average number calculated later
            min_value: Infinity, // Minimum value
            max_value: -Infinity, // Maximum value
            answers: [] // Array to store all number answers
        };
    }
    else{
        // initialize structure for text-based question (short answer)
        processedData[key] = {
            questionText: questionText, // Store the question text
            questionType: "text", // Type of question
            totalResponses: 0, // Total number of responses received for this question
            answers: [] // Array to store all text answers
        };
    }
};

// service to preprocess form response data for report generation
// input: array of response documents from the database
// output: processed data object containing aggregated information for each question
const dataPreProcessing = async (form, allResponses, context) => {
    // object to hold processed data
    const processedData = {};
    form.questions.forEach((question) => {
        // for mcq, include options in the key to differentiate between questions where question is same but user changed the options between form edits
        // create a unique key for each question based on its text and type
        // this helps in aggregating data for the same question across different responses
        // we treat the question as different if user has changed its text or options
        var key = question._id.toString() + "_" + question.questionText;
        // for mcq, include options in the key to differentiate between questions where question is same but user changed the options between form edits
        if(question.questionType === 'mcq'){
            const sortedOptions = [...question.options].sort(); // sort options to ensure consistent key regardless of order
            key += `_${sortedOptions.join('_')}`;
        }
        generateDataStructre(key, processedData, question.questionText, question.questionType, question.options);
    });
    // iterate through each response document
    allResponses.forEach((response) => {
        // iterate through each answer in the response
        response.responses.forEach((ans) => {
            // create a unique key for each question based on its text and type
            // this helps in aggregating data for the same question across different responses
            // we treat the question as different if user has changed its text or options
            var key = ans.questionId.toString() + "_" + ans.questionText;
            // for mcq, include options in the key to differentiate between questions where question is same but user changed the options between form edits
            if(ans.questionType === 'mcq'){
                const sortedOptions = [...ans.options].sort(); // sort options to ensure consistent key regardless of order
                key += `_${sortedOptions.join('_')}`;
            }
            if(!processedData.hasOwnProperty(key)){
                generateDataStructre(key, processedData, ans.questionText, ans.questionType, ans.options);
            }

            if(ans.answer.trim() === "") return; // skip empty answers
            processedData[key].totalResponses += 1; // increment total responses for this question

            // update count or store answer based on question type
            if(ans.questionType === 'mcq' || ans.questionType === 'rating'){
                processedData[key].distribution.count[ans.answer] += 1;
            }
            else if(ans.questionType === 'number'){
                const numAnswer = parseFloat(ans.answer);
                processedData[key].min_value = Math.min(processedData[key].min_value, numAnswer);
                processedData[key].max_value = Math.max(processedData[key].max_value, numAnswer);
                processedData[key].average += numAnswer; // will divide by totalResponses later to get average 
                processedData[key].answers.push(numAnswer);
            }
            else{
                processedData[key].answers.push(ans.answer);
            }
        });
    });
    // calculate percentage for mcq and rating questions
    // also calculate average rating for rating questions
    // average rating is calculated as the sum of (rating * count) for each rating divided by total responses
    // percentage is calculated as (count / totalResponses) * 100 for each option/rating
    // if totalResponses is 0, percentage and average rating are set to 0 to avoid division by zero
    Object.keys(processedData).forEach((question) => {
        if(processedData[question].questionType === 'mcq' || processedData[question].questionType === 'rating'){
            const total = processedData[question].totalResponses;
            Object.keys(processedData[question].distribution.percentage).forEach((item) => {
                processedData[question].distribution.percentage[item] = total === 0 ? 0 : ((processedData[question].distribution.count[item] / total) * 100).toFixed(2);
            });
        }
        if(processedData[question].questionType === 'rating'){
            const total = processedData[question].totalResponses;
            const accumulatedSum = Object.keys(processedData[question].distribution.count).reduce((acc, item) => {
                acc += (parseInt(item) * processedData[question].distribution.count[item]);
                return acc;
            }, 0.0);
            processedData[question].avgRating = total === 0 ? 0 : (accumulatedSum / total).toFixed(2);
        }
        if(processedData[question].questionType === 'number'){
            const total = processedData[question].totalResponses;
            processedData[question].average = total === 0 ? 0 : (processedData[question].average / total).toFixed(2);
        }
    });
    // add total number of form responses to the processed data
    processedData["totalFormResponses"] = allResponses.length;
    // console.log(processedData);
    if(context === 'ai'){
        Object.keys(processedData).forEach((question) => {
            // for ai context, we dont need the answers array to reduce the data size
            if(processedData[question].questionType === 'number'){
                delete processedData[question].answers;
            }
        });
        return processedData;
    }
    return processedData;
}

// function to convert text based question into suitable format for word cloud charts
// it takes processedData from dataPreProcessing function as input
// adds data key in text based question which contains array of objects of this structure => {text: "word", value: count}
// deletes answers key as it wont be required in charts 
const textQuestionPreProcessing = async (processedData) => {
    // tokenizer to split text into words
    const tokenizer = new natural.WordTokenizer();
    console.log(processedData);
    
    // iterate through each question in processedData
    Object.keys(processedData).forEach((question) => {
        // process only text based questions
        if(processedData[question].questionType === 'text'){
            const wordCount = {}; // object to hold word counts
            // iterate through each answer for the text question
            processedData[question].answers.forEach((answer) => {
                // tokenize the answer into array of words, remove stopwords    
                const words = tokenizer.tokenize(answer);
                const filteredWords = stopword.removeStopwords(words);
                // go through each word, convert to its root form using Porter Stemmer, and count occurrences
                filteredWords.forEach((word) => {
                    const rootWord = natural.PorterStemmer.stem(word);
                    if(wordCount.hasOwnProperty(rootWord)) {
                        wordCount[rootWord] += 1;
                    }
                    else{
                        wordCount[rootWord] = 1;
                    }
                });
            });
            // convert wordCount object into array of {name, value} objects for charting
            const wordCountArray = Object.entries(wordCount). // convert to array of [word, count] pairs
                                    sort(([, a], [, b]) => b - a). // sort in descending order of count
                                    slice(0, 30). // take top 30 words
                                    map((item) => {return {name: item[0], value: item[1]}});
            // add the word count array to processedData and remove raw answers
            processedData[question].distribution = wordCountArray;
            delete processedData[question].answers;
        }
        else if(processedData[question].questionType === 'number'){
            if(processedData[question].answers.length === 0){
                processedData[question].bins = [];
                processedData[question].binCounts = [];
            }
            else{
                const binNum = 10; // desired number of bins
                const binWidth = Math.max(1, Math.ceil((processedData[question].max_value - processedData[question].min_value) / binNum));
                const actualNumBins = Math.max(1, Math.ceil((processedData[question].max_value - processedData[question].min_value) / binWidth)); // recalculate actual number of bins based on rounded width
                const  bins = []; // array to hold bin labels
                for(let i = 0; i < actualNumBins; i++){
                    let binStart = processedData[question].min_value + (i * binWidth);
                    let binEnd = binStart + binWidth - 1;
                    if(i == actualNumBins - 1 && binEnd < processedData[question].max_value){
                        bins.push(`${binStart} - ${processedData[question].max_value}`);
                    }
                    else{
                        bins.push(`${binStart} - ${binEnd}`);
                    }
                }
                processedData[question].bins = bins;
                processedData[question].binCounts = new Array(actualNumBins).fill(0);
                // calculate bin counts
                processedData[question].answers.forEach((num) => {
                    // determine which bin the number falls into
                    let binIndex = Math.floor((num - processedData[question].min_value) / binWidth);
            
                    // Handle the maximum value potentially falling exactly on the edge or outside
                    if (num === processedData[question].max_value) {
                        binIndex = actualNumBins - 1; // Put max value in the last bin
                    } else if (binIndex >= actualNumBins) {
                        binIndex = actualNumBins - 1; // Should technically not happen if width is calculated correctly, but safety check
                    }

                    processedData[question].binCounts[binIndex]++; // increment the count for the appropriate bin
                });
                console.log(processedData[question]);
                
                delete processedData[question].answers; // remove raw answers as they wont be required in charts
            }
        }
    });
    delete processedData.totalFormResponses; // remove totalFormResponses as it wont be required in charts
    return processedData;
}

export {dataPreProcessing, textQuestionPreProcessing};