import type { ServiceRequest } from "@/backend";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type { ServiceRequest };

export function useSubmitRequest() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      location: string;
      service: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitRequest(
        data.name,
        data.phone,
        data.location,
        data.service,
        "",
      );
    },
  });
}

export function useGetRequests(enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceRequest[]>({
    queryKey: ["requests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRequests();
    },
    enabled: enabled && !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useUpdateStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClaimAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (secret: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.claimAdmin(secret);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}
