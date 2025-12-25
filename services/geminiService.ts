
import { GoogleGenAI, Type } from "@google/genai";
import { SEOAuditReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    domain: { type: Type.STRING },
    overallScore: { type: Type.NUMBER },
    categories: {
      type: Type.OBJECT,
      properties: {
        onPage: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            status: { type: Type.STRING },
            details: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "status", "details"]
        },
        technical: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            status: { type: Type.STRING },
            details: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "status", "details"]
        },
        offPage: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            status: { type: Type.STRING },
            details: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "status", "details"]
        },
        authority: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            status: { type: Type.STRING },
            details: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "status", "details"]
        },
        indexing: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            status: { type: Type.STRING },
            details: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "status", "details"]
        }
      },
      required: ["onPage", "technical", "offPage", "authority", "indexing"]
    },
    keyFindings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          category: { type: Type.STRING },
          message: { type: Type.STRING }
        },
        required: ["type", "category", "message"]
      }
    },
    competitorInsights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          competitor: { type: Type.STRING },
          advantage: { type: Type.STRING },
          threat: { type: Type.STRING }
        },
        required: ["competitor", "advantage", "threat"]
      }
    },
    actionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          priority: { type: Type.STRING },
          task: { type: Type.STRING },
          impact: { type: Type.STRING }
        },
        required: ["priority", "task", "impact"]
      }
    }
  },
  required: ["domain", "overallScore", "categories", "keyFindings", "competitorInsights", "actionPlan"]
};

export async function auditWebsite(url: string): Promise<SEOAuditReport> {
  const model = 'gemini-3-pro-preview';
  
  const systemInstruction = `
    You are an AI-powered Website SEO Audit & Intelligence Tool.
    Analyze the given URL: ${url}. 
    Use Google Search grounding to find real-world data about the site:
    1. Its indexing status (site: search).
    2. Domain Authority estimates from public mentions or rankings.
    3. Backlink profile indicators and brand mentions.
    4. Technical SEO clues (page speed, mobile friendliness mentions).
    5. On-page analysis based on public snippets and site structure.
    6. Competitor analysis (who else ranks for their key terms).
    
    Return a comprehensive report in JSON format. 
    Ensure scores (0-100) are realistic based on the data found.
    Categorize status as 'good', 'warning', or 'critical'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Perform a full SEO audit for the website: ${url}`,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: REPORT_SCHEMA,
      },
    });

    const report: SEOAuditReport = JSON.parse(response.text || "{}");
    
    // Add grounding sources if available
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      report.groundingSources = response.candidates[0].groundingMetadata.groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri);
    }

    return report;
  } catch (error) {
    console.error("SEO Audit Error:", error);
    throw new Error("Failed to analyze website. Please check the URL and try again.");
  }
}
