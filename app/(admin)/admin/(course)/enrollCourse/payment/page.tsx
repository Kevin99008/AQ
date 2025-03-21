'use client'

import CheckoutPage from "@/components/payments/CheckoutPage";
import convertToSubcurrency from "@/utils/convertCurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns"
import { Calendar, Clock, CreditCard, Package } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


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
  const courseName = searchParams.get("courseName") || "";

  return (
    <main className="p-4 flex items-center justify-center w-full mx-auto">
      <div className="w-full mb-6">
        <Card className="w-full overflow-hidden border shadow-lg">
          {/* Package header with accent color */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-6 w-6" />
              <h2 className="text-xl font-bold">{courseName}</h2>
            </div>
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
              One-time purchase
            </Badge>
          </div>

          <CardHeader className="pt-6">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">{amount} ฿</span>
              <span className="text-sm text-muted-foreground">Thai Baht</span>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Package Details</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">{format(date, "PPP")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-medium">{time || "10:00 AM"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <p className="font-medium">One-time payment</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col border-t p-6 gap-4">
            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: convertToSubcurrency(amount),
                currency: "thb",
              }}
            >
              <CheckoutPage
                amount={amount}
                date={date}
                studentId={studentId}
                courseId={courseId}
                teacherId={teacherId}
                time={time}
              />
            </Elements>
          </CardFooter>
        </Card>
      </div>
    </main>)
}