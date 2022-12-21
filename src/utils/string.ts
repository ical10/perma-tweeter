export const trimMiddleString = (text?: string, numberStringsKept = 5) => {
  if (!text) return "";
  const result = `${text.slice(0, numberStringsKept)}...${text.slice(
    text.length - numberStringsKept,
  )}`;

  return result;
};

export const textToMarkdownParser = (text: string) => {
  const hashtagParsed = text.replace(
    /#(\w+)/g,
    "[#$1](https://twitter.com/hashtag/$1?src=hashtag_click)",
  );
  const markdownReady = hashtagParsed.replace(/@(\w+)/g, "[@$1](https://twitter.com/$1)");

  return markdownReady;
};
