"use client";

import { useState } from "react";
import useUserSession from "@/stores/user";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { setUser, setTokens } = useUserSession();
  const { push } = useRouter();
  const [credentials, setCredentials] = useState<{ username: string; password: string }>(
    {
      username: "",
      password: "",
    }
  );
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = typeof data === "object"
        ? Object.entries(data)
            .map(([field, messages]) => `${field}: ${messages}`)
            .join(" | ") // Join errors with " | "
        : "Invalid credentials";

        throw new Error(errorMessage);
      }

      const { access, refresh } = await response.json();
      setTokens(access, refresh);

      const userResponse = await fetch("http://localhost:8000/api/user/info/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();

      setUser(userData);
      push("admin/aquakids")

  } catch (err: any) {
    if (err instanceof Error) {
      setError(err.message); // Show the actual API error
    } else {
      setError("Something went wrong");
    }
  }
  };

  return (
    <div className="flex h-screen bg-indigo-700">
      <div className="w-full max-w-xs m-auto bg-indigo-100 rounded p-5">
        <header>
          <img
            className="w-20 mx-auto mb-5"
            src="https://img.icons8.com/fluent/344/year-of-tiger.png"
            alt="Tiger Icon"
          />
        </header>
        <div>
          <label className="block mb-2 text-indigo-500" htmlFor="username">
            Username
          </label>
          <input
            className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-2 text-indigo-500" htmlFor="password">
            Password
          </label>
          <input
            className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <button
            className="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <footer className="flex justify-between text-sm">
          <a className="text-indigo-700 hover:text-pink-700" href="#">
            Forgot Password?
          </a>
          <a className="text-indigo-700 hover:text-pink-700" href="#">
            Create Account
          </a>
        </footer>
      </div>
    </div>
  );
}