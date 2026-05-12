import MOCK_USERS from "../mockdata/mock_users";

const REGISTERED_USERS_KEY = "registeredUsers";
const LOGGED_IN_USER_KEY = "loggedInUser";

// Normaliza el usuario para que siempre tenga la misma estructura
const mapUserShape = (user) => ({
  uid: String(user.id ?? Date.now()),
  displayName: user.name,
  name: user.name,
  email: user.email,
  cellphone: user.cellphone ?? "",
  address: user.address ?? "",
  emailVerified: true,
});

// Obtiene usuarios registrados en localStorage
const getRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

// Obtiene el usuario actual desde localStorage
const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem(LOGGED_IN_USER_KEY) || "null");

    // VALIDACIÓN REAL
    if (!user || typeof user !== "object") return null;
    if (!user.email || user.email.trim() === "") return null;

    return user;
  } catch {
    return null;
  }
};

// Notifica cambios de sesión
const notifyAuthChange = () => {
  window.dispatchEvent(new Event("template-auth-change"));
};

// Suscripción a cambios de autenticación
export const subscribeToAuthChanges = (callback) => {
  const handler = () => {
    const user = getCurrentUser();

    // Blindaje: si no hay email → no hay sesión
    if (!user || !user.email) {
      callback(null);
    } else {
      callback(user);
    }
  };

  handler(); // Ejecutar inmediatamente
  window.addEventListener("storage", handler);
  window.addEventListener("template-auth-change", handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("template-auth-change", handler);
  };
};

// LOGIN
export const loginUser = async (email, password) => {
  const registeredUsers = getRegisteredUsers();
  const allUsers = [...MOCK_USERS, ...registeredUsers];

  const foundUser = allUsers.find(
    (user) => user.email === email && user.password === password
  );

  if (!foundUser) {
    return { success: false, error: "Correo o contraseña incorrectos" };
  }

  const normalizedUser = mapUserShape(foundUser);
  localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(normalizedUser));
  notifyAuthChange();

  return { success: true, user: normalizedUser };
};

// REGISTRO
export const registerFullUser = async (userData) => {
  const registeredUsers = getRegisteredUsers();
  const allUsers = [...MOCK_USERS, ...registeredUsers];

  const emailExists = allUsers.some(
    (user) => user.email.toLowerCase() === userData.email.toLowerCase()
  );

  if (emailExists) {
    return { success: false, error: "El email ya está registrado." };
  }

  const newUser = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    cellphone: userData.cellphone ?? "",
    address: userData.address ?? "",
    password: userData.password,
  };

  localStorage.setItem(
    REGISTERED_USERS_KEY,
    JSON.stringify([...registeredUsers, newUser])
  );

  return { success: true, user: mapUserShape(newUser) };
};

// LOGOUT — versión blindada
export const logoutUser = async () => {
  localStorage.removeItem(LOGGED_IN_USER_KEY);
  sessionStorage.clear(); // Limpia cualquier rastro temporal
  notifyAuthChange();
  return { success: true };
};
