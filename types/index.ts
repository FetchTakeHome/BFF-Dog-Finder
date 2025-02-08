export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  zip_code: string;
  img: string;
}

export interface User {
  name: string;
  email: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface SearchParams {
  from: number;
  sort: string;
  ageMin?: number;
  ageMax?: number;
  breeds?: string[];
  zipCodes?: string[];
}

export interface SearchResponse {
  resultIds: string[];
  total: number;
}

export interface MatchResponse {
  match: string;
}