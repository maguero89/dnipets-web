import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyAHv_Ve7IBZIn4eOL5xNInL1_to4sFv-dk';
const genAI = new GoogleGenerativeAI(apiKey);

async function testSystemInstruction() {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: 'Eres VetAI de DNIPETS. Saluda cordialmente como asistente veterinario.'
    });
    const res = await model.generateContent('Hola');
    console.log('Result with systemInstruction:', res.response.text());
  } catch (e) {
    console.error('Error with systemInstruction:', e.message);
  }
}

testSystemInstruction();
