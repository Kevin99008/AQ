"use client";

import { useState } from "react";
import useUserSession from "@/stores/user";
import { useRouter } from "next/navigation";
import logo from "@/assets/logo.png"
import Image from "next/image";

export default function LoginPage() {
  const { setUser, setTokens } = useUserSession();
  const { push } = useRouter();
  const [credentials, setCredentials] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
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
        const errorMessage =
          typeof data === "object"
            ? Object.entries(data)
                .map(([field, messages]) => `${field}: ${messages}`)
                .join(" | ")
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
  
      // Check user role and redirect accordingly
      if (userData.role === "staff") {
        push("admin/dashboard");
      } else if (userData.role === "user") {
        push("home/");
      } else {
        push("/");
      }
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };
  

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <div className="w-full max-w-md m-auto bg-white shadow-lg rounded-lg p-8">
        <header className="flex flex-col items-center">
          <Image
            className="w-40 mb-4"
            src={logo}
            alt="Tiger Icon"
          />
          <h2 className="text-xl font-semibold text-gray-700">Welcome Back</h2>
        </header>
        <div className="mt-6">
          <label className="block text-gray-600 text-sm mb-1" htmlFor="username">
            Username
          </label>
          <input
            className="w-full p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-600 text-sm mb-1" htmlFor="password">
            Password
          </label>
          <input
            className="w-full p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <button
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition"
          onClick={handleLogin}
        >
          Login
        </button>
        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        <footer className="flex justify-between text-sm mt-4">
          <a className="text-blue-500 hover:underline" href="#">
            Forgot Password?
          </a>
          <a className="text-blue-500 hover:underline" href="#">
            Create Account
          </a>
        </footer>
      </div>
    </div>
  );
}
