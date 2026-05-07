import { http, HttpResponse } from 'msw';

const API_BASE_URL = process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL || 'http://localhost:3000';

export const handlers = [
  http.get(`${API_BASE_URL}/athlete`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '0';
    const size = url.searchParams.get('size') || '10';

    return HttpResponse.json({
      _embedded: {
        content: [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            homeCity: 'New York',
            homeState: 'NY',
            homeCountry: 'USA',
            clubName: 'NYC Gym',
            rosters: [
              {
                collegeCodeName: 'NYU',
                collegeShortName: 'NYU',
                collegeLongName: 'New York University',
                seasonYear: 2023,
                academicYear: 'FR',
              },
              {
                collegeCodeName: 'NYU',
                collegeShortName: 'NYU',
                collegeLongName: 'New York University',
                seasonYear: 2024,
                academicYear: 'SO',
              },
            ],
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

  http.get(`${API_BASE_URL}/athlete/:id`, () => {
    return HttpResponse.json({
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      homeCity: 'New York',
      homeState: 'NY',
      homeCountry: 'USA',
      clubName: 'NYC Gym',
      rosters: [
        {
          collegeCodeName: 'NYU',
          collegeShortName: 'NYU',
          collegeLongName: 'New York University',
          seasonYear: 2023,
          academicYear: 'FR',
        },
        {
          collegeCodeName: 'NYU',
          collegeShortName: 'NYU',
          collegeLongName: 'New York University',
          seasonYear: 2024,
          academicYear: 'SO',
        },
      ],
    });
  }),
];
