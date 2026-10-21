"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callbackUrl?: string;
}

export function LogoutDialog({
  open,
  onOpenChange,
  callbackUrl = "/login",
}: LogoutDialogProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Notify backend to log activity and clear session tokens
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Failed to log out activity", error);
    }

    // Client-side NextAuth sign out without intermediate confirmation screen
    await signOut({ callbackUrl });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isLoggingOut && onOpenChange(val)}>
      <DialogContent showCloseButton={!isLoggingOut} className="sm:max-w-[420px]">
        <DialogHeader className="gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 dark:text-red-400">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogDescription className="mt-1.5">
              Are you sure you want to log out of DevPulse? You will need to authenticate with your GitHub account again to access your dashboard.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoggingOut}
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoggingOut}
            onClick={handleConfirmLogout}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white dark:bg-red-600 dark:hover:bg-red-700 shadow-sm shadow-red-500/20 cursor-pointer inline-flex items-center gap-2"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing Out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
