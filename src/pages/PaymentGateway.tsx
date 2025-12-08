import React, { useEffect, useMemo, useRef, useState } from "react";
import { Shield } from "lucide-react";

const DEFAULT_ACCOUNT = {
  name: "trustN solutions pvt ltd",
  accountNumber: "000123456789",
  ifsc: "TRUS0001234",
  upi: "trustn.sol@trustnpay",
  bank: "TrustN Bank",
};

const taxRate = 0.18; // 18% tax for demonstration

const PaymentGateway: React.FC = () => {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const plan = params.get("plan") || "Custom";
  const rawAmount = parseFloat(params.get("amount") || "0") || 0;
  const inviteId = params.get("invite") || null;

  // Plan price mapping
  const planPrices: Record<string, number> = {
    Starter: 2250,
    Professional: 5550,
  };

    const initialPlan = params.get("plan") || "Professional";
    const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan);

    const amount = selectedPlan in planPrices ? planPrices[selectedPlan] : rawAmount;
    const tax = Math.round(amount * taxRate);
    const total = amount + Math.round(amount * taxRate);

  // Payment options: UPI, Credit Card, Debit Card
  const [selected, setSelected] = useState<string>("UPI");
  const [upiId] = useState<string>(DEFAULT_ACCOUNT.upi); // read-only UPI
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");
  // Bank transfer fields
  const [acctNumber, setAcctNumber] = useState<string>("");
  const [acctName, setAcctName] = useState<string>("");
  const [ifsc, setIfsc] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fmt = (n: number) => `₹${n.toLocaleString()}`;

  const verifyAndPay = () => {
    setConfirmOpen(true);
  };

  const doPayment = async () => {
    setProcessing(true);
    try {
      const { auth, firestore } = await import("@/lib/firebase");
      const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");
      const user = auth.currentUser;
      if (!user) {
        alert("No user session found. Please login and try again.");
        window.location.href = "/login";
        return;
      }

      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        paid: true,
        paidAt: serverTimestamp(),
        plan: plan,
        planAmount: amount,
        paymentMethod: selected,
        paymentInfo: {
          account: DEFAULT_ACCOUNT,
          details:
            selected === "UPI"
              ? { upi: upiId }
              : selected === "Credit Card" || selected === "Debit Card"
              ? {
                  cardType: selected,
                  cardName,
                  cardNumber: cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : null,
                }
              : { note: `method:${selected}` },
        },
      });

      if (inviteId) {
        try {
          const { doc: d, updateDoc: upd } = await import("firebase/firestore");
          await upd(d(firestore, "pricing_invites", inviteId), { used: true });
        } catch (e) {
          console.warn("Could not mark invite used", e);
        }
      }

      // Simulate success and redirect
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Payment/Firestore error", err);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      {/* Back button (go to pricing) */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-gray-300">Plan:</span>
        {(["Starter", "Professional"] as string[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setSelectedPlan(p)}
            className={`rounded-full px-3 py-1 text-sm font-semibold border ${selectedPlan === p ? "bg-blue-600 border-blue-500 text-white" : "border-gray-700 text-gray-300"}`}
          >
            {p}
          </button>
        ))}
        <div className="ml-auto text-sm text-gray-400">Selected: <span className="font-semibold text-gray-200">{selectedPlan}</span></div>
      </div>

      <div className="w-full bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="p-6 md:col-span-2 border-r border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold">Powered by trustNpay</div>
                <div className="text-xs text-gray-400">a unit of trustNshare</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-sm text-gray-300">Paying To</h3>
              <div className="font-semibold">{DEFAULT_ACCOUNT.name}</div>
              <div className="text-sm text-gray-400 mt-2">A/c: {DEFAULT_ACCOUNT.accountNumber}</div>
              <div className="text-sm text-gray-400">IFSC: {DEFAULT_ACCOUNT.ifsc}</div>
              <div className="text-sm text-gray-400">UPI: {DEFAULT_ACCOUNT.upi}</div>
            </div>

          </div>

          <div className="p-6 md:col-span-1">
            <div className="mb-6">
              <h4 className="text-sm text-gray-300">Price Summary</h4>
              <div className="mt-2 text-lg font-bold">{fmt(amount)}</div>
              <div className="text-sm text-gray-400">Taxes & fees: {fmt(tax)}</div>
              <div className="mt-2 text-xl font-semibold">Total: {fmt(total)}</div>
              <div className="text-xs text-gray-500 mt-2">Plan: {selectedPlan}</div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Payment Options</h2>
            <div className="relative">
              <button
                aria-label="scroll-left"
                type="button"
                onClick={() => { if (scrollRef.current) scrollRef.current.scrollBy({ left: -240, behavior: 'smooth' }); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 hidden md:inline-flex"
              >
                ‹
              </button>
              <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-none py-2 px-2">
                {[
                  "UPI",
                  "Credit Card",
                  "Debit Card",
                  "Bank Transfer",
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelected(opt)}
                    className={`min-w-[160px] flex-shrink-0 rounded-lg px-4 py-3 text-left border ${selected === opt ? "border-blue-400 bg-gray-700" : "border-gray-700"}`}
                  >
                    <div className="font-semibold">{opt}</div>
                    <div className="text-xs text-gray-400">{opt === "UPI" ? "UPI QR / ID" : opt === "Bank Transfer" ? "A/c transfer" : opt === "Credit Card" || opt === "Debit Card" ? "Visa / Mastercard / Rupay / Amex" : ""}</div>
                  </button>
                ))}
              </div>
              <button
                aria-label="scroll-right"
                type="button"
                onClick={() => { if (scrollRef.current) scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' }); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 hidden md:inline-flex"
              >
                ›
              </button>
            </div>

            <div className="mt-6">
              {selected === "UPI" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-gray-700 bg-gray-900">
                    <div className="text-sm text-gray-300 mb-2">Scan UPI QR</div>
                    <div className="w-full h-40 bg-gray-800 rounded-lg flex items-center justify-center">
                      <img src="/QR.jpg" alt="UPI QR" className="max-h-36 object-contain" />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-700 bg-gray-900">
                    <label className="text-sm text-gray-300">UPI ID</label>
                    <div className="w-full mt-2 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-gray-300">{upiId}</div>
                    <div className="text-xs text-gray-400 mt-2">UPI ID is prefilled. Use your UPI app to pay.</div>
                  </div>
                </div>
              )}

              {(selected === "Credit Card" || selected === "Debit Card") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300">Card Number</label>
                    <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" className="w-full mt-2 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Name on Card</label>
                    <input value={cardName} onChange={(e) => setCardName(e.target.value)} className="w-full mt-2 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Expiry (MM/YY)</label>
                    <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full mt-2 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">CVV</label>
                    <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} className="w-full mt-2 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2" />
                  </div>
                </div>
              )}

              {selected === "Bank Transfer" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300">Account Number</label>
                    <input value={acctNumber} onChange={(e) => setAcctNumber(e.target.value)} placeholder="000123456789" className="w-full mt-2 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Account Holder Name</label>
                    <input value={acctName} onChange={(e) => setAcctName(e.target.value)} placeholder="Full name" className="w-full mt-2 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">IFSC Code</label>
                    <input value={ifsc} onChange={(e) => setIfsc(e.target.value)} placeholder="IFSC1234567" className="w-full mt-2 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Nickname (optional)</label>
                    <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Office account" className="w-full mt-2 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2" />
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-4">
                  <button type="button" onClick={verifyAndPay} className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold">Verify and Pay</button>
                </div>
            </div>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => !processing && setConfirmOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-gray-900 border border-gray-700 p-6">
            <h3 className="text-xl font-bold mb-2">Confirm payment</h3>
            <div className="text-sm text-gray-300 mb-4">You're paying <span className="font-semibold">{fmt(total)}</span> for <span className="font-semibold">{plan}</span> using <span className="font-semibold">{selected}</span>.</div>

            <div className="mb-4 text-sm text-gray-400">
              <div>Paying To: {DEFAULT_ACCOUNT.name}</div>
              <div>A/c: {DEFAULT_ACCOUNT.accountNumber} • IFSC: {DEFAULT_ACCOUNT.ifsc}</div>
              <div>Transaction will be recorded against your account.</div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => setConfirmOpen(false)} disabled={processing} className="px-4 py-2 rounded-full border border-gray-700">Cancel</button>
              <button type="button" onClick={doPayment} disabled={processing} className="px-4 py-2 rounded-full bg-green-600 font-semibold">{processing ? "Processing..." : "Confirm & Pay"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGateway;
