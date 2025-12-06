import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../Context/AppContext";

// Zod validation schemas
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password too long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const AuthForm = () => {
  const { login, register: registerUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [authState, setAuthState] = useState("login"); // 'login' or 'signUp'
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(authState === "signUp" ? signUpSchema : loginSchema),
    mode: "onBlur",
  });

  const handleAuth = async (formData) => {
    setIsLoading(true);
    try {
      let result;

      if (authState === "signUp") {
        result = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      }

      if (result.success) {
        if (authState === "signUp") {
          setAuthState("login");
          reset();
        } else {
          navigate("/");
        }
      } else {
        // Error is already handled by toast in context, but we can set form error if needed
        // For now, the toast is sufficient
        console.error(result.error);
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {authState === "signUp" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-600">
            {authState === "signUp"
              ? "Get started with your account"
              : "Sign in to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit(handleAuth)} className="space-y-4">
          {authState === "signUp" && (
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                {...register("name")}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="John Doe"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="you@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.password ? "border-red-500" : "border-gray-300"
                }`}
              placeholder={authState === "signUp" ? "At least 6 characters" : ""}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {authState === "login" && (
            <div className="flex justify-end">
              <Link
                to="/reset-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : authState === "signUp" ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="text-sm text-center">
          {authState === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setAuthState("signUp")}
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                disabled={isLoading}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setAuthState("login")}
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                disabled={isLoading}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;