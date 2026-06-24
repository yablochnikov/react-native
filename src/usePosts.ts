import { useQuery } from '@tanstack/react-query';
import { getPosts } from './api.ts';

export function usePosts({limit = 10}) {
  return useQuery({ queryKey: ['posts', limit], queryFn: () => getPosts({limit: limit}) });
}
