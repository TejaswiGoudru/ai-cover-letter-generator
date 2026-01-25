const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function getAvailableModels() {
    try {
        const response = await fetch(`${API_URL}/models`);
        if (!response.ok) throw new Error('Failed to fetch models');
        return await response.json();
    } catch (error) {
        console.error("Error fetching models:", error);
        return [];
    }
}

export async function generateCoverLetter(promptData: {
    jobDescription: string;
    resumeInfo: string;
    companyName: string;
    role: string;
    model: string;
    userName: string;
    date: string;
}) {
    try {
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(promptData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate cover letter');
        }

        const data = await response.json();
        return data.content;
    } catch (error: any) {
        console.error("Generation Error:", error);
        throw new Error(error.message || 'Failed to generate cover letter. Make sure the backend API and Ollama are running.');
    }
}
