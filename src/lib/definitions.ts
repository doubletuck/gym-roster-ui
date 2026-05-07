export type AthleteRoster = {
  collegeCodeName: string;
  collegeShortName: string;
  collegeLongName: string;
  seasonYear: number;
  academicYear: string;
};

export type Athlete = {
  id: string;
  firstName: string;
  lastName: string;
  homeCity: string;
  homeState: string;
  homeCountry: string;
  clubName: string;
  creationTimestamp?: string;
  lastUpdateTimestamp?: string;
  rosters: AthleteRoster[];
};

export type PaginatedResponse<T> = {
  _embedded?: {
    content: T[];
  };
  _links: {
    self: Link;
    first: Link;
    last: Link;
    next?: Link;
    prev?: Link;
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
};

export type Link = {
  href: string;
};
