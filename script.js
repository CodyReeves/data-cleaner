const fs = require('fs');
const readline = require('readline');
const cheerio = require('cheerio');
const { Transform, pipeline } = require('stream');

// Input and output file paths; defaults are provided.
const inputFile = process.argv[2] || 'cleaning.jsonl';
const outputFile = process.argv[3] || 'cleaned_data.txt';

/**
 * Cleans HTML content by removing scripts, styles, and normalizing text.
 * @param {string} html - The HTML string to be cleaned.
 * @returns {string} The cleaned text extracted from the HTML.
 */
function cleanHtml(html) {
    const $ = cheerio.load(html, { xmlMode: false });
    $('script, style').remove(); // Removes script and style elements
    let text = $('body').text(); // Extracts text from the body element
    text = text.replace(/\r?\n|\r|\t/g, ' '); // Removes newlines and tabs
    text = text.replace(/[^a-zA-Z0-9 ]/g, ' '); // Removes non-alphanumeric characters
    text = text.replace(/\s+/g, ' '); // Collapses multiple spaces into one
    return text.trim(); // Trims leading and trailing spaces
}

/**
 * Transform stream class for cleaning HTML content in chunks.
 */
class CleaningTransform extends Transform {
    _transform(chunk, encoding, callback) {
        try {
            const json = JSON.parse(chunk);
            const cleanedText = cleanHtml(json.result); // Cleans the HTML content
            this.push(cleanedText + '\n'); // Pushes the cleaned text to the stream
            callback();
        } catch (error) {
            // Handles JSON parsing errors
            console.error(`Error parsing JSON: ${error.message}`);
            console.error(`Problematic data (first 100 chars): ${chunk.toString().slice(0, 100)}`);
            callback();
        }
    }
}

/**
 * Main function to process the input file and write the output file.
 */
function processFile() {
    const readStream = fs.createReadStream(inputFile, { highWaterMark: 1024 * 1024 }); // Creates a read stream with an increased buffer size
    const writeStream = fs.createWriteStream(outputFile); // Creates a write stream for the output file
    const transformStream = new CleaningTransform(); // Instantiates the cleaning transform stream

    pipeline(
        readStream,
        readline.createInterface({ input: readStream, crlfDelay: Infinity }), // Uses readline to handle the input stream line by line
        transformStream, // Applies the cleaning transformation
        writeStream, // Writes the transformed data to the output file
        (err) => {
            // Handles any errors in the pipeline process
            if (err) {
                console.error('Pipeline failed:', err);
            } else {
                console.log('Pipeline succeeded.');
            }
        }
    );
}

processFile(); // Executes the file processing function
