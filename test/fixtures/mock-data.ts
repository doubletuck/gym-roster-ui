export const staffRoles = [
  { codeName: 'HEAD_COACH', longName: 'Head Coach' },
  { codeName: 'ASSISTANT_COACH', longName: 'Assistant Coach' },
];

export const coaches = [
  {
    coachId: '1',
    firstName: 'Alex',
    lastName: 'Rivera',
    rosters: [
      {
        coachRosterId: '101',
        collegeCodeName: 'UCLA',
        collegeShortName: 'UCLA',
        collegeLongName: 'University of California, Los Angeles',
        seasonYear: 2024,
        roleCode: 'HEAD_COACH',
      },
    ],
  },
  {
    coachId: '2',
    firstName: 'Sam',
    lastName: 'Johnson',
    rosters: [
      {
        coachRosterId: '102',
        collegeCodeName: 'NYU',
        collegeShortName: 'NYU',
        collegeLongName: 'New York University',
        seasonYear: 2024,
        roleCode: 'ASSISTANT_COACH',
      },
    ],
  },
];

export const athletes = [
  {
    id: 'a987c5ad-106c-4817-ba70-67699fc607f1',
    firstName: 'Mati',
    lastName: 'Waligora',
    homeCity: 'Rochester',
    homeState: 'MI',
    homeCountry: 'USA',
    clubName: 'Alabama',
  },
  {
    id: '991f938a-f915-4f12-9a49-2f5580ae49b5',
    firstName: 'Sadie',
    lastName: 'Smith',
    homeCity: 'Gig Harbor',
    homeState: 'WA',
    homeCountry: 'USA',
    clubName: 'Ascend Gymnastics',
  },
  {
    id: '8cca2c17-eaf4-4c84-afa4-35091439724d',
    firstName: 'Grace',
    lastName: 'Drexler',
    homeCity: 'Stratford',
    homeState: 'WI',
    homeCountry: 'USA',
    clubName: 'Twin City Twisters',
  },
  {
    id: '6c7e20a0-be45-4aca-bec9-b8cb87133831',
    firstName: "Ja'Leigh",
    lastName: 'Lang',
    homeCity: 'East Palo Alto',
    homeState: 'CA',
    homeCountry: 'USA',
    clubName: 'San Mateo Gymnastics',
  },
];

export const colleges = [
  {
    id: 1,
    codeName: 'UCLA',
    shortName: 'UCLA',
    longName: 'University of California, Los Angeles',
    city: 'Los Angeles',
    state: 'CA',
    conference: 'BIG_TEN',
    division: 'DIV1',
    region: 'W',
    nickname: 'Bruins',
  },
  {
    id: 2,
    codeName: 'NYU',
    shortName: 'NYU',
    longName: 'New York University',
    city: 'New York',
    state: 'NY',
    conference: 'EAGL',
    division: 'DIV1',
    region: 'NE',
    nickname: 'Violets',
  },
];
