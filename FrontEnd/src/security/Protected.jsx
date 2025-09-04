// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import SidebarLayout from "../layouts/SidebarLayout";
// import { getCurrentUser } from "@/api/authAction";

// const Protected = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await getCurrentUser(); // Axios sends cookies automatically
//         setUser(res.data);
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);
//   if (!user) return <Navigate to="/" replace />;

//   return <SidebarLayout />;
// };

// export default Protected;
