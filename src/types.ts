export interface User {
  id: string;
  name: string;
  token: string;
  email: string;
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  zip_code: string;
  img: string;
  isFavorite: boolean;
}

export interface MatchResponse {
  match: string;
}

export interface SearchFilters {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
  page?: number;
}
