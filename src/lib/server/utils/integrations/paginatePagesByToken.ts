/* eslint-disable array-bracket-spacing */
/* eslint-disable object-curly-newline */
/* eslint-disable prefer-const */
import calculateTokens from '../openai/calculateTokens';

// divides a string into sections of a given length
// todo: include overlap of pages
export default function paginatePagesByToken(
  pages: {
    id: string,
    title: string,
    url: string,
    content: string[] | string,
  }[],
  availableTokens: number,
) {
  // tokens used up by anything but the content
  const pageOtherTokenLengths = pages
    .map(({ id, title, url }) => ([ id, title, url ].join(' ')))
    .map((page) => calculateTokens(page, 0.2));

  const slices: { text: string, tokens: number }[] = [{ text: '', tokens: 0 }];

  // todo: this technically breaks if the otherTokenLength is too long to ever fit any content
  pageOtherTokenLengths.forEach((otherTokenLength, i) => {
    const page = pages[i];
    const { id, url, title } = page;
    const content = Array.isArray(page.content) ? page.content.join(' ') : page.content;

    let contentStart = 0;
    let contentEnd = content.length - 1;

    while (contentStart <= contentEnd) {
      const slice = slices[slices.length - 1];
      let spaceInSlice = availableTokens - slice.tokens;
      const spaceForContent = spaceInSlice - otherTokenLength;
      let contentSlice = content.slice(contentStart, contentEnd + 1);
      let contentSliceTokens = calculateTokens(contentSlice, 0.2);

      // How much of the content can fit into the space in slice
      const percentageFit = spaceForContent / contentSliceTokens;

      // if all of it fits, add it
      if (percentageFit >= 1) {
        contentStart = contentEnd + 1;
      // if you can't fit all content in this slice, set new contentSlice
      } else {
        const desiredContentSliceLength = Math.floor(percentageFit * contentSlice.length);
        contentSlice = contentSlice.slice(0, desiredContentSliceLength);
        contentSliceTokens = calculateTokens(contentSlice, 0.2);
        contentStart += desiredContentSliceLength;
      }

      slice.text += JSON.stringify({ id, url, title, content: contentSlice });
      slice.tokens += contentSliceTokens;

      // if the slice now has less than 20% space left, create a new one
      if ((availableTokens - slice.tokens) / availableTokens < 0.2) {
        slices.push({ text: '', tokens: 0 });
      }
    }
  });

  if (slices[slices.length - 1].text === '') slices.pop();

  return slices.map(({ text }) => text);
}
