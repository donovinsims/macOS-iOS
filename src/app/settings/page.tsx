import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { User, Mail, Shield, Smartphone, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Settings - AppDirectory",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Settings
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Manage your account preferences and profile.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Profile Information
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Display Name
                  </label>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
                    {user.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <Mail className="h-4 w-4 text-zinc-400" />
                    {user.email}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 pt-2">
                <Shield className="h-4 w-4" />
                <span>Your account is secured with email authentication.</span>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                <Sun className="h-6 w-6 text-purple-600 dark:text-purple-400 hidden dark:block" />
                <Moon className="h-6 w-6 text-purple-600 dark:text-purple-400 block dark:hidden" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Appearance
              </h2>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-zinc-900 dark:text-white">Theme</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Toggle between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Device Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Session
              </h2>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Current Session</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Active now
                  </p>
                </div>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
