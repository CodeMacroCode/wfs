import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../constants/query-keys';
import { UsersResponseSchema, type User } from '../../types/api';

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  
  // Production-grade: Validate response data
  const result = UsersResponseSchema.safeParse(data);
  if (!result.success) {
    console.error('Validation error:', result.error);
    throw new Error('Invalid data format from API');
  }
  
  return result.data;
}

export function useGetUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.users.list(),
    queryFn: fetchUsers,
  });
}
