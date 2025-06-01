import { Athlete, PaginatedResponse } from '@/lib/definitions';

async function fetchData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_GYMROSTER_API_BASE_URL}/athlete?page=0&size=25`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch athletes');
  }
  return response.json();
}

export default async function Page() {
  const data: PaginatedResponse<Athlete> = await fetchData();

  return (
    <table className="table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Home City</th>
          <th>Home State</th>
          <th>Home Country</th>
          <th>Club Name</th>
        </tr>
      </thead>
      <tbody>
        {data.content.map((athlete: Athlete) => (
          <tr key={athlete.id}>
            <td>{athlete.firstName}</td>
            <td>{athlete.lastName}</td>
            <td>{athlete.homeCity}</td>
            <td>{athlete.homeState}</td>
            <td>{athlete.homeCountry}</td>
            <td>{athlete.clubName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
