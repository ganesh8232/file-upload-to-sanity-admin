import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Questions({ questions }) {
  const validateQuestions = (questions) => {
    const errors = [];

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
        errors.push(`${i + 1} is invalid`);
      }
    }

    return errors.length > 0 ? errors : null;
  };

  const error = validateQuestions(questions);

  return (
    <div className="mx-auto max-w-full xl py-10 px-4">
      <div className="mx-auto max-w-3xl divide-y-2 divide-gray-200">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Question with answer
        </h2>
        <div className="pt-5  flex justify-center items-center text-2xl">
          {error ? (
            error.map((errorMsg, index) => (
              <p key={index} className="text-red-600">
                {errorMsg}
              </p>
            ))
          ) : (
            <p className="text-green-500">All questions are valid</p>
          )}
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
