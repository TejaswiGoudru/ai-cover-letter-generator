import ollama from 'ollama/browser';

export async function generateCoverLetter(promptData: {
    jobDescription: string;
    resumeInfo: string;
    companyName: string;
    role: string;
    model: string;
    userName: string;
    date: string;
}) {
    const prompt = `
    Write a professional and compelling cover letter based on the following details:
    
    Date: ${promptData.date}
    Candidate Name: ${promptData.userName}
    Company Name: ${promptData.companyName}
    Target Role: ${promptData.role}
    
    Job Description:
    ${promptData.jobDescription}
    
    Candidate Skills/Experience:
    ${promptData.resumeInfo}
    
    Guidelines:
    1. The letter should be professional, confident, and tailored to the job description.
    2. Highlight how the candidate's skills align with the requirements.
    3. Use a formal tone and standard business letter format.
    4. Start the letter with the provided date: ${promptData.date}.
    5. Omit the sender's header contact info (address/phone), but include the formal greeting "Dear Hiring Manager" (or tailored if possible).
    6. Keep it concise (3-4 paragraphs).
    7. At the end, sign off with "Sincerely," followed by the candidate's name: ${promptData.userName}.
    8. CRITICAL: Do NOT include any introductory or conversational text (like "Here is the letter...") before or after the letter. Start DIRECTLY with the date.
  `;

    try {
        const response = await ollama.chat({
            model: promptData.model || 'llama3.2',
            messages: [
                { role: 'user', content: prompt }
            ],
        });

        return response.message.content;
    } catch (error) {
        console.error("Ollama Generation Error:", error);
        throw new Error(`Failed to generate cover letter. Make sure Ollama is running and the model '${promptData.model}' is pulled.`);
    }
}
