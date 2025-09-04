import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "../api/authAction";

const Home = () => {
  const [user, setUser] = useState({ username: "Guest", role: "Unknown" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser({
          username: res.username,
          role: res.role,
        });
        console.log(res);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser({ username: "Guest", role: "" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading user info...</p>;

  const roleColor =
    {
      Admin: "bg-red-500 text-white",
      Editor: "bg-yellow-500 text-white",
      Viewer: "bg-blue-500 text-white",
    }[user.role] || "bg-gray-300 text-black";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🔧 MERN Stack Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your role-based management system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>👤 User Information</CardTitle>
          <CardDescription>
            Details pulled from your authentication session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            <span className="font-semibold">Username:</span> {user.username}
          </p>
          <p>
            <span className="font-semibold">Role:</span>{" "}
            <Badge className={roleColor}>{user.role || "Not assigned"}</Badge>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🛡️ Role Permissions</CardTitle>
          <CardDescription>Access based on your assigned role.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-5 text-sm space-y-1">
            {user.role === "Admin" ? (
              <>
                <li>Manage users</li>
                <li>View & update products</li>
                <li>Access full dashboard</li>
              </>
            ) : user.role === "Editor" ? (
              <>
                <li>View and update products</li>
                <li>Limited dashboard access</li>
              </>
            ) : user.role === "Viewer" ? (
              <>
                <li>Read-only access to products</li>
              </>
            ) : (
              <li>No permissions available</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
