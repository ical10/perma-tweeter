import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { textToMarkdownParser } from "src/utils/string";

type TweetBodyProps = {
  text: string;
};

const TweetBody = ({ text }: TweetBodyProps) => {
  const parsedMD = useMemo(() => {
    const result = textToMarkdownParser(text);
    return result;
  }, [text]);

  return (
    <ReactMarkdown
      linkTarget="_blank"
      components={{
        a: ({ node, ...props }) => <a className="text-[#316CF4]" {...props} />,
      }}
      remarkPlugins={[remarkGfm]}>
      {parsedMD}
    </ReactMarkdown>
  );
};

export default TweetBody;
