import React from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import ThemedCard from "../../components/ui/ThemedCard";
const ParentDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <ThemedCard>
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Parent Dashboard</h1>
       </ThemedCard>
        <div className="mt-8 bg-blue-50 p-6 rounded-xl">
          <p className="text-lg">Welcome, {user.name}! Monitor {user.child.name}'s progress. 🚀</p>
        </div>
      </div>
    </Layout>
  );
};

export default ParentDashboard;