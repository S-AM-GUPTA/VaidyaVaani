require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { extractTextFromImage } = require('./src/services/ocr.service.ts');
const { summarizeReport } = require('./src/services/ai.service.ts');

async function testPipeline() {
  console.log("1. Starting test pipeline...");
  
  // Create a dummy image or use an existing one
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const files = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
  let testImagePath;
  
  if (files.length > 0) {
    testImagePath = path.join(uploadsDir, files[files.length - 1]);
    console.log(`Found existing image: ${testImagePath}`);
  } else {
    console.log("No images found in uploads. Cannot test OCR directly.");
    return;
  }
  
  try {
    console.log("2. Testing OCR Service...");
    const ocrText = await extractTextFromImage(testImagePath);
    console.log("OCR Success! Extracted text length:", ocrText.length);
    console.log("OCR Preview:", ocrText.substring(0, 100));
    
    console.log("3. Testing AI Service...");
    const aiResult = await summarizeReport(ocrText);
    console.log("AI Success! Result length:", aiResult.length);
    console.log("AI Preview:", aiResult.substring(0, 100));
    
  } catch (error) {
    console.error("Pipeline Failed:");
    console.error(error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Since we are requiring TS files, we need ts-node
require('ts-node').register();
testPipeline();
