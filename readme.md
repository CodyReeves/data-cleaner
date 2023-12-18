# HTML Cleaning Script

This Node.js script is designed for processing and cleaning HTML content from a JSON Lines input file, extracting meaningful text, and writing it to a text output file. It leverages Node.js modules like `fs`, `readline`, `cheerio`, and `stream` for efficient processing.

## Features

- **HTML Cleaning**: Extracts and cleans text from HTML content.
- **Efficient Processing**: Handles large files efficiently using streams.
- **Customizable Input/Output**: Allows specifying input and output file paths via command-line arguments.

## Prerequisites

- Node.js installed on your machine.
- NPM for managing packages (if additional packages need to be installed).
- The `cheerio` package for HTML parsing (install with `npm install cheerio`).

## Installation

Clone the repository or download the script to your local machine. Install the required Node.js packages:

```bash
npm install fs readline cheerio stream
```

## Usage

Run the script with Node.js, optionally specifying the input and output file paths:

```bash
node script.js [inputFile] [outputFile]
```

- `inputFile`: Path to the input JSON Lines file containing HTML (default: 'cleaning.jsonl').
- `outputFile`: Path to the output text file (default: 'cleaned_data.txt').

## Script Overview

- **cleanHtml(html)**: Function to clean HTML content by removing unnecessary elements and normalizing text.
- **CleaningTransform**: A custom Transform stream class to process and clean HTML content.
- **processFile()**: Main function to set up streams and process the input file.

## Customization

- Modify `cleanHtml` function for different HTML cleaning rules.
- Adjust stream buffer size in `processFile` for handling files of different sizes.

## Troubleshooting

- Check for any errors in the console.
- Ensure input files are in the correct JSON Lines format.
- Validate the HTML structure in the input file for compatibility with the script.

## Contributing

Feel free to fork the repository and submit pull requests with enhancements.

## License

This project is open-sourced under the [MIT License](LICENSE).