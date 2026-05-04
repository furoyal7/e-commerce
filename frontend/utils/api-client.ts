type ApiRequestOptions = RequestInit & {
  params?: Record<string, string>;
};

class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  private constructor() {}

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { params, ...init } = options;
    
    let url = `${this.baseUrl}${endpoint}`;
    
    // Debug helper to see where the frontend is pointing
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      console.log(`[ApiClient] Connecting to: ${url}`);
    }

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...init.headers,
    });

    const response = await fetch(url, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Automatic Refresh Token Rotation placeholder
      if (response.status === 401 && typeof window !== 'undefined') {
        console.warn('Unauthorized. Session expired or invalid.');
        // logic for refresh token goes here
      }

      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  public get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  public patch<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  }

  public delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = ApiClient.getInstance();
