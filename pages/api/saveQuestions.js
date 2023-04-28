import client from "../../lib/sanityConfig";

export default async function handler(req, res) {
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
