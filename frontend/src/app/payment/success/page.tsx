export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">পেমেন্ট সফল হয়েছে!</h1>
        <p className="text-gray-600">আপনার অর্ডার নিশ্চিত করা হয়েছে।</p>
      </div>
    </div>
  );
}
