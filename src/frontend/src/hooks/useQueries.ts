import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

// ─── Perfumes ────────────────────────────────────────────────────────────────

export function useGetAllPerfumes() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["perfumes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPerfumes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPerfumeById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["perfume", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getPerfumeById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export function useGetCart() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      perfumeId,
      quantity,
    }: {
      perfumeId: bigint;
      quantity: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addToCart(perfumeId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (perfumeId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeFromCart(perfumeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.placeOrder();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
