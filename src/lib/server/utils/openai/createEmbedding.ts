// creates a vector embedding - "a numerical representation of the meaning behind the text"

import openai from '.';

export default async function createEmbedding(text: string): Promise<number[]>;
export default async function createEmbedding(text: string[]): Promise<number[][]>;
export default async function createEmbedding(text: string | string[]) {
  const res = await openai.createEmbedding({
    input: text,
    model: 'text-embedding-ada-002',
  });

  const embeddings = res.data.data.map(({ embedding }) => embedding);

  return Array.isArray(text) ? embeddings : embeddings[0];
}
