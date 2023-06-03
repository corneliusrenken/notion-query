import openai from '.';

export default async function getGpt4Completion(text: string) {
  const response = await openai.createChatCompletion({
    // todo: look into the more specific parameters here
    model: 'gpt-4',
    n: 1,
    messages: [{
      role: 'user',
      content: text,
    }],
  });

  const message = response.data.choices[0].message?.content;

  if (!message) throw new Error('No message returned from OpenAI');

  return message;
}
