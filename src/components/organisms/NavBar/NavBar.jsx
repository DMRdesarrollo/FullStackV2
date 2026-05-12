import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { subscribeToAuthChanges, logoutUser } from '../../../services/authService';
import useCartStore from '../../../store/cartStore';

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      if (!currentUser || !currentUser.email) {
        setLoggedInUser(null);
      } else {
        setLoggedInUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isActive = (path) => location.pathname === path;

  // Ocultar menú en login y register
  const hideMenuOnRoutes = ["/login", "/register"];
  const shouldHideMenu = hideMenuOnRoutes.includes(location.pathname);

  // Mientras carga la sesión, no mostrar nada
  if (loading) return null;

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold hover:opacity-80 transition-opacity"
          >
            <span className="bg-gradient-to-r from-[#002147] via-[#00306B] to-[#0047A3] bg-clip-text text-transparent">
              DG - Digital Store
            </span>
          </Link>

          {/* Navigation Links */}
          {!shouldHideMenu && (
            <ul className="hidden md:flex items-center space-x-8">

              {/* Si está logueado → mostrar menú privado */}
              {loggedInUser ? (
                <>
                  <li>
                    <Link
                      to="/gallery"
                      className={`text-base font-medium transition-all duration-300 pb-2 border-b-2 ${
                        isActive('/gallery')
                          ? 'text-blue-600 border-blue-600'
                          : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      Galería
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/cart"
                      className={`text-base font-medium transition-all duration-300 pb-2 border-b-2 ${
                        isActive('/cart')
                          ? 'text-blue-600 border-blue-600'
                          : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      Carrito ({totalItems})
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/profile"
                      className={`text-base font-medium transition-all duration-300 pb-2 border-b-2 ${
                        isActive('/profile')
                          ? 'text-blue-600 border-blue-600'
                          : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      Perfil
                    </Link>
                  </li>

                  {/* Botón de logout */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 font-medium hover:text-red-800 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                /* Si NO está logueado → mostrar Login y Register */
                <>
                  <li>
                    <Link
                      to="/login"
                      className={`text-base font-medium transition-all duration-300 pb-2 border-b-2 ${
                        isActive('/login')
                          ? 'text-blue-600 border-blue-600'
                          : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      Login
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/register"
                      className={`text-base font-medium transition-all duration-300 pb-2 border-b-2 ${
                        isActive('/register')
                          ? 'text-blue-600 border-blue-600'
                          : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}

          {/* Mobile Menu Button (opcional) */}
          <button className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>
      </div>
    </nav>
  );
}
