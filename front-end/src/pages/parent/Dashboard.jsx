import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import ThemedCard from "../../components/ui/ThemedCard";
import { CreditCard, Users, AlertCircle, ArrowRight } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    loadParentDashboard();
  }, []);

  useEffect(() => {
    if (selectedYear && children.length > 0) {
      loadSummaries(children, selectedYear);
    }
  }, [selectedYear]);

  const loadParentDashboard = async () => {
    setLoading(true);
    try {
      const [childrenResponse, yearsResponse] = await Promise.all([
        api.get("/parent/children"),
        api.get("/payments/academic-years"),
      ]);

      const loadedChildren = childrenResponse.data.data || [];
      const years = yearsResponse.data.data || [];

      setChildren(loadedChildren);
      setAcademicYears(years);

      const initialYear = years[0] || "";
      setSelectedYear(initialYear);

      if (loadedChildren.length > 0 && initialYear) {
        await loadSummaries(loadedChildren, initialYear);
      } else {
        setSummaries([]);
      }
    } catch (error) {
      console.error("Error loading parent dashboard:", error);
      toast.error("Failed to load parent dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadSummaries = async (childrenList, academicYear) => {
    try {
      const summaryResponses = await Promise.all(
        childrenList.map((child) =>
          api.get(`/payments/student/${child._id}`, {
            params: { academicYear },
          })
        )
      );

      const summaryData = summaryResponses.map((response, index) => ({
        child: childrenList[index],
        summary: response.data.data?.summary || {
          totalDue: 0,
          totalPaid: 0,
          balance: 0,
          totalLateFee: 0,
          isSuspended: false,
        },
      }));

      setSummaries(summaryData);
    } catch (error) {
      console.error("Error loading child summaries:", error);
      toast.error("Failed to load child payment summaries");
    }
  };

  const totalBalance = summaries.reduce((sum, item) => sum + (item.summary?.balance || 0), 0);
  const suspendedCount = summaries.filter((item) => item.summary?.isSuspended).length;

  return (
    <Layout>
      <div className="space-y-6">
        <ThemedCard>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="section-title text-3xl font-bold">Parent Dashboard</h1>
              <p className="text-muted mt-2 text-sm">
                View only your children's payment information and account status.
              </p>
            </div>
            <div className="w-full md:w-64">
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </ThemedCard>

        <div className="grid gap-6 md:grid-cols-3">
          <ThemedCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Registered Children</p>
                <p className="mt-2 text-3xl font-bold">{children.length}</p>
              </div>
              <div className="rounded-2xl p-3" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                <Users size={24} />
              </div>
            </div>
          </ThemedCard>

          <ThemedCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Outstanding Balance</p>
                <p className="mt-2 text-3xl font-bold">{totalBalance.toLocaleString()} ETB</p>
              </div>
              <div className="rounded-2xl p-3" style={{ background: "rgba(217,119,6,0.12)", color: "var(--warning)" }}>
                <CreditCard size={24} />
              </div>
            </div>
          </ThemedCard>

          <ThemedCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted text-sm">Suspended Accounts</p>
                <p className="mt-2 text-3xl font-bold">{suspendedCount}</p>
              </div>
              <div className="rounded-2xl p-3" style={{ background: "rgba(220,38,38,0.12)", color: "var(--danger)" }}>
                <AlertCircle size={24} />
              </div>
            </div>
          </ThemedCard>
        </div>

        <ThemedCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Children Overview</h2>
              <p className="text-muted mt-1 text-sm">Quick payment status for each child linked to your account.</p>
            </div>
            <button
              onClick={() => navigate("/parent/payments")}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))", color: "#fff" }}
            >
              Open Payments
              <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="py-10 text-center text-muted">Loading parent information...</div>
          ) : summaries.length === 0 ? (
            <div className="py-10 text-center text-muted">No linked children found for this parent account.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {summaries.map(({ child, summary }) => (
                <div
                  key={child._id}
                  className="rounded-[1.35rem] p-5"
                  style={{ background: "var(--bg-soft)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{child.fullName}</h3>
                      <p className="text-muted text-sm">
                        Grade {child.grade} {child.section ? `• Section ${child.section}` : ""}
                      </p>
                    </div>
                    {summary?.isSuspended && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ background: "rgba(220,38,38,0.12)", color: "var(--danger)" }}
                      >
                        Suspended
                      </span>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted">Total Paid</p>
                      <p className="mt-1 font-semibold">{(summary?.totalPaid || 0).toLocaleString()} ETB</p>
                    </div>
                    <div>
                      <p className="text-muted">Balance</p>
                      <p className="mt-1 font-semibold">{(summary?.balance || 0).toLocaleString()} ETB</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ThemedCard>
      </div>
    </Layout>
  );
};

export default ParentDashboard;
