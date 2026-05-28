import { http, HttpResponse } from 'msw';
import { coaches, colleges, staffRoles } from './mock-data';

const API_BASE_URL = process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL || 'http://localhost:3000';

const mockAthlete = {
  athleteId: '1',
  firstName: 'John',
  lastName: 'Doe',
  homeCity: 'New York',
  homeState: 'NY',
  homeCountry: 'USA',
  clubName: 'NYC Gym',
  rosters: [
    {
      athleteRosterId: '901',
      collegeCodeName: 'NYU',
      collegeShortName: 'NYU',
      collegeLongName: 'New York University',
      seasonYear: 2023,
      academicYear: 'FR',
    },
    {
      athleteRosterId: '902',
      collegeCodeName: 'NYU',
      collegeShortName: 'NYU',
      collegeLongName: 'New York University',
      seasonYear: 2024,
      academicYear: 'SO',
    },
  ],
};

export const handlers = [
  http.get(`${API_BASE_URL}/athlete`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '0';
    const size = url.searchParams.get('size') || '10';

    return HttpResponse.json({
      _embedded: {
        content: [
          {
            ...mockAthlete,
            id: '1',
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            homeCity: 'Los Angeles',
            homeState: 'CA',
            homeCountry: 'USA',
            clubName: 'LA Fitness',
            rosters: [
              {
                athleteRosterId: '903',
                collegeCodeName: 'UCLA',
                collegeShortName: 'UCLA',
                collegeLongName: 'University of California, Los Angeles',
                seasonYear: 2024,
                academicYear: 'JR',
              },
            ],
          },
        ],
      },
      _links: {
        self: { href: `/athlete?page=${page}&size=${size}` },
        first: { href: '/athlete?page=0&size=10' },
        last: { href: '/athlete?page=0&size=10' },
      },
      page: {
        size: parseInt(size as string),
        totalElements: 2,
        totalPages: 1,
        number: parseInt(page as string),
      },
    });
  }),

  http.post(`${API_BASE_URL}/athlete`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      { id: 99, ...body, creationTimestamp: '2024-01-01T00:00:00Z' },
      { status: 201 }
    );
  }),

  http.get(`${API_BASE_URL}/athlete/:id`, () => {
    return HttpResponse.json(mockAthlete);
  }),

  http.put(`${API_BASE_URL}/athlete/:id`, () => {
    return HttpResponse.json({ id: '1', ...mockAthlete });
  }),

  http.get(`${API_BASE_URL}/college`, () => {
    return HttpResponse.json({
      content: colleges,
      totalPages: 1,
      totalElements: colleges.length,
      size: 300,
      number: 0,
    });
  }),

  http.post(`${API_BASE_URL}/roster/athlete`, () => {
    return HttpResponse.json(
      {
        id: '999',
        college: colleges[0],
        seasonYear: 2025,
        athlete: { id: '1' },
        academicYear: 'JUNIOR',
      },
      { status: 201 }
    );
  }),

  http.delete(`${API_BASE_URL}/roster/athlete/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${API_BASE_URL}/athlete/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_BASE_URL}/reference/staffrole`, () => {
    return HttpResponse.json(staffRoles);
  }),

  http.post(`${API_BASE_URL}/coach`, () => {
    return HttpResponse.json({ id: 10, firstName: 'New', lastName: 'Coach' }, { status: 201 });
  }),

  http.get(`${API_BASE_URL}/coach/:id`, () => {
    return HttpResponse.json({
      coachId: '1',
      firstName: 'Alex',
      lastName: 'Rivera',
      rosters: [
        {
          coachRosterId: '101',
          collegeCodeName: 'UCLA',
          collegeShortName: 'UCLA',
          collegeLongName: 'University of California, Los Angeles',
          seasonYear: 2023,
          roleCode: 'ASSISTANT_COACH',
        },
        {
          coachRosterId: '102',
          collegeCodeName: 'UCLA',
          collegeShortName: 'UCLA',
          collegeLongName: 'University of California, Los Angeles',
          seasonYear: 2024,
          roleCode: 'HEAD_COACH',
        },
      ],
    });
  }),

  http.put(`${API_BASE_URL}/coach/:id`, () => {
    return HttpResponse.json({ coachId: '1', firstName: 'Alex', lastName: 'Rivera', rosters: [] });
  }),

  http.delete(`${API_BASE_URL}/coach/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_BASE_URL}/roster/coach`, () => {
    return HttpResponse.json(
      {
        id: '999',
        college: colleges[0],
        seasonYear: 2025,
        coach: { id: '1' },
        roleCode: 'HEAD_COACH',
      },
      { status: 200 }
    );
  }),

  http.delete(`${API_BASE_URL}/roster/coach/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_BASE_URL}/coach`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '0';
    const size = url.searchParams.get('size') || '10';

    return HttpResponse.json({
      _embedded: {
        content: coaches,
      },
      _links: {
        self: { href: `/coach?page=${page}&size=${size}` },
        first: { href: '/coach?page=0&size=10' },
        last: { href: '/coach?page=0&size=10' },
      },
      page: {
        size: parseInt(size as string),
        totalElements: coaches.length,
        totalPages: 1,
        number: parseInt(page as string),
      },
    });
  }),
];
