import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const signupMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Rookies!",
        description: "Your account has been created with a $100 balance.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({ 
      email, 
      password, 
      firstName: firstName || undefined,
      lastName: lastName || undefined
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-800 p-4">
      <Card className="w-full max-w-md bg-slate-900/90 border-emerald-500/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Join Rookies
          </CardTitle>
          <CardDescription className="text-slate-300">
            Create your account and get $100 to start betting with friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min 6 characters)"
                required
                minLength={6}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-slate-300">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}