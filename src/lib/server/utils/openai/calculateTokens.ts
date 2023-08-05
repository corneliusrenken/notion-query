// https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them

// 1 token ~= 4 chars in English
// 1 token ~= ¾ words
// 100 tokens ~= 75 words

/**
 * @param uncertainty value between 0 and 1, how much to add to the token count (percentage)
 */
export default function calculateTokens(string: string, uncertainty: number): number {
  const trimmed = string.trim();

  let charCount = 0;
  let wordCount = 0;

  // very basic, not really taking into account punctuation or anything
  for (let i = 0; i < trimmed.length; i += 1) {
    const char = trimmed[i];

    if (char === ' ') {
      wordCount += 1;
      while (trimmed[i + 1] === ' ') {
        i += 1;
      }
    } else {
      charCount += 1;
    }
  }

  const tokenCountByChar = Math.ceil(charCount / 4);
  const tokenCountByWord = Math.ceil(wordCount * 0.75);
  const tokenCountBy75Words = Math.ceil(wordCount / 75) * 100;

  const tokenCount = Math.max(tokenCountByChar, tokenCountByWord, tokenCountBy75Words);

  return tokenCount + Math.ceil(tokenCount * uncertainty);
}
