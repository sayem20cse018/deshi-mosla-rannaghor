export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-red-700 mb-2">পেমেন্ট ব্যর্থ হয়েছে</h1>
        <p className="text-gray-600">আবার চেষ্টা করুন অথবা অন্য পেমেন্ট পদ্ধতি ব্যবহার করুন।</p>
      </div>
    </div>
  );
}
