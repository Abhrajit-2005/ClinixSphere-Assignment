import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [appointments, setAppointments] = useState([]); // store doctor's appointments
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        appointmentId: "",
        symptoms: "",
        diagnosis: "",
        medicines: [{ name: "", dosage: "", frequency: "" }],
        notes: ""
    });

    const handleMedicineChange = (index, field, value) => {
        const newMeds = [...form.medicines];
        newMeds[index][field] = value;
        setForm({ ...form, medicines: newMeds });
    };

    const addMedicine = () => {
        setForm({
            ...form,
            medicines: [...form.medicines, { name: "", dosage: "", frequency: "" }],
        });
    };

    const removeMedicine = (index) => {
        const newMeds = form.medicines.filter((_, i) => i !== index);
        setForm({ ...form, medicines: newMeds });
    };

    // Fetch prescriptions
    const fetchPrescriptions = async () => {
        try {
            const res = await api.get("/prescriptions/mine");
            setPrescriptions(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch prescriptions");
        }
    };

    // Fetch doctor's appointments (to populate dropdown)
    const fetchAppointments = async () => {
        try {
            const res = await api.get("/appointments/mine");
            setAppointments(res.data);
        } catch (err) {
            console.error("Failed to fetch appointments");
        }
    };

    useEffect(() => {
        Promise.all([fetchPrescriptions(), fetchAppointments()]).finally(() =>
            setLoading(false)
        );
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/prescriptions", form);
            setForm({ appointmentId: "", symptoms: "", diagnosis: "", medications: "" });
            fetchPrescriptions();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create prescription");
        }
    };

    const downloadPdf = async (id) => {
        try {
            const res = await api.get(`/prescriptions/${id}/pdf`, {
                responseType: "blob" // important!
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `prescription-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Failed to download PDF");
        }
    };


    if (loading) return <p>Loading prescriptions...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Prescriptions</h2>

            {/* Form to create new prescription */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md space-y-4"
            >
                <h3 className="text-xl font-semibold mb-2">New Prescription</h3>

                {/* Dropdown for appointment */}
                <select
                    name="appointmentId"
                    value={form.appointmentId}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    required
                >
                    <option value="">Select Appointment</option>
                    {appointments.map((appt) => (
                        <option key={appt._id} value={appt._id}>
                            {appt.patient?.name} - {new Date(appt.time).toLocaleString()}
                        </option>
                    ))}
                </select>

                <textarea
                    name="symptoms"
                    placeholder="Symptoms"
                    value={form.symptoms}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    required
                />
                <textarea
                    name="diagnosis"
                    placeholder="Diagnosis"
                    value={form.diagnosis}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    required
                />
                {/* Medicines Section */}
                <div className="space-y-3">
                    <h4 className="font-semibold">Medicines</h4>
                    {form.medicines.map((med, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Name"
                                value={med.name}
                                onChange={(e) => handleMedicineChange(idx, "name", e.target.value)}
                                className="w-1/3 p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Dosage"
                                value={med.dosage}
                                onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)}
                                className="w-1/3 p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Frequency"
                                value={med.frequency}
                                onChange={(e) => handleMedicineChange(idx, "frequency", e.target.value)}
                                className="w-1/3 p-2 border rounded"
                                required
                            />
                            {form.medicines.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeMedicine(idx)}
                                    className="text-red-500 font-bold"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMedicine}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                        + Add Medicine
                    </button>
                </div>
                <textarea
                    name="notes"
                    placeholder="Additional Notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                />

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Save Prescription
                </button>
            </form>

            {/* Prescription list */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-xl shadow-md">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-3">Patient</th>
                            <th className="p-3">Appointment Time</th>
                            <th className="p-3">Symptoms</th>
                            <th className="p-3">Diagnosis</th>
                            <th className="p-3">Medicines</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map((p) => (
                            <tr key={p._id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{p.patient?.name}</td>
                                <td className="p-3">{new Date(p.appointment.time).toLocaleString()}</td>
                                <td className="p-3">{p.symptoms}</td>
                                <td className="p-3">{p.diagnosis}</td>
                                <td className="p-3">
                                    <ul className="list-disc list-inside">
                                        {p.medicines?.map((m, i) => (
                                            <li key={i}>
                                                {m.name} — {m.dosage} ({m.frequency})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => downloadPdf(p._id)}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                                    >
                                        Download PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
