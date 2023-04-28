import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Questions from "../components/Question";
import Link from "next/link";

const rules = [
  "if you dont know how to format file, you can see example by clicking above button",
  "if the answer is true, then you have addd word 'ganesh' at the end",
  "Every question should end with question mark ( ? )",
  "if your question doesnt end with ( ? ), then you will see error",
  "You cant upload to sanity till you solve all the errors",
];

const Admin = () => {
  const router = useRouter();
  const [fileQuestions, setFileQuestions] = useState(null);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token || !token == process.env.NEXT_PUBLIC_TOKEN) {
      router.push("/");
    }
  }, [router]);

  function parseQuestions(textContent) {
    const lines = textContent.split("\n").filter((line) => line.trim() !== "");
    const questions = [];
    let currentQuestion = null;
    let questionNumber = 1;

    for (const line of lines) {
      if (line.endsWith("?")) {
        if (currentQuestion !== null) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          question: line.trim(),
          options: [],
          content: "question",
          _key: uuidv4(),
          questionNumber: questionNumber,
        };
        questionNumber++;
      } else {
        const isCorrect = line.endsWith("ganesh");
        const answerText = isCorrect ? line.slice(0, -6).trim() : line.trim();
        currentQuestion?.options.push({
          answerText,
          isCorrect,
          _key: uuidv4(),
        });
      }
    }

    if (currentQuestion !== null) {
      questions.push(currentQuestion);
    }
    return questions;
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const textContent = event.target.result;
      const questions = parseQuestions(textContent);
      setFileQuestions(questions);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-10 ">
      {!fileQuestions && (
        <div className="flex flex-col gap-3">
          <div className="flex  justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".txt"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">.txt only</p>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Link
              href="/example.txt"
              target="_blank"
              rel="norefferer"
              className="inline-flex  items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              See Example
            </Link>
          </div>
          <div className="mt-4 flex justify-center items-center">
            <ul
              className="list-disc pl-4"
              style={{ textAlign: "left", paddingLeft: "1em" }}
            >
              {rules.map((rule) => (
                <li key={rule}>
                  <span className="font-medium text-gray-800">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {fileQuestions && <Questions questions={fileQuestions} router={router} />}
    </div>
  );
};

export default Admin;
