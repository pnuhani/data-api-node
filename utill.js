
const fs = require('fs').promises;

async function writeRequestBodyToFile(requestBody, filePath) {


  try {
    // Read the existing content of the file, or initialize it as an empty array
    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      if (typeof fileContent === 'object') {
        // Check if the object is empty
        const jsonString = JSON.stringify(fileContent);
        const jsonObject = JSON.parse(jsonString);
        const isEmpty = Object.keys(jsonObject).length === 0;
        if (isEmpty) {
          console.log('The object is empty.');
        } else {
          existingData = JSON.parse(fileContent)
        }
      }
      
      if (fileContent.trim() !== '') {
        existingData = JSON.parse(fileContent);
      }
      
    } catch (readErr) {
      if (readErr.code !== 'ENOENT') {
        // Handle any read error other than "file not found"
        throw readErr;
      }
    }

    // Add the new JSON object to the array
    existingData.push(requestBody);

    // Convert the array to a string with commas between objects
    const jsonString1 = JSON.stringify(existingData, null, 2);

    // Write the updated content back to the file
     fs.writeFile(filePath, jsonString1);

    console.log('JSON object appended to file successfully');
  } catch (err) {
    console.error('Error appending JSON object to file:', err);
    throw err; // Re-throw the error to propagate it to the calling code if needed
  }
}

module.exports = {
  writeRequestBodyToFile,
};