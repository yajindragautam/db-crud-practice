import fs from 'fs';
import path from "path";

export const saveBufferToFile = async(buffer, filename) => {
  try {
    // Specify the file path where you want to save the file
    const filePath = path.join(__dirname,`../../public/downloads/${filename}.xlsx`);
    
    // Write the buffer to the file
    fs.writeFileSync(filePath, buffer);

    return filePath; // Return the file path if needed
  } catch (err) {
    console.error(err);
  }
}