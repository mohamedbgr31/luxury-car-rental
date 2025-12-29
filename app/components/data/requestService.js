// requestService.js
// Fixed version with proper persistence using localStorage simulation

// Use relative API path for Next.js
const API_URL = '/api';

// Submit new rental request
export const submitRentalRequest = async (requestData) => {
  try {
    // Get token from localStorage
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
      if (token === 'undefined' || token === 'null') {
        token = null;
      }
    }
    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(requestData)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return {
      success: true,
      requestId: result._id,
      message: 'Request submitted successfully!'
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all requests (for admin panel)
export const getAllRequests = async () => {
  try {
    const response = await fetch(`${API_URL}/requests`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const requests = await response.json();
    return requests;
  } catch (error) {
    return [];
  }
};

// Accept a request
export const acceptRequest = async (requestId) => {
  try {
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
    const response = await fetch(`${API_URL}/requests/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status: 'accepted' })
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return { success: true, request: result.request };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Reject a request
export const rejectRequest = async (requestId) => {
  try {
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
    const response = await fetch(`${API_URL}/requests/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status: 'rejected' })
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return { success: true, request: result.request };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get request statistics (client-side calculation)
export const getRequestStats = async () => {
  const requests = await getAllRequests();
  const total = requests.length;
  const pending = requests.filter(req => req.status === 'pending').length;
  const accepted = requests.filter(req => req.status === 'accepted').length;
  const rejected = requests.filter(req => req.status === 'rejected').length;
  const urgent = requests.filter(req => req.urgent && req.status === 'pending').length;
  return { total, pending, accepted, rejected, urgent };
};