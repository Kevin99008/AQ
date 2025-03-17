"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, AlertCircle, RefreshCw, QrCode } from "lucide-react"
import { Html5QrcodeScanner } from "html5-qrcode"
import Link from "next/link"

export default function CheckAttendance() {
  const [scanning, setScanning] = useState(false)
  const [qrContent, setQrContent] = useState<string | null>(null)
  const [parsedContent, setParsedContent] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null

    if (scanning) {
      // Function to handle successful scans
      const onScanSuccess = (decodedText: string) => {
        // Store the raw QR code content
        setQrContent(decodedText)

        try {
          // Try to parse the QR code content as JSON
          const parsedData = JSON.parse(decodedText)
          setParsedContent(parsedData)
        } catch (e) {
          // If it's not valid JSON, just show the raw text
          setParsedContent(null)
        }
      }

      // Function to handle scan failures
      const onScanFailure = (error: string) => {
        // We don't need to show every scan failure as it happens continuously
        console.warn(`QR scan error: ${error}`)
      }

      // Initialize the scanner
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        false,
      )

      scanner.render(onScanSuccess, onScanFailure)
    }

    // Cleanup function
    return () => {
      if (scanner) {
        scanner.clear().catch((error) => {
          console.error("Failed to clear scanner", error)
        })
      }
    }
  }, [scanning])

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [error])

  const startScanning = () => {
    setScanning(true)
    setError(null)
    setQrContent(null)
    setParsedContent(null)
  }

  const stopScanning = () => {
    setScanning(false)
  }

  const clearResults = () => {
    setQrContent(null)
    setParsedContent(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Camera className="h-6 w-6" /> QR Code Scanner
          </CardTitle>
          <CardDescription>
            Scan QR codes to view their content. Position the QR code within the scanner frame.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!scanning ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
              <Camera className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground mb-4">
                Click the button below to start scanning QR codes with your camera
              </p>
              <Button onClick={startScanning} size="lg">
                Start Camera
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div id="reader" className="w-full max-w-md"></div>
              <Button onClick={stopScanning} variant="outline" className="mt-4">
                Stop Scanning
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error notification */}
      {error && (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* QR Code Content Display */}
      {qrContent && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>QR Code Content</CardTitle>
              <CardDescription>Data captured from the QR code</CardDescription>
            </div>
            {qrContent && (
              <Button variant="outline" size="sm" onClick={clearResults}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Raw Content:</h3>
                <div className="p-4 bg-muted rounded-md overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-words">{qrContent}</pre>
                </div>
              </div>

              {parsedContent && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Parsed JSON Content:</h3>
                  <div className="p-4 bg-muted rounded-md overflow-x-auto">
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(parsedContent).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 gap-4">
                          <div className="font-medium">{key}:</div>
                          <div className="col-span-2">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/generate">
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR Code
          </Link>
        </Button>
      </div>
    </div>
  )
}

