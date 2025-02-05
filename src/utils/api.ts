import axios from "axios";
import { Dog, MatchResponse, SearchFilters } from "../types";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle 401 errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Login API
export const loginUser = async (name: string, email: string): Promise<void> => {
  try {
    await api.post("/auth/login", { name, email });
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Login failed");
  }
};

// Logout API
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Logout failed");
  }
};

// Fetch dog breeds
export const fetchBreeds = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>("/dogs/breeds");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch breeds:", error);
    throw new Error("Failed to fetch breeds");
  }
};

// Fetch dogs by search filters (returns both result IDs & next page URL)
export const fetchDogs = async (filters: SearchFilters): Promise<{ resultIds: string[]; next: string, prev:string }> => {
  try {
    const response = await api.get<{ resultIds: string[]; next: string; prev: string }>("/dogs/search", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dog IDs:", error);
    throw new Error("Failed to fetch dog IDs");
  }
};

// Fetch previous page of dogs
export const fetchPrevDogs = async (prevUrl: string, filters: SearchFilters): Promise<{ resultIds: string[]; next: string; prev:string }> => {
  try {
    const response = await api.get<{ resultIds: string[]; next: string; prev: string }>(prevUrl.replace(API_BASE_URL, ""), { params: filters });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch previous page of dogs:", error);
    throw new Error("Failed to fetch previous page of dogs");
  }
};

// Fetch next page of dogs
export const fetchNextDogs = async (nextUrl: string, filters: SearchFilters): Promise<{ resultIds: string[]; next: string; prev: string }> => {
  try {
    const response = await api.get<{ resultIds: string[]; next: string; prev: string }>(nextUrl.replace(API_BASE_URL, ""), { params: filters });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch next page of dogs:", error);
    throw new Error("Failed to fetch next page of dogs");
  }
};

// Fetch dog details for multiple dogs by IDs
export const fetchDogsDetailsByIds = async (dogIds: string[]): Promise<Dog[]> => {
  try {
    const response = await api.post<Dog[]>("/dogs", dogIds);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dog details:", error);
    throw new Error("Failed to fetch dog details");
  }
};

// Fetch match based on user's favorite dogs
export const fetchMatch = async (favorites: string[]): Promise<MatchResponse> => {
  try {
    const response = await api.post<MatchResponse>("/dogs/match", favorites);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch match:", error);
    throw new Error("Failed to fetch match");
  }
};
