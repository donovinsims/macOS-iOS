"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/settings", // Redirect to settings or dashboard after login
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      toast.success("Signed in successfully");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 w-full">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your credentials to sign in to your account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            autoComplete="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
        </span>
        <Link
          href="/register"
          className="font-medium text-zinc-900 dark:text-white hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}