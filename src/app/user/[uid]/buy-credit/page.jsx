"use client";
import { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, addDoc,doc,getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { db, auth } from "../../../firebaseConfig";
// import {doc} 

export default function BuyCreditPage() {
  const { uid } = useParams();
  const router = useRouter();
  const [classFee, setClassFee] = useState(); // Default class fee
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [proof, setProof] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount || !paymentMethod || !proof) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "creditRequests"), {
        targetUserId: uid,
        amount,
        classFee,
        paymentMethod,
        proof,
        message,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      alert("Credit request sent to admin.");
      router.push(`/user/${uid}`);
    } catch (error) {
      console.error("Error submitting credit request:", error);
      alert("Failed to submit request.");
    }
  }

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  useEffect(() => {
    // Fetch class fee from user document if needed
    const fetchClassFee = async () => {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setClassFee(userData.classFee || "00"); // Default to 600 if not set
      }
    };
    fetchClassFee();
  }, []);




  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-30"></div>

      <div className="relative z-10 opacity-90">
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
          <button
            onClick={handleLogout}
            className="absolute top-5 right-5 bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>

          <h1 className="text-4xl font-bold mb-6">Buy Class</h1>
          <span>Your class fee is <b className="font-bold text-2xl">{classFee}</b> INR per class</span>

          <div className="flex flex-col md:flex-row gap-8 bg-gray-800 p-6 rounded-lg w-full max-w-4xl">
            {/* ===== Left Side: Form ===== */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full md:w-1/2"
            >
              <input  
                type="number"
                placeholder="Number of classes you want to pay for"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="p-2 rounded border text-white"
              />
              {/* <span>`total payable amount for {amount} classes is <b className="font-bold text-2xl">{amount*classFee}</b> INR `</span> */}

              <span>
                Total payable amount for {amount} {amount == 1 ? 'class' : 'classes'} is 
                <b className="ml-2 font-bold text-2xl text-white-900">
                  ₹{(amount * classFee).toLocaleString('en-IN')}
                </b>
              </span>



              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="p-2 rounded border text-white hover:cursor-pointer"
              >
                <option value="">Select Payment Method</option>
                <option value="UPI" >UPI (for payments from India only)</option>
                <option value="Bank transfer">Bank Transfer</option>
              </select>

              {/* Amount of money */}
              {/* <input
                type="number"
                placeholder="Total amount paid (in INR)"
                // value={amount * 500}
                // readOnly
                className="p-2 rounded border text-white bg-gray-700"
              /> */}


              <input
                type="number"
                placeholder="Paste your transaction number"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                className="p-2 rounded border text-white"
              />

              <textarea
                placeholder="Additional message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-2 rounded border text-white"
              ></textarea>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 hover:cursor-pointer px-4 py-2 rounded font-bold w-full"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/user/${uid}`)}
                  className="bg-red-500 hover:bg-red-600 hover:cursor-pointer px-4 py-2 rounded font-bold w-full"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* ===== Right Side: Dynamic Content ===== */}
            <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-gray-700 p-4 rounded-lg">
              {paymentMethod === "UPI" && (
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    Scan QR to Pay via Upay
                  </h2>
                  <Image
                    src="/qr_code.jpeg"
                    alt="Upay QR Code"
                    width={250}
                    height={250}
                    className="mx-auto rounded-lg"
                  />
                </div>
              )}

              {paymentMethod === "" && (
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    Please select a payment method to proceed.
                  </h2>
                </div>
              )}

              {paymentMethod === "Bank transfer" && (
                <div className="text-left space-y-2">
                  <h2 className="text-xl font-semibold mb-3 text-center">
                    Bank Transfer Details
                  </h2>
                  <p>
                    <span className="font-bold">Account Name:</span> Anirban
                    Bhattacharjee
                  </p>
                  <p>
                    <span className="font-bold">Bank Name:</span> SBI (State
                    Bank of India)
                  </p>
                  <p>
                    <span className="font-bold">Account Type:</span> Savings
                    Account
                  </p>
                  <p>
                    <span className="font-bold">Account Number:</span>{" "}
                    32907754939
                  </p>
                  <p>
                    <span className="font-bold">Branch:</span> PBB Marine Drive
                  </p>
                  <p>
                    <span className="font-bold">IFSC Code:</span> SBIN0019255
                  </p>

                  <div className="mt-4">
                    <h3 className="font-semibold">Address:</h3>
                    <p>
                      Apartment no. 137 TF, <br />
                      TDI Lake Grove, Water Site, <br />
                      Sector 64 Patla, Kundli, Sonipat, <br />
                      Haryana 131023.
                    </p>
                  </div>

                  <p className="text-sm text-gray-300 mt-3">
                    Please include your name and number of classes in the payment reference.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
