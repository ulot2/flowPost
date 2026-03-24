"use client";

import { useMockApp } from "./MockAppProvider";

export function useWorkspace() {
  const { workspaces, activeWorkspace, activeRole, setActiveWorkspace } =
    useMockApp();

  return {
    workspaces,
    activeWorkspace,
    activeRole,
    setActiveWorkspace,
  };
}
