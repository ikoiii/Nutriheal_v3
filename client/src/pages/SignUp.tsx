import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoadingOverlay from "@/components/LoadingOverlay"; // Import komponen LoadingOverlay
import { Toaster, toast } from "sonner"; // Import Toaster dan toast
import { Label } from "@/components/ui/label";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Akun berhasil dibuat! Mengalihkan ke halaman upload...");
      navigate("/upload"); // Navigate to upload page on successful signup and login
    } catch (err) {
      toast.error("Gagal membuat akun. Email mungkin sudah terdaftar.");
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      {loading && <LoadingOverlay text="Membuat akun, mohon tunggu..." />}
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 relative"
        style={{ backgroundImage: "url(/images/background.png)" }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 bg-card rounded-full shadow-md"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl">
              <span className="text-green-600">nutri</span>
              <span>heal.</span>
            </CardTitle>
            <CardDescription>Enter your details below to create your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
            <Link to="/login" className="underline font-semibold">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
      </div>
    </>
  );
}