"use client";
import { useAuth } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';

/** Caller supplies a stable loader. Auth changes discard the previous user's data. */
export function useResource<T>(loader: () => Promise<T>) {
  const { isLoaded, userId } = useAuth();
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{owner: string | null | undefined; data: T | null; error: string | null; loading: boolean}>({owner:null,data:null,error:null,loading:true});
  useEffect(() => {
    let active = true;
    if (!isLoaded || !userId) return;
    setState({owner:userId,data:null,error:null,loading:true});
    loader().then(data => { if (active) setState({owner:userId,data,error:null,loading:false}); })
      .catch(error => { if (active) setState({owner:userId,data:null,error:error instanceof Error ? error.message : 'Unable to load data.',loading:false}); });
    return () => { active = false; };
  }, [isLoaded,userId,loader,revision]);
  const reload = useCallback(() => setRevision(value => value + 1), []);
  if (!isLoaded) return {data:null,error:null,loading:true,reload};
  if (!userId) return {data:null,error:'Sign in to view your data.',loading:false,reload};
  if (state.owner !== userId) return {data:null,error:null,loading:true,reload};
  return {...state,reload};
}
