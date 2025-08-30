import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/doctor-dashboard/patients")
            .then((res) => {
                setPatients(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Failed to fetch patients");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading patients...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Patients</h2>

            {patients.length === 0 ? (
                <p>No patients found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-xl shadow-md">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((p) => (
                                <tr key={p._id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{p.name}</td>
                                    <td className="p-3">{p.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
