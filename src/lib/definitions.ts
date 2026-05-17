export type AthleteRosterEntry = {
  athleteRosterId: string;
  collegeCodeName: string;
  collegeShortName: string;
  collegeLongName: string;
  seasonYear: number;
  academicYear: string;
};

export type College = {
  id: number;
  codeName: string;
  shortName: string;
  longName: string;
  city: string;
  state: string;
  conference: string;
  division: string;
  region: string;
  nickname?: string;
  teamUrl?: string;
};

export type CollegesPage = {
  content: College[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

export type AthleteUpdateRequest = {
  firstName: string;
  lastName: string;
  homeCity: string;
  homeState?: string;
  homeCountry?: string;
  clubName?: string;
};

export type AthleteRosterRequest = {
  collegeId: number;
  athleteId: number;
  seasonYear: number;
  academicYear: string;
};

export type Athlete = {
  athleteId: string;
  firstName: string;
  lastName: string;
  homeCity: string;
  homeState: string;
  homeCountry: string;
  clubName: string;
  creationTimestamp?: string;
  lastUpdateTimestamp?: string;
  rosters: AthleteRosterEntry[];
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
