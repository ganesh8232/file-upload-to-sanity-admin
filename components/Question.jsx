import { Disclosure } from "@headlessui/react";
import { ArrowUpTrayIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Questions({ questions, router }) {
  const [language, setLanguage] = useState("korean");
  const [submitting, setSubmitting] = useState(false);
  const validateQuestions = (questions) => {
    const errors = [];

    if (!Array.isArray(questions) || questions.length === 0) {
      errors.push("There must be at least one question");
      return errors;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (
        !question.hasOwnProperty("question") ||
        !question.hasOwnProperty("content") ||
        !question.hasOwnProperty("_key") ||
        !question.hasOwnProperty("questionNumber") ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !question.options.every(
          (option) =>
            option.hasOwnProperty("_key") &&
            option.hasOwnProperty("answerText") &&
            option.hasOwnProperty("isCorrect")
        ) ||
        !question.options.some((option) => option.isCorrect)
      ) {
        errors.push(`${i + 1}`);
      }
    }

    return errors.length > 0 ? errors : null;
  };
  const error = validateQuestions(questions);

  const UploadToSanity = async () => {
    if (!questions || !language) return;
    setSubmitting(true);
    const url = "/api/saveQuestions";
    const details = { questions: questions, language: language };

    try {
      await axios.post(url, details);
      router.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-full xl py-10 px-4">
      <div className="mx-auto max-w-3xl divide-y-2 divide-gray-200">
        <h2 className="text-center text-3xl mb-1 font-bold tracking-tight text-gray-900 sm:text-4xl">
          Questions
        </h2>
        <div className="pt-5 flex flex-col gap-4 justify-center items-center text-2xl">
          <div className="flex justify-center items-center">
            <button
              onClick={() => router.reload()}
              className="inline-flex  items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              Re Upload
            </button>
          </div>
          <div className="flex gap-0.5">
            {error ? (
              <>
                {error.map((errorMsg, index) => (
                  <p key={index} className="text-red-600 m-2">
                    {errorMsg}
                  </p>
                ))}
                <p className="text-red-600 m-2">invalid</p>
              </>
            ) : (
              <p className="text-green-500">All questions are valid</p>
            )}
          </div>

          <div className="py-2">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700"
            >
              Language
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm  disabled:bg-indigo-300 disabled:cursor-not-allowed"
              defaultValue="korean"
              disabled={error}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="korean">korean</option>
              <option value="japanese">japanese</option>
            </select>
          </div>

          <button
            disabled={error || submitting}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            onClick={UploadToSanity}
          >
            <ArrowUpTrayIcon
              className="-ml-1 mr-3 h-5 w-5"
              aria-hidden="true"
            />
            {submitting ? "Uploading" : "Upload to sanity"}
          </button>
        </div>

        <dl className="mt-6 space-y-6 divide-y divide-gray-200">
          {questions.map((question) => (
            <Disclosure as="div" key={question?._key} className="pt-6">
              {({ open }) => (
                <>
                  <dt className="text-lg">
                    <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-400">
                      <span className="font-medium text-gray-900">
                        {question?.questionNumber}. {question?.question}
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        <ChevronDownIcon
                          className={classNames(
                            open ? "-rotate-180" : "rotate-0",
                            "h-6 w-6 transform"
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-2 pr-12">
                    <div className="text-base flex gap-3 flex-col">
                      {question?.options.map((option) => {
                        return (
                          <p
                            key={option?._key}
                            className={
                              option?.isCorrect
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            {option.answerText}
                          </p>
                        );
                      })}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </dl>
      </div>
    </div>
  );
}
