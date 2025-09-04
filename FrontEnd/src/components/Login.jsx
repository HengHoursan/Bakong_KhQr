import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authAction";
import { toast } from "sonner";
import Loader from "./Loader";

const Login = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const LoginUser = async (formData) => {
    try {
      setIsLoading(true);
      const response = await loginUser(formData);
      const userData = response.user;

      if (userData) {
        localStorage.setItem(
          "userData",
          JSON.stringify({ username: userData.username, role: userData.role })
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success("Login successful!", {
        description: "You have been successfully logged in.",
      });
      navigate("/layout");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed.", {
        description: "Please check your email and password and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm bg-white text-black">
        <CardHeader>
          <CardTitle className="text-[20px] text-center">
            Login to your account
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(LoginUser)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="showPassword"
                  checked={showPassword}
                  onCheckedChange={(checked) =>
                    setShowPassword(Boolean(checked))
                  }
                />
                <Label htmlFor="showPassword">Show Password</Label>
              </div>

              <Button
                className="w-full text-white bg-black cursor-pointer"
                variant="default"
                type="submit"
              >
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register now
            </span>
          </div>
        </CardFooter>
      </Card>
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Login;
