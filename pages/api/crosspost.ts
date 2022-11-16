import { TwitterApi } from "twitter-api-v2";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { body } = req;

    if (!body.tweetId) {
      return res.status(400).json({ data: "Error: tweet id not found!" });
    }

    if (!body.token) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: "Error: authentication failed!" });
    }

    const twitterClient = new TwitterApi(body.token);
    const readOnlyClient = twitterClient.readOnly;
    const { data } = await readOnlyClient.v2.get(`tweets/${body.tweetId}`);

    // Send a HTTP success code
    res.status(200).json(data);
  }
};

export default handler;
