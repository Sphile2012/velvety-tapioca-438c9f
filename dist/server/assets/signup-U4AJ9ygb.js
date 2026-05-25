import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, User, Mail, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { b as serverSignupUser } from "./api-D_6YpApM.js";
import { u as useAuth } from "./router-ZDBUuEh6.js";
import { toast } from "sonner";
import "@tanstack/react-query";
function Signup() {
  const navigate = useNavigate();
  const {
    login
  } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
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
      const result = await serverSignupUser(formData);
      if (result.success && result.user && result.token) {
        login(result.user, result.token);
        toast.success("Account created successfully!", {
          description: "Welcome to Aegis Health"
        });
        navigate({
          to: "/"
        });
      } else {
        toast.error("Signup failed", {
          description: result.error || "An error occurred"
        });
      }
    } catch (error) {
      toast.error("Signup failed", {
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
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Create your account" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Join Aegis Health and start your wellness journey" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-card", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "text-sm font-medium text-foreground", children: "Full Name" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { id: "name", type: "text", placeholder: "John Doe", value: formData.name, onChange: (e) => handleChange("name", e.target.value), className: `w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.name ? "border-destructive" : "border-border"}`, disabled: isLoading })
          ] }),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive flex items-center gap-1", children: errors.name })
        ] }),
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
          errors.password && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive flex items-center gap-1", children: errors.password }),
          formData.password && !errors.password && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-primary", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }),
            "Password meets requirements"
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: isLoading, className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-shield px-6 py-3 font-medium text-primary-foreground shadow-glow transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? /* @__PURE__ */ jsx(Fragment, { children: "Creating account..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          "Create account ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative my-6", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-border" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs", children: /* @__PURE__ */ jsx("span", { className: "bg-card/80 px-2 text-muted-foreground", children: "Already have an account?" }) })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => navigate({
        to: "/login"
      }), className: "w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-medium text-foreground transition-all hover:bg-accent", children: "Sign in instead" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center", children: ["AI-powered insights", "Secure data storage", "Reward system"].map((benefit) => /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: benefit }, benefit)) })
  ] }) });
}
export {
  Signup as component
};
