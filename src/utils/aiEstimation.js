import { GoogleGenAI } from "@google/genai";

// Try automatic pickup first, fallback to manual
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

export async function estimateTaskHours(taskName, taskType, deadline, requirements = '') {
  try {
    const daysUntilDeadline = deadline ? 
      Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 
      'not specified';

    const prompt = `You are a study time estimation expert. Based on the task details below, estimate how many hours a typical college student would need to complete this task.

Task: "${taskName}"
Type: ${taskType === 'exam' ? 'Exam (studying)' : 'Assignment/Project'}
Days until deadline: ${daysUntilDeadline}

${requirements ? `Detailed Requirements/Description:
${requirements}

` : ''}Consider:
- If it's an exam, estimate study time needed (reading, note-taking, practice, review)
- If it's an assignment, estimate work time needed (research, writing, editing, formatting)
- Account for the complexity and scope described in the requirements
- Factor in research time, drafting, revisions, and final polish
- Be realistic but not overly generous
- Consider that students may need breaks and may not work at 100% efficiency

Respond with ONLY a single whole number representing hours. Examples: 3, 5, 12, 1

Do not include any text, explanations, or units - just the whole number.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3, // Lower temperature for more consistent estimates
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking for faster response
        },
      },
    });

    const estimatedHours = parseInt(response.text.trim());
    
    // Validate the response is a reasonable number
    if (isNaN(estimatedHours) || estimatedHours < 1 || estimatedHours > 100) {
      throw new Error('Invalid estimate received');
    }

    return estimatedHours;
  } catch (error) {
    console.error('AI estimation failed:', error);
    // Return a reasonable default based on task type
    return taskType === 'exam' ? 8 : 4;
  }
}