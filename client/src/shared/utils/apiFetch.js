const API_BASE_URL = "http://127.0.0.1:8000/api";

export const apiFetch = async (endpoint, options = {}) => {
  const { requireAuth = true, ...restOptions } = options;
  const token = localStorage.getItem("auth_token");

  // Если тело запроса - FormData, не устанавливаем Content-Type
  const isFormData = restOptions.body instanceof FormData;
  
  const defaultHeaders = {
    ...(requireAuth && token && { Authorization: `Bearer ${token}` }),
  };

  if (!isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const config = {
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...restOptions.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData?.detail || errorData?.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } catch (parseError) {
        console.warn("Could not parse error response:", parseError);
      }
      
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    let data;
    
    try {
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (parseError) {
      console.warn("Could not parse response:", parseError);
      data = null;
    }

    return data;
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    throw error;
  }
};

