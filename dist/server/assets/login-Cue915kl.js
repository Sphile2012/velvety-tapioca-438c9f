import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Mail, Lock, ArrowRight, User } from "lucide-react";
import { s as serverAuthenticateUser } from "./api-D_6YpApM.js";
import { u as useAuth } from "./router-ZDBUuEh6.js";
import { toast } from "sonner";
import "@tanstack/react-query";
function Login() {
  const navigate = useNavigate();
  const {
    login
  } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const result = await serverAuthenticateUser(formData);
      if (result.success && result.user && result.token) {
        login(result.user, result.token);
        toast.success("Welcome back!", {
          description: "You've been logged in successfully"
        });
        navigate({
          to: "/"
        });
      } else {
        toast.error("Login failed", {
          description: result.error || "Invalid credentials"
        });
      }
    } catch (error) {
      toast.error("Login failed", {
        description: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: void 0
      }));
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-shield shadow-glow mb-4", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-8 h-8 text-primary-foreground" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Welcome back" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Sign in to access your Aegis Health dashboard" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-card", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "text-sm font-medium text-foreground", children: "Email Address" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { id: "email", type: "email", placeholder: "john@example.com", value: formData.email, onChange: (e) => handleChange("email", e.target.value), className: `w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.email ? "border-destructive" : "border-border"}`, disabled: isLoading })
          ] }),
          errors.email && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive flex items-center gap-1", children: errors.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "text-sm font-medium text-foreground", children: "Password" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { id: "password", type: "password", placeholder: "••••••••", value: formData.password, onChange: (e) => handleChange("password", e.target.value), className: `w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.password ? "border-destructive" : "border-border"}`, disabled: isLoading })
          ] }),
          errors.password && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive flex items-center gap-1", children: errors.password })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("button", { type: "button", className: "text-sm text-primary hover:underline", onClick: () => toast.info("Password reset coming soon"), children: "Forgot password?" }) }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: isLoading, className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-shield px-6 py-3 font-medium text-primary-foreground shadow-glow transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? /* @__PURE__ */ jsx(Fragment, { children: "Signing in..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          "Sign in ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative my-6", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-border" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs", children: /* @__PURE__ */ jsx("span", { className: "bg-card/80 px-2 text-muted-foreground", children: "Don't have an account?" }) })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
        to: "/signup"
      }), className: "w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-medium text-foreground transition-all hover:bg-accent", children: [
        /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
        "Create account"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Protected by enterprise-grade security with end-to-end encryption" }) })
  ] }) });
}
export {
  Login as component
};
