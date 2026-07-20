import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { sendOtp, confirmOtp } = useAuthContext();
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendOtp(phone);
      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await confirmOtp(otp);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">APIA Login</h1>

        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <label className="text-sm block">Mobile number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91XXXXXXXXXX"
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
            {error && <p className="text-xs text-alertRed">{error}</p>}
            <button disabled={loading} type="submit" className="bg-navy text-white w-full rounded py-2 text-sm">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <label className="text-sm block">Enter OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
            {error && <p className="text-xs text-alertRed">{error}</p>}
            <button disabled={loading} type="submit" className="bg-navy text-white w-full rounded py-2 text-sm">
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}

        {/* Required by Firebase invisible reCAPTCHA for phone auth */}
        <div id="recaptcha-container" />
      </div>
    </div>
  );
}
