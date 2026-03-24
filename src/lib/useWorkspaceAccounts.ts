"use client";

import { useMockApp } from "@/components/providers/MockAppProvider";

export function useWorkspaceAccounts(workspaceId?: string) {
  const { connectedAccounts } = useMockApp();

  return {
    accounts: workspaceId
      ? connectedAccounts.filter((account) => account.workspaceId === workspaceId)
      : [],
    isLoading: false,
  };
}
