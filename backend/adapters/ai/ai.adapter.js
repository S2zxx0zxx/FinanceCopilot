import { GoogleGenAI } from '@google/genai';
import { AppError } from '../../utils/errors.js';

export class AIAdapter {
    constructor(apiKey, modelId = process.env.GEMINI_EXTRACTION_MODEL) {
        this.apiKey = apiKey;
        this.modelId = modelId;
    }
    async extractStructuredData(prompt, document, schema) {
        if (!this.apiKey || !this.modelId) throw new AppError('Configure GEMINI_API_KEY and GEMINI_EXTRACTION_MODEL for PDF extraction.', 503);
        const content = Buffer.isBuffer(document)
            ? { inlineData: { mimeType: 'application/pdf', data: document.toString('base64') } }
            : { text: String(document) };
        const client = new GoogleGenAI({apiKey:this.apiKey});
        try {
            const response = await client.models.generateContent({
                model:this.modelId,
                contents:[{role:'user',parts:[{text:prompt},content]}],
                config:{responseMimeType:'application/json',responseJsonSchema:schema,temperature:0,httpOptions:{timeout:60000}},
            });
            if (!response.text) throw new Error('Empty extraction response');
            return JSON.parse(response.text);
        } catch(error) {
            throw new AppError('Document extraction failed. Try again or import a CSV statement.', 502);
        }
    }
}
