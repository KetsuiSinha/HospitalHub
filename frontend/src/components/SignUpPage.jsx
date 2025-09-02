import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Building2, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";

export function SignupPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hospital, setHospital] = useState("");
  const [city, setCity] = useState("");
  const [hospitalError, setHospitalError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hospitals = [
    "City General Hospital",
    "Memorial Medical Center", 
    "St. Mary's Hospital",
    "Regional Health Center",
    "Community Medical Center",
    "University Hospital"
  ];

  const capitals = [
    "New Delhi","Mumbai","Kolkata","Chennai","Bengaluru","Hyderabad","Jaipur","Lucknow","Bhopal","Patna","Ranchi","Bhubaneswar","Chandigarh","Dehradun","Shimla","Srinagar","Jammu","Gandhinagar","Raipur","Dispur","Imphal","Aizawl","Agartala","Itanagar","Kohima","Gangtok","Shillong","Panaji","Thiruvananthapuram"
  ];

  const checkHospitalAdmin = async (selectedHospital) => {
    if (!selectedHospital) {
      setHospitalError("");
      return;
    }
    
    try {
      const result = await authApi.checkHospitalAdmin(selectedHospital);
      if (result.hasAdmin) {
        setHospitalError(`An admin already exists for ${selectedHospital}. Please choose a different hospital.`);
      } else {
        setHospitalError("");
      }
    } catch (err) {
      console.error("Error checking hospital admin:", err);
      setHospitalError("");
    }
  };

  const handleHospitalChange = (selectedHospital) => {
    setHospital(selectedHospital);
    setHospitalError("");
    
    // Check for admin after a short delay to avoid too many API calls
    setTimeout(() => {
      checkHospitalAdmin(selectedHospital);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!hospital) {
      setError("Please select a hospital");
      return;
    }
    if (!city) {
      setError("Please select city (state capital)");
      return;
    }
    if (hospitalError) {
      setError("Please select a different hospital");
      return;
    }
    try {
      setLoading(true);
      await authApi.signup({ name: email.split('@')[0], email, password, role: 'admin', hospital, city });
      setSuccess("Account created. Please sign in.");
      onNavigate("login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <div
        className="p-8 rounded-2xl shadow-lg border w-full max-w-md"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            Create Account
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Join Hospibot to manage your healthcare facility
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm" style={{ color: "var(--destructive)" }}>{error}</div>
          )}
          {success && (
            <div className="text-sm" style={{ color: "var(--success)" }}>{success}</div>
          )}
          {[
            { id: "email", type: "email", label: "Email", placeholder: "Enter your email", icon: Mail },
            { id: "password", type: "password", label: "Password", placeholder: "Create a password", icon: Lock },
            { id: "confirmPassword", type: "password", label: "Confirm Password", placeholder: "Confirm your password", icon: Lock },
          ].map(({ id, type, label, placeholder, icon: Icon }) => (
            <div key={id}>
              <Label htmlFor={id} style={{ color: "var(--foreground)" }}>{label}</Label>
              <div className="relative mt-1">
                <Icon
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <Input
                  id={id}
                  type={type}
                  value={
                    id === "email" ? email : id === "password" ? password : confirmPassword
                  }
                  onChange={(e) =>
                    id === "email"
                      ? setEmail(e.target.value)
                      : id === "password"
                        ? setPassword(e.target.value)
                        : setConfirmPassword(e.target.value)
                  }
                  className="pl-10"
                  placeholder={placeholder}
                  required
                  style={{
                    backgroundColor: "var(--input)",
                    color: "var(--foreground)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>
          ))}

          {/* Hospital Selection */}
          <div>
            <Label htmlFor="hospital" style={{ color: "var(--foreground)" }}>Hospital</Label>
            <div className="relative mt-1">
              <Building2
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--muted-foreground)" }}
              />
              <select
                id="hospital"
                value={hospital}
                onChange={(e) => handleHospitalChange(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ring ${
                  hospitalError ? "border-red-500" : ""
                }`}
                required
                style={{
                  backgroundColor: "var(--input)",
                  color: "var(--foreground)",
                  borderColor: hospitalError ? "var(--destructive)" : "var(--border)",
                }}
              >
                <option value="">Select your hospital</option>
                {hospitals.map((hosp) => (
                  <option key={hosp} value={hosp}>{hosp}</option>
                ))}
              </select>
            </div>
            {hospitalError && (
              <div className="flex items-center mt-2 text-sm" style={{ color: "var(--destructive)" }}>
                <AlertCircle className="w-4 h-4 mr-1" />
                {hospitalError}
              </div>
            )}
          </div>

          {/* City Selection (State Capitals) */}
          <div>
            <Label htmlFor="city" style={{ color: "var(--foreground)" }}>City (State Capital)</Label>
            <div className="relative mt-1">
              <Building2
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--muted-foreground)" }}
              />
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ring"
                required
                style={{
                  backgroundColor: "var(--input)",
                  color: "var(--foreground)",
                  borderColor: "var(--border)",
                }}
              >
                <option value="">Select city</option>
                {capitals.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            disabled={loading || !!hospitalError}
          >
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
          Already have an account?{" "}
          <button
            onClick={() => onNavigate("login")}
            style={{ color: "var(--primary)", fontWeight: 500, textDecoration: "underline" }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
