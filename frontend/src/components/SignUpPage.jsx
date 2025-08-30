import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { authApi } from "@/lib/api";

export function SignupPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await authApi.signup({ name: email.split('@')[0], email, password, role: 'staff' });
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

          <Button
            type="submit"
            className="w-full"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            disabled={loading}
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
