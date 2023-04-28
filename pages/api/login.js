import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  const { email, password } = req.body;
  console.log(email, password);
  if (email == process.env.EMAIL && password == process.env.PASSWORD) {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    const token = CryptoJS.AES.encrypt(email, secretKey).toString();
    res
      .status(200)
      .json({ message: "Authentication successful", token: token });
  } else {
    res.status(404).json({ message: "Invalid email or password" });
  }
}
