export const trimMiddleString = (text?: string, numberStringsKept = 5) => {
  if (!text) return "";
  const result = `${text.slice(0, numberStringsKept)}...${text.slice(
    text.length - numberStringsKept,
  )}`;

  return result;
};
