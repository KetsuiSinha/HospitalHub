import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, Building2, AlertCircle, Loader2, MapPin } from "lucide-react";
import { authApi } from "@/lib/api";

export function SignupPage() {
  const router = useRouter();
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
    "New Delhi", "Mumbai", "Kolkata", "Chennai", "Bengaluru", "Hyderabad", "Jaipur", "Lucknow", "Bhopal", "Patna", "Ranchi", "Bhubaneswar", "Chandigarh", "Dehradun", "Shimla", "Srinagar", "Jammu", "Gandhinagar", "Raipur", "Dispur", "Imphal", "Aizawl", "Agartala", "Itanagar", "Kohima", "Gangtok", "Shillong", "Panaji", "Thiruvananthapuram"
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

  const handleHospitalChange = (value) => {
    setHospital(value);
    setHospitalError("");

    // Check for admin after a short delay to avoid too many API calls
    setTimeout(() => {
      checkHospitalAdmin(value);
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
      // Small delay to show success message before navigating
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>

      <Card className="w-full max-w-lg shadow-xl border-border/50 bg-background/80 backdrop-blur-sm my-8">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Join Hospibot to manage your healthcare facility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-md bg-green-500/10 text-green-600 text-sm font-medium flex items-center gap-2">
                <span className="w-1 h-4 bg-green-500 rounded-full inline-block"></span>
                {success}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital</Label>
              <Select onValueChange={handleHospitalChange} value={hospital}>
                <SelectTrigger className={hospitalError ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select your hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((hosp) => (
                    <SelectItem key={hosp} value={hosp}>{hosp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hospitalError && (
                <div className="flex items-center text-xs text-destructive font-medium">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {hospitalError}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City (State Capital)</Label>
              <Select onValueChange={setCity} value={city}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {capitals.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full mt-2" type="submit" disabled={loading || !!hospitalError}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-medium ml-1"
            asChild
          >
            <Link href="/login">Sign in</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
