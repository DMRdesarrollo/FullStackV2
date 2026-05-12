import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import smile from "../../../assets/smile.png";
import { loginUser } from "../../../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validación visual
  const isEmailValid = formData.email.includes("@") && formData.email.includes(".");
  const isPasswordValid = formData.password.length >= 6;

  // Fuerza de contraseña
  const passwordStrength = (() => {
    const p = formData.password;
    if (p.length === 0) return "";
    if (p.length < 6) return "Débil";
    if (/[A-Z]/.test(p) && /\d/.test(p) && p.length >= 8) return "Fuerte";
    return "Media";
  })();

  const strengthColor = {
    "": "",
    "Débil": "text-red-500",
    "Media": "text-yellow-500",
    "Fuerte": "text-green-600"
  }[passwordStrength];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await loginUser(formData.email, formData.password);
    if (result.success) {
      navigate('/gallery');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-sm border border-gray-100">

        {/* Header */}
        <div className="flex flex-col items-center mb-12">          
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Bienvenido!</h1>
          <p className="text-slate-400 text-lg">Ingrese sus credenciales para ingresar</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-10" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="relative group">
            <label className="block text-slate-400 text-lg mb-1 group-focus-within:text-blue-500 transition-colors">
              Email
            </label>

            <div className={`relative border-b transition-all ${
              isEmailValid ? "border-green-500" : "border-gray-200 group-focus-within:border-blue-500"
            }`}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 bg-transparent focus:outline-none text-slate-700 pr-10"
                required
              />

              <span className="absolute right-0 top-2 text-slate-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                  1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 
                  1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="relative group">
            <label className="block text-slate-400 text-lg mb-1 group-focus-within:text-blue-500 transition-colors">
              Password
            </label>

            <div className={`relative border-b transition-all ${
              isPasswordValid ? "border-green-500" : "border-gray-200 group-focus-within:border-blue-500"
            }`}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 bg-transparent focus:outline-none text-slate-700 pr-10"
                required
              />

              {/* Ojito */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-2 text-slate-300 cursor-pointer hover:text-blue-500 transition-colors"
              >
                {showPassword ? (
                  // Ojo abierto
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 
                    11-7 11-7-4-7-11-7zm0 12c-2.76 
                    0-5-2.24-5-5s2.24-5 5-5 
                    5 2.24 5 5-2.24 5-5 5z" />
                  </svg>
                ) : (
                  // Ojo cerrado
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.1 3.51 1 4.62l3.1 3.1C2.8 
                    9.39 1.73 11.1 1 12c1.73 4.39 
                    6 7.5 11 7.5 2.1 0 4.04-.55 
                    5.74-1.51l3.14 3.14 1.11-1.11L2.1 
                    3.51zM12 17c-2.76 0-5-2.24-5-5 
                    0-.65.13-1.26.36-1.82l6.46 
                    6.46c-.56.23-1.17.36-1.82.36zm7.64-2.36 
                    1.82 1.82C22.27 14.9 23 13.5 23 
                    12c-1.73-4.39-6-7.5-11-7.5-1.5 
                    0-2.93.27-4.24.76l1.82 1.82A8.1 
                    8.1 0 0 1 12 6.5c2.76 0 5 2.24 
                    5 5 0 1.02-.31 1.97-.84 2.76l1.48 
                    1.48z" />
                  </svg>
                )}
              </span>
            </div>

            {/* Indicador de fuerza */}
            {passwordStrength && (
              <p className={`text-sm mt-1 ${strengthColor}`}>
                Fuerza: {passwordStrength}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-slate-400">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 border-gray-300 rounded focus:ring-blue-500 transition-all"
              />
              <span className="text-lg">remember me?</span>
            </label>

            <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors text-lg">
              forgot password?
            </a>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-3/5 py-4 btn-dna hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center space-x-3 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <span className="text-xl">Login</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 
              0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
