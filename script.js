const fs = require('fs');
const readline = require('readline');
const cheerio = require('cheerio');
const { Transform, pipeline } = require('stream');

const inputFile = process.argv[2] || 'cleaning.jsonl';
const outputFile = process.argv[3] || 'cleaned_data.txt';

function cleanHtml(html) {
    const $ = cheerio.load(html, { xmlMode: false });
    $('script, style').remove();
    let text = $('body').text();
    text = text.replace(/\r?\n|\r|\t/g, ' ');
    text = text.replace(/[^a-zA-Z0-9 ]/g, ' ');
    text = text.replace(/\s+/g, ' ');
    return text.trim();
}

class CleaningTransform extends Transform {
    _transform(chunk, encoding, callback) {
        try {
            const json = JSON.parse(chunk);
            const cleanedText = cleanHtml(json.result);
            this.push(cleanedText + '\n');
            callback();
        } catch (error) {
            console.error(`Error parsing JSON: ${error.message}`);
            console.error(`Problematic data (first 100 chars): ${chunk.toString().slice(0, 100)}`);
            callback();
        }
    }
}

function processFile() {
    const readStream = fs.createReadStream(inputFile, { highWaterMark: 1024 * 1024 }); // Increased buffer size
    const writeStream = fs.createWriteStream(outputFile);
    const transformStream = new CleaningTransform();

    pipeline(
        readStream, 
        readline.createInterface({ input: readStream, crlfDelay: Infinity }), 
        transformStream, 
        writeStream, 
        (err) => {
            if (err) {
                console.error('Pipeline failed:', err);
            } else {
                console.log('Pipeline succeeded.');
            }
        }
    );
}

processFile();
