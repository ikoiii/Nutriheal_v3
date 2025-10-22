import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Toaster } from "sonner";
import { Label } from "@/components/ui/label";
import { useLoginForm } from "@/hooks/useLoginForm";

export default function Login() {
  const { email, setEmail, password, setPassword, loading, handleSubmit } = useLoginForm();

  return (
    <>
      <Toaster richColors position="top-center" />
      {loading && <LoadingOverlay text="Memverifikasi kredensial, mohon tunggu..." />}
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 relative"
        style={{ backgroundImage: "url(/images/background.png)" }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()} // Menggunakan window.history.back() untuk kembali
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
            <CardDescription>Enter your email below to login to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
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
                  {loading ? "Logging In..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="underline font-semibold">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
