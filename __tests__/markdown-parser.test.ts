import { describe, expect, test } from "@jest/globals";
import { parseHashtag, parseUsername, textToMarkdownParser } from "src/utils/string";

const longTweet = `Super GM #Dotsama 
    Super GM #Web3 
    
    The 🌍 is YOURS!
    OWN IT!
    
    YOU CAN, achieve everything you think of!
    If YOU 👀 it in YOUR mind, YOU CAN, hold it in YOUR 🤲
    
    ⌚ is YOURS!
    Spend it how YOU choose!
    Just spend it wisely driving towards the dream YOU visualise!
    
    Let's go!
    
    🥂🚀`;

const inputHashtag = `Polkadot is the new #Web3 ecosystem.`;
const outputHashtag = `Polkadot is the new [#Web3](https://twitter.com/hashtag/Web3?src=hashtag_click) ecosystem.`;

const inputHashtagDigitOnly = "First thing #1, second thing #2, third thing #3";

const inputNoWhiteSpace = "123#sofun";

const inputHashtagWithPunctuation = "#it’sfun";
const outputHashtagWithPunctuation = "#it";

describe("Hashtag parser", () => {
  test("should return a defined value when given a non-empty string", () => {
    expect(parseHashtag(longTweet)).toBeDefined();
  });

  test("should return a string when given a non-empty string", () => {
    expect(typeof parseHashtag(longTweet)).toBe("string");
  });

  test("should return markdown-formatted string when given a string with hashtag", () => {
    expect(parseHashtag(inputHashtag)).toMatch(outputHashtag);
  });

  test("should not parse the hashtag if it is followed by digits only", () => {
    expect(parseHashtag(inputHashtagDigitOnly)).toMatch(inputHashtagDigitOnly);
  });

  test("should not work for letters or numbers in front of the # symbol", () => {
    expect(parseHashtag(inputNoWhiteSpace)).toMatch(inputNoWhiteSpace);
  });

  test("should cut words in hashtag if punctuation is present", () => {
    expect(parseHashtag(inputHashtagWithPunctuation)).toMatch(outputHashtagWithPunctuation);
  });
});

const inputUsername = "@SubsocialChain is a decentralised social finance platform.";
const outputUsername =
  "[@SubsocialChain](https://twitter.com/SubsocialChain) is a decentralised social finance platform.";

const inputUsernameWithCharPrefix = "123@TwitterSupport";

describe("Username parser", () => {
  test("should return a defined value when given a non-empty string", () => {
    expect(parseUsername(longTweet)).toBeDefined();
  });

  test("should return a string when given a non-empty string", () => {
    expect(typeof parseUsername(longTweet)).toBe("string");
  });

  test("should return markdown-formatted string when given a string with @ symbol", () => {
    expect(parseUsername(inputUsername)).toMatch(outputUsername);
  });

  test("should return the same string if usernames preceeded with characters", () => {
    expect(parseUsername(inputUsernameWithCharPrefix)).toMatch(inputUsernameWithCharPrefix);
  });
});

const inputCombinedString = inputHashtag + inputUsername;
const outputCombinedString = outputHashtag + outputUsername;

describe("Markdown parser", () => {
  test("should return a defined value when given a non-empty string", () => {
    expect(textToMarkdownParser(longTweet)).toBeDefined();
  });

  test("should return a string when given a non-empty string", () => {
    expect(typeof textToMarkdownParser(longTweet)).toBe("string");
  });

  test("should return markdown-formatted strings for usernames and hashtags", () => {
    expect(textToMarkdownParser(inputCombinedString)).toMatch(outputCombinedString);
  });
});
