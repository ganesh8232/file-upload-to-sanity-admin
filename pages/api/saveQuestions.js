import client from "../../lib/sanityConfig";

export default async function handler(req, res) {
  const apiKey = req.headers.authorization?.split(" ")[1];
  if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_AUTHORIZATION_KEY) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  const { questions, language } = req.body;
  try {
    await client.create({
      _type: language,
      questions,
    });

    res.status(200).json({ msg: "Sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error, check console" });
  }
}
