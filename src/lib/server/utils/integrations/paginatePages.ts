/* eslint-disable array-bracket-spacing */
/* eslint-disable object-curly-newline */
/* eslint-disable prefer-const */
import calculateTokens from '../openai/calculateTokens';

// divides a string into sections of a given length, with a given overlap
export default function paginatePages(
  pages: {
    id: string,
    title: string,
    url: string,
    content: string[] | string,
  }[],
  availableTokens: number,
) {
  const pageOtherTokenLengths = pages
    .map(({ id, title, url }) => ([ id, title, url ].join(' ')))
    .map((page) => calculateTokens(page, 0.2));

  const slices: { text: string, tokens: number }[] = [{ text: '', tokens: 0 }];

  pageOtherTokenLengths.forEach((otherTokenLength, i) => {
    const page = pages[i];
    const { id, url, title } = page;
    const content = Array.isArray(page.content) ? page.content.join(' ') : page.content;

    let contentStart = 0;
    let contentEnd = content.length - 1;

    while (contentStart <= contentEnd) {
      const currentSlice = slices[slices.length - 1];
      let spaceInCurrentSlice = availableTokens - currentSlice.tokens;

      const spaceForContent = spaceInCurrentSlice - otherTokenLength;

      let contentSlice = content.slice(contentStart, contentEnd + 1);

      let contentSliceTokenLength = calculateTokens(contentSlice, 0.2);

      // if all of it fits
      if (contentSliceTokenLength <= spaceForContent) {
        currentSlice.tokens += otherTokenLength + contentSliceTokenLength;
        currentSlice.text += JSON.stringify({ id, url, title, content: contentSlice });
        contentStart = contentEnd + 1;

        // add a new slice if the current one only has 20% space left
        spaceInCurrentSlice = availableTokens - currentSlice.tokens;

        if ((spaceInCurrentSlice / availableTokens) < 0.2) {
          slices.push({ text: '', tokens: 0 });
        }
      // if only part of the page fits
      } else {
        const percentageFit = spaceForContent / contentSliceTokenLength;
        const contentSliceLength = Math.floor(contentSlice.length * percentageFit);

        contentSlice = content.slice(contentStart, contentStart + contentSliceLength);
        contentSliceTokenLength = calculateTokens(contentSlice, 0.2);

        currentSlice.tokens += contentSliceTokenLength;
        currentSlice.text += JSON.stringify({ id, url, title, contentSlice });

        contentStart += contentSliceLength;
        // add a new slice, filled this one up
        slices.push({ text: '', tokens: 0 });
      }
    }
  });

  return slices.map(({ text }) => text);
}
