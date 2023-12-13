import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const news = req.body.news || '';
  if (news.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid topic",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(news),
      temperature: 0.6,
      max_tokens: 400,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) { 
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(200).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(news) {
  const capitalizedNews =
    news[0].toUpperCase() + news.slice(1).toLowerCase();
  return `Write a news article based upon the topic. Do not include specific details. NO names. Make it 2 paragraphs.

Topic: Biden Warns Israel It Is Losing Support Over War
Article: President Biden told Israels leaders on Tuesday that they were losing international support for their war in Gaza, exposing a widening rift with Prime Minister Benjamin Netanyahu, who rejected out of hand the American vision for a postwar resolution to the conflict.
Topic: ${capitalizedNews}
Article:`;
}
