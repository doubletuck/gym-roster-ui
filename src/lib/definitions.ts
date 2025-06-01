export type Athlete = {
  id: string;
  firstName: string;
  lastName: string;
  homeCity: string;
  homeState: string;
  homeCountry: string;
  clubName: string;
};

export type PaginatedResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
  last: boolean;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
};
