
import { GoogleGenAI } from "@google/genai";

// Always initialize GoogleGenAI with process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBookDescription = async (title: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-flash-preview for basic summarization/description tasks.
      model: 'gemini-3-flash-preview',
      contents: `Berikan deskripsi singkat (maksimum 100 kata) dalam bahasa Indonesia untuk buku berjudul "${title}" yang termasuk dalam kategori "${category}". Deskripsi harus menarik dan informatif untuk perpustakaan sekolah.`,
    });
    // Extracting text output from GenerateContentResponse using the .text property.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal mendapatkan deskripsi AI.";
  }
};

export const getLibraryInsights = async (bookData: any) => {
  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for complex reasoning and strategic analysis tasks.
      model: 'gemini-3-pro-preview',
      contents: `Analisis data buku perpustakaan berikut dan berikan satu kalimat saran strategis untuk meningkatkan minat baca siswa: ${JSON.stringify(bookData)}`,
    });
    // Extracting text output from GenerateContentResponse using the .text property.
    return response.text;
  } catch (error) {
    return "Lanjutkan semangat membaca!";
  }
};
