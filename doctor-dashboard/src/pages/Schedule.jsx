import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Schedule() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch appointments
    const fetchAppointments = async () => {
        try {
            const res = await api.get("/appointments/mine");
            console.log(res.data);

            setAppointments(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Update status function
    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            fetchAppointments(); // refresh list after update
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    if (loading) return <p>Loading appointments...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Schedule</h2>

            {appointments.length === 0 ? (
                <p>No appointments scheduled.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-xl shadow-md">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-3">Patient</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Time</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appt) => (
                                <tr key={appt._id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{appt.patient?.name || "Unknown"}</td>
                                    <td className="p-3">{appt.patient?.email || "N/A"}</td>
                                    <td className="p-3">
                                        {new Date(appt.time).toLocaleString()}
                                    </td>
                                    <td className="p-3 capitalize">{appt.status}</td>
                                    <td className="p-3 flex gap-2">
                                        {appt.status === "booked" && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(appt._id, "completed")}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                                >
                                                    Complete
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(appt._id, "cancelled")}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
