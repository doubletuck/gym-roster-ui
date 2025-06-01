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
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            First Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Home City
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Home State
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Home Country
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Club Name
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.content.map((athlete: Athlete) => (
          <tr key={athlete.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {athlete.firstName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {athlete.lastName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {athlete.homeCity}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {athlete.homeState}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {athlete.homeCountry}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {athlete.clubName}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
