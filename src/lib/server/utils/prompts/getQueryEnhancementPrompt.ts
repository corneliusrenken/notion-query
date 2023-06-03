/* eslint-disable max-len */

export default function getQueryEnhancementPrompt(query: string) {
  return `Please expand this query so I can better use it to retrieve related vectors from my vector database. The goal is to create a more accurate vector by broadening the query while maintaining necessary specificity. If there is a central topic of the query, feel free to add a list of synonyms or keywords to assist in a more accurate vector creation. As continous text without labeling what is what (I only want my vector to contain relevant information, this way I can use the returned text for the vector embedding without formatting) return the original query, up to 3 modified queries, and any additional keywords. Here's the initial query: ${query}`;
}

// v1
// `Please assist in expanding and refining the query for retrieving vectors from my vector database. The goal is to create a more accurate vector by broadening the query while maintaining necessary specificity. Return the modified query only. Here's the initial query: ${query}`
