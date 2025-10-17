import natural from 'natural';
import stopword from 'stopword';

// service to preprocess form response data for report generation
// input: array of response documents from the database
// output: processed data object containing aggregated information for each question
const dataPreProcessing = async (allResponses) => {
    // object to hold processed data
    const processedData = {};
    // iterate through each response document
    allResponses.forEach((response) => {
        // iterate through each answer in the response
        response.responses.forEach((ans) => {
            // create a unique key for each question based on its text and type
            // this helps in aggregating data for the same question across different responses
            // we treat the question as different if user has changed its text or options
            var key = ans.questionText;
            // for mcq, include options in the key to differentiate between questions where question is same but user changed the options between form edits
            if(ans.questionType === 'mcq'){
                const sortedOptions = [...ans.options].sort(); // sort options to ensure consistent key regardless of order
                key += `_${sortedOptions.join('_')}`;
            }
            // if this question is encountered for the first time, initialize its structure in processedData
            if(!processedData.hasOwnProperty(key)){
                if(ans.questionType === 'mcq'){
                    // initialize structure for multiple choice question
                    processedData[key] = {
                        questionText: ans.questionText, // Store the question text
                        questionType: "mcq", // Type of question
                        totalResponses: 0, // Total number of responses received for this question
                        distribution: {
                            // Initialize count and percentage for each option to 0
                            count: ans.options.reduce((acc, item) => {
                                acc[item] = 0;
                                return acc;
                            }, {}),
                            percentage: ans.options.reduce((acc, item) => {
                                acc[item] = 0;
                                return acc;
                            }, {})
                        }
                    };
                }
                else if(ans.questionType === 'rating'){
                    // initialize structure for rating question (assuming rating scale is 1 to 10)
                    processedData[key] = {
                        questionText: ans.questionText, // Store the question text
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
                else{
                    // initialize structure for text-based question (short answer)
                    processedData[key] = {
                        questionText: ans.questionText, // Store the question text
                        questionType: "text", // Type of question
                        totalResponses: 0, // Total number of responses received for this question
                        answers: [] // Array to store all text answers
                    };
                }
            }
            
            if(ans.answer.trim() === "") return; // skip empty answers
            processedData[key].totalResponses += 1; // increment total responses for this question

            // update count or store answer based on question type
            if(ans.questionType === 'mcq' || ans.questionType === 'rating'){
                processedData[key].distribution.count[ans.answer] += 1;
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
    });
    // add total number of form responses to the processed data
    processedData["totalFormResponses"] = allResponses.length;
    // console.log(processedData);
    
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
    });
    delete processedData.totalFormResponses; // remove totalFormResponses as it wont be required in charts
    return processedData;
}

export {dataPreProcessing, textQuestionPreProcessing};