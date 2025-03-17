'use client'

import CheckoutPage from "@/components/payments/CheckoutPage";
import convertToSubcurrency from "@/utils/convertCurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns"

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {

  const searchParams = useSearchParams();

  // Extract query parameters
  const amount = Number(searchParams.get("amount")) || 0;
  const date = searchParams.get("date") || "";
  const studentId = searchParams.get("studentId") || "";
  const courseId = searchParams.get("courseId") || "";
  const teacherId = searchParams.get("teacherId") || "";
  const time = searchParams.get("time") || "";

  return (
    <main className=" p-10 text-white text-center border  rounded-md shadow-xl flex flex-col pt-12 items-center h-full">
      <div
        className="border-blue-600 rounded-2xl border w-1/2 shadow-lg mr-4"
        style={{
          boxShadow:
            "rgba(45, 50, 130, 0.15) 0px 12px 16px -4px, rgba(45, 50, 130, 0.15) 0px 4px 6px -2px",
        }}
      >
        <div className="pt-6 px-6">
          <div className="flex items-center">
            
            <h2 className="text-xl font-semibold text-gray-600">Package Confirmation</h2>
          </div>
        </div>
        <div className="px-6 pt-5 pb-8">
          <h3 className="text-sm font-medium text-gray-900">What's included</h3>
          <ul className="mt-4 space-y-4">
            <li className="flex space-x-3">
              <div className="flex justify-center items-center rounded-full bg-green-100 h-5 w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3 flex-shrink-0 text-green-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 15.586 19.293 5.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-500">Price: {amount} baht</span>
            </li>
            <li className="flex space-x-3">
              <div className="flex justify-center items-center rounded-full bg-green-100 h-5 w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3 flex-shrink-0 text-green-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 15.586 19.293 5.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-500">Date: {format(date, "PPP")}</span>
            </li>
            <li className="flex space-x-3">
              <div className="flex justify-center items-center rounded-full bg-green-100 h-5 w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3 flex-shrink-0 text-green-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 15.586 19.293 5.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-500">Time: {time}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-1/2 flex justify-center items-center mt-4">
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "thb",
          }}
        >
          <CheckoutPage amount={amount} date={date} studentId={studentId} courseId={courseId} teacherId={teacherId} time={time} />
        </Elements>
      </div>
    </main>)
}