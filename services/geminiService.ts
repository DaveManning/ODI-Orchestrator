
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessData, DashboardReport } from "../types";

// Always initialize the client with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBusinessProblem = async (data: BusinessData): Promise<DashboardReport> => {
  // Use gemini-3-pro-preview for complex reasoning tasks
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    Analyze the following business problem for a data analyst dashboard.
    Industry: ${data.industry}
    Core Problem: ${data.problemStatement}
    Current Metrics:
    - Gross Revenue: $${data.grossRevenue}
    - Net Margin: ${data.netMargin}%
    - NRR: ${data.nrr}%
    - CAC: $${data.cac}
    
    User-defined Pain Points:
    ${data.painPoints.map(p => `- ${p.issue} (Impact: ${p.perceivedImpact})`).join('\n')}

    Your task:
    1. Write a concise executive summary restating the core problem and its urgency.
    2. Provide 4 industry benchmarks based on the industry provided for the specific metrics.
    3. Perform a root cause exploration. Re-evaluate the pain points and weight them using a Pareto (80/20) perspective.
    4. Challenge the user's assumptions. As a senior data analyst, what are they missing? What hidden risks do you see?
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          benchmarks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                metric: { type: Type.STRING },
                userValue: { type: Type.NUMBER },
                industryMedian: { type: Type.NUMBER },
                percentile: { type: Type.NUMBER }
              },
              required: ["metric", "userValue", "industryMedian", "percentile"]
            }
          },
          rootCauses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                cause: { type: Type.STRING },
                impactWeight: { type: Type.NUMBER },
                isParetoCritical: { type: Type.BOOLEAN }
              },
              required: ["cause", "impactWeight", "isParetoCritical"]
            }
          },
          aiChallenge: { type: Type.STRING }
        },
        required: ["executiveSummary", "benchmarks", "rootCauses", "aiChallenge"]
      }
    }
  });

  // response.text is a getter property, not a method
  const text = response.text || "{}";
  return JSON.parse(text);
};
