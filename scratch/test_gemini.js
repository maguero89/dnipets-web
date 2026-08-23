import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyAHv_Ve7IBZIn4eOL5xNInL1_to4sFv-dk';
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hola');
    console.log('Gemini Result:', result.response.text());
  } catch (e) {
    console.error('Gemini Error:', e.message);
  }
}

test();
