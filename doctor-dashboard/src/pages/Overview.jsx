import { useEffect, useState } from "react";
import api from "../utils/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Overview() {
    const [stats, setStats] = useState({
        totalAppointments: 0,
        statusCounts: {},
        upcoming: 0,
        todayAppointmentsCount: 0,
        uniquePatients: 0,
        appointmentsNext7Days: {},
    });

    useEffect(() => {
        api.get("/doctor-dashboard/overview")
            .then((res) => setStats(res.data))
            .catch((err) => console.error(err));
    }, []);

    // Prepare data for chart
    const chartData = Object.entries(stats.appointmentsNext7Days || {}).map(([date, count]) => ({
        date,
        count,
    }));

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                <div className="p-4 bg-blue-100 rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">Total Appointments</h3>
                    <p className="text-3xl font-bold">{stats.totalAppointments}</p>
                </div>
                <div className="p-4 bg-green-100 rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">Upcoming</h3>
                    <p className="text-3xl font-bold">{stats.upcoming}</p>
                </div>
                <div className="p-4 bg-purple-100 rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">Completed</h3>
                    <p className="text-3xl font-bold">{stats.statusCounts.completed || 0}</p>
                </div>
                <div className="p-4 bg-red-100 rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">Cancelled</h3>
                    <p className="text-3xl font-bold">{stats.statusCounts.cancelled || 0}</p>
                </div>
                <div className="p-4 bg-yellow-100 rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">Today's Appointments</h3>
                    <p className="text-3xl font-bold">{stats.todayAppointmentsCount}</p>
                </div>
                <div className="p-4 bg-teal-100 rounded-xl shadow-md text-center">
                    <h3 className="text-lg font-semibold">Unique Patients</h3>
                    <p className="text-3xl font-bold">{stats.uniquePatients}</p>
                </div>
            </div>

            {/* Next 7 Days Chart */}
            <div className="p-6 bg-white rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Appointments in Next 7 Days</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
