import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Adjust imports according to your library

interface QRCodeDialogProps {
    studentName: string;
    studentId: string | number | null; // Allow null for studentId
    isOpen: boolean;
    onClose: () => void;
  }
  
  export function QRCodeDialog({
    studentName,
    studentId,
    isOpen,
    onClose,
  }: QRCodeDialogProps) {
    const [qrCode, setQrCode] = useState<string | null>(null);
  
    // Generate QR code for student when the modal opens or studentId changes
    useEffect(() => {
      const generateQRCode = async () => {
        if (studentId === null) return; // If studentId is null, do nothing
  
        try {
          const QRCode = (await import('qrcode')).default;
          const qrData = JSON.stringify({ student_id: studentId.toString() });
          const url = await QRCode.toDataURL(qrData);
          setQrCode(url);
        } catch (err) {
          console.error('Failed to generate QR code:', err);
          setQrCode(null);
        }
      };
  
      if (isOpen && studentId !== null) {
        generateQRCode();
      }
    }, [studentId, isOpen]); // Re-run when studentId or isOpen changes
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code for {studentName}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-6">
            {qrCode ? (
              <div className="bg-white p-4 rounded-md">
                <img
                  src={qrCode || '/placeholder.svg'}
                  alt={`QR Code for ${studentName}`}
                  className="h-48 w-48"
                />
              </div>
            ) : (
              <p>QR code is being generated...</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }