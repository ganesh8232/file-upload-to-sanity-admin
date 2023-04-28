import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [required, setRequired] = useState(false);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const login = async () => {
    if (!email || !password) {
      setRequired(true);
      return;
    }
    setWrong(false);
    setRequired(false);
    setSubmitting(true);
    const url = "/api/login";
    const details = { email: email, password: password };

    try {
      const data = await axios.post(url, details);
      console.log(data);
      if (data.status == 200) {
        setWrong(false);
        sessionStorage.setItem("token", JSON.stringify(data.data.token));
        router.push("/admin");
      }
    } catch (error) {
      console.log(error);
      setWrong(true);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="flex h-screen bg-gray-50 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {required ? (
            <p className="text-red-600 text-base">Both are required</p>
          ) : (
            ""
          )}
          {wrong ? (
            <p className="text-red-600 text-base">Something wrong, try again</p>
          ) : (
            ""
          )}{" "}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 p-2
          shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 
          sm:text-sm sm:leading-6"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  required
                  className="block w-full rounded-md border-0 p-2
          py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
           focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                disabled={submitting}
                onClick={() => login()}
                className="flex w-full justify-center rounded-md disabled:bg-indigo-300 disabled:cursor-not-allowed bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {submitting ? "Submitting" : "Log in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
