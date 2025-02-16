"use client";

import Image from "next/image";
import useUserSession from "@/stores/user";

export default function LoginPage() {
  const { setTokens, setUser, user } = useUserSession();

  const handleLogin = () => {
    setUser({
      id: "test",
      email: "test",
      role: "admin",
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
        <div className="flex justify-center items-center mb-6"> {/* Changed justify-between to justify-center */}
            <h1 className="text-2xl font-bold text-gray-800">
                Welcome Back
            </h1>
        </div>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                UserID
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="UserID"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600">
          <button onClick={handleLogin}>Debug Login</button>
          </p>
        </div>
      </div>
    </section>
  );
}
