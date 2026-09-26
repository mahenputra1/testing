const BASE_URL = "http://localhost:8000/api";

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    let response;
    try {
        response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (networkError) {
        throw {
            response: {
                status: 0,
                data: { message: "Gagal terhubung ke server backend. Pastikan server Laravel aktif." },
            },
        };
    }

    // Tangani 401 Unauthorized (selain endpoint login/register)
    const isAuthRequest = endpoint.includes("/login") || endpoint.includes("/register");
    if (response.status === 401 && !isAuthRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
    }

    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    }

    if (!response.ok) {
        const errorObj = {
            response: {
                status: response.status,
                data: data || { message: response.statusText },
            },
        };
        throw errorObj;
    }

    return { data, status: response.status };
}

const Api = {
    get: (endpoint, options = {}) => request(endpoint, { ...options, method: "GET" }),
    post: (endpoint, body, options = {}) =>
        request(endpoint, {
            ...options,
            method: "POST",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }),
    put: (endpoint, body, options = {}) =>
        request(endpoint, {
            ...options,
            method: "PUT",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }),
    delete: (endpoint, options = {}) => request(endpoint, { ...options, method: "DELETE" }),
};

export default Api;
