// AuthModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal";
import { useState } from "react";
import { auth } from "@/lib/firebase/firebaseConfig";
import {
  AuthError,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

// Define Zod schema for login form validation
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

interface FieldRenderProps {
  field: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<HTMLInputElement>;
  };
}

const AuthModal: React.FC = () => {
  const { toast } = useToast();
  const { isOpen, onOpen, onClose } = useModal();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Initialize React Hook Form
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { y: -20, opacity: 0 }
  };

  const saveTokenToLocalStorage = async (user: any) => {
    try {
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const onSubmit = async (values: SignInFormValues) => {
    setLoading(true);
      toast({
      title: "Signing in...",
      description: "Please wait while we sign you in...",
    });

    try {
      const { email, password } = values;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await saveTokenToLocalStorage(userCredential.user);
      
      // Reset form
      signInForm.reset();
      onClose();
    } catch (error) {

      const authError = error as AuthError;
      let errorMessage = "An error occurred. Please try again";

      switch (authError.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email format";
          signInForm.setError("email", { message: errorMessage });
          break;
        case "auth/user-not-found":
          errorMessage = "Account not found";
          signInForm.setError("email", { message: errorMessage });
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          signInForm.setError("password", { message: errorMessage });
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid credentials. Please check your email and password";
          signInForm.setError("root", { message: errorMessage });
          break;
        default:
          signInForm.setError("root", { message: errorMessage });
      }

      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          // Reset form when modal is closed
          signInForm.reset();
          return;
        }
        onOpen("authModal", { isOpen: open });
      }}
    >
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl border-0 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col"
        >
          <DialogHeader className="px-6 pt-5 pb-2 flex justify-between items-center bg-gradient-to-r from-teal-500 to-teal-600 text-white shrink-0">
            <DialogTitle className="text-2xl font-bold">
              Welcome back
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {signInForm.formState.errors.root && (
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-2 rounded-lg border border-red-200"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p>{signInForm.formState.errors.root?.message}</p>
                </motion.div>
              )}

              <Form {...signInForm}>
                <form id="signInForm" onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-3">
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }: FieldRenderProps) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-700 font-medium">Email address</FormLabel>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                              <Mail className="h-4 w-4" />
                            </div>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="billie.e@chordify.net"
                                className={cn(
                                  "w-full h-10 pl-9 rounded-lg",
                                  field.value && !signInForm.formState.errors.email
                                    ? "border-green-500 focus-visible:ring-green-500"
                                    : ""
                                )}
                                {...field}
                                disabled={loading}
                              />
                            </FormControl>
                            {field.value && !signInForm.formState.errors.email && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </div>
                            )}
                          </div>
                          <FormMessage className="text-xs flex items-center gap-1">
                            {signInForm.formState.errors.email && (
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            )}
                            {signInForm.formState.errors.email?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }: FieldRenderProps) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                              <Lock className="h-4 w-4" />
                            </div>
                            <FormControl>
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
                                className={cn(
                                  "w-full h-10 pl-9 pr-16 rounded-lg",
                                  field.value && !signInForm.formState.errors.password
                                    ? "border-green-500 focus-visible:ring-green-500"
                                    : ""
                                )}
                                {...field}
                                disabled={loading}
                              />
                            </FormControl>
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 mr-1" />
                              ) : (
                                <Eye className="h-4 w-4 mr-1" />
                              )}
                              {showPassword ? "Hide" : "Show"}
                            </button>
                          </div>
                          <FormMessage className="text-xs flex items-center gap-1">
                            {signInForm.formState.errors.password && (
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            )}
                            {signInForm.formState.errors.password?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          </div>

          <DialogFooter className="bg-gray-50 px-6 py-3 flex justify-end gap-2 mt-auto shrink-0 border-t border-gray-200">
            <Button
              type="submit"
              form="signInForm"
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 transition-colors h-10 rounded-lg"
              disabled={loading || !signInForm.formState.isValid}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Log in"
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;