import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyAHv_Ve7IBZIn4eOL5xNInL1_to4sFv-dk';
const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-pro'
];

async function testAll() {
  for (const m of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent('Hola');
      console.log(`SUCCESS [${m}]:`, res.response.text().substring(0, 50));
      return m;
    } catch (e) {
      console.log(`FAILED [${m}]:`, e.message);
    }
  }
}

testAll();
