// pages/checkout.tsx
import React, { useState } from 'react';
import Omise from 'omise';

interface ICard {
  name: string;
  city: string;
  postal_code: number | string;
  number: string;
  security_code: string;
  expiration_month: number | string;
  expiration_year: number | string;
  country?: string;
  state?: string;
  phone_number?: string;
  street1?: string;
  street2?: string;
}

const CheckoutPage = () => {
  const [amount, setAmount] = useState(1000); // Amount in cents
  const [isProcessing, setIsProcessing] = useState(false);

  const omise = Omise({
    publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY, // Ensure your public key is set in .env.local
  });

  const handleCheckout = async () => {
    setIsProcessing(true);

    const card: ICard = {
      name: 'Test User',
      city: 'Bangkok',
      postal_code: '10110',
      number: '4242424242424242',
      security_code: '123',
      expiration_month: '12',
      expiration_year: '2025',
    };

    try {
      // Create a token with the card information (you'd typically get this from a form)
      const token = await omise.tokens.create({card});

      if (token) {
        // Send the token to your backend for payment processing
        const response = await fetch('/api/charge', {
          method: 'POST',
          body: JSON.stringify({ tokenId: token.id, amount }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Handle successful payment
          alert('Payment successful');
        } else {
          // Handle error response
          alert('Payment failed');
        }
      }
    } catch (error) {
      alert('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <div>
        <label htmlFor="amount">Amount (in cents):</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      <button onClick={handleCheckout} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default CheckoutPage;
