import Register from "./Register";
import Login from "./Login";

function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-gray-800 text-center">
                Welcome to ClinixSphere
            </h1>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full max-w-6xl max-h-110">
                {/* Register Card */}
                <section className="flex-1 bg-white p-8 rounded-2xl shadow-lg transform transition-transform hover:-translate-y-2 hover:shadow-2xl">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
                        New User? Register
                    </h2>
                    <Register />
                </section>

                {/* Login Card */}
                <section className="flex-1 bg-white p-5 rounded-2xl shadow-lg transform transition-transform hover:-translate-y-2 hover:shadow-2xl">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
                        Already Registered? Login
                    </h2>
                    <Login />
                </section>
            </div>

            <p className="mt-12 text-gray-600 text-center text-sm">
                © 2025 ClinixSphere. All rights reserved.
            </p>
        </div>
    );
}

export default Home;
