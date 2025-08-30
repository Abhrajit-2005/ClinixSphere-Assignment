import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Profile() {
    const [doctor, setDoctor] = useState({
        speciality: "",
        experienceYears: 0,
        bio: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    // Fetch doctor's profile
    const fetchDoctor = async () => {
        try {
            const res = await api.get("/doctor-dashboard/profile");
            setDoctor(res.data);
        } catch (err) {
            console.error("Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, []);

    const handleChange = (e) => {
        setDoctor({ ...doctor, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put("/doctor-dashboard/profile", doctor);
            alert("Profile updated successfully!");
            setEditOpen(false);
        } catch (err) {
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading profile...</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Doctor Profile</h2>

            {/* Profile Card */}
            <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="space-y-3">
                    <p>
                        <span className="font-semibold">Speciality: </span>
                        {doctor.speciality || "-"}
                    </p>
                    <p>
                        <span className="font-semibold">Experience: </span>
                        {doctor.experienceYears} {doctor.experienceYears === 1 ? "year" : "years"}
                    </p>
                    <p>
                        <span className="font-semibold">Bio: </span>
                        {doctor.bio || "-"}
                    </p>
                </div>

                <button
                    onClick={() => setEditOpen(true)}
                    className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                >
                    Edit Profile
                </button>
            </div>

            {/* Modal / Popup for Editing */}
            {editOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
                        <h3 className="text-2xl font-semibold mb-4">Edit Profile</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-semibold mb-1">Speciality</label>
                                <input
                                    type="text"
                                    name="speciality"
                                    value={doctor.speciality}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Years of Experience</label>
                                <input
                                    type="number"
                                    name="experienceYears"
                                    value={doctor.experienceYears}
                                    onChange={handleChange}
                                    min={0}
                                    className="w-full p-3 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    value={doctor.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full p-3 border rounded"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setEditOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
