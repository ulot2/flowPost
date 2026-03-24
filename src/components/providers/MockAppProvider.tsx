"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  IdeaPriority,
  MockAppState,
  MockConnectedAccount,
  MockIdea,
  MockMember,
  MockNotification,
  MockPost,
  MockWorkspace,
  Platform,
  PostStatus,
  WorkspaceRole,
  WorkspaceType,
  mockAppSeed,
} from "@/lib/mock-data";

const STORAGE_KEY = "postflow-mock-state-v1";

type WorkspaceInput = {
  name: string;
  description?: string;
  type: WorkspaceType;
  brandLogoUrl?: string;
};

type CreatePostInput = {
  content: string;
  imageUrls?: string[];
  platforms: Platform[];
  scheduledDate?: number;
  status: Extract<PostStatus, "draft" | "scheduled">;
};

type UpdatePostInput = {
  id: string;
  content: string;
  imageUrls?: string[];
  scheduledDate?: number;
  status: Extract<PostStatus, "draft" | "scheduled">;
};

type AppContextValue = {
  user: MockAppState["user"];
  workspaces: MockWorkspace[];
  activeWorkspaceId: string;
  activeWorkspace: MockWorkspace | null;
  activeRole: WorkspaceRole | null;
  posts: MockPost[];
  activePosts: MockPost[];
  ideas: MockIdea[];
  activeIdeas: MockIdea[];
  members: MockMember[];
  activeMembers: MockMember[];
  notifications: MockNotification[];
  unreadNotifications: number;
  connectedAccounts: MockConnectedAccount[];
  activeConnectedAccounts: MockConnectedAccount[];
  setActiveWorkspace: (workspaceId: string) => void;
  addWorkspace: (workspace: WorkspaceInput) => string;
  updateWorkspace: (workspaceId: string, updates: Partial<MockWorkspace>) => void;
  createPosts: (input: CreatePostInput) => void;
  updatePost: (input: UpdatePostInput) => void;
  deletePost: (postId: string) => void;
  getPost: (postId: string) => MockPost | null;
  updatePostSchedule: (postId: string, scheduledDate: number) => void;
  updatePostStatus: (postId: string, status: PostStatus) => void;
  createIdea: (input: {
    content: string;
    tags?: string[];
    priority?: IdeaPriority;
  }) => void;
  updateIdea: (ideaId: string, updates: Partial<MockIdea>) => void;
  deleteIdea: (ideaId: string) => void;
  toggleIdeaPin: (ideaId: string) => void;
  inviteMember: (email: string, role: WorkspaceRole) => void;
  removeMember: (memberId: string) => void;
  updateMemberRole: (memberId: string, role: WorkspaceRole) => void;
  connectAccount: (platform: Platform) => void;
  disconnectAccount: (accountId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  acceptInvite: (notificationId: string) => void;
  declineInvite: (notificationId: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function MockAppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MockAppState>(mockAppSeed);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as MockAppState;
      startTransition(() => setState(parsed));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeWorkspace =
    state.workspaces.find((workspace) => workspace._id === state.activeWorkspaceId) ??
    state.workspaces[0] ??
    null;
  const activeRole = activeWorkspace?.role ?? null;
  const activePosts = state.posts.filter(
    (post) => post.workspaceId === activeWorkspace?._id,
  );
  const activeIdeas = state.ideas.filter(
    (idea) => idea.workspaceId === activeWorkspace?._id,
  );
  const activeMembers = state.members.filter(
    (member) => member.workspaceId === activeWorkspace?._id,
  );
  const activeConnectedAccounts = state.connectedAccounts.filter(
    (account) => account.workspaceId === activeWorkspace?._id,
  );
  const unreadNotifications = state.notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const value: AppContextValue = {
    user: state.user,
    workspaces: state.workspaces,
    activeWorkspaceId: state.activeWorkspaceId,
    activeWorkspace,
    activeRole,
    posts: state.posts,
    activePosts,
    ideas: state.ideas,
    activeIdeas,
    members: state.members,
    activeMembers,
    notifications: state.notifications,
    unreadNotifications,
    connectedAccounts: state.connectedAccounts,
    activeConnectedAccounts,
    setActiveWorkspace: (workspaceId) => {
      setState((current) => ({ ...current, activeWorkspaceId: workspaceId }));
    },
    addWorkspace: (workspace) => {
      const workspaceId = makeId("workspace");
      setState((current) => ({
        ...current,
        activeWorkspaceId: workspaceId,
        workspaces: [
          ...current.workspaces,
          { _id: workspaceId, role: "admin", ...workspace },
        ],
        members: [
          ...current.members,
          {
            _id: makeId("member"),
            workspaceId,
            email: current.user.email,
            firstName: current.user.firstName,
            lastName: current.user.fullName.replace(`${current.user.firstName} `, ""),
            role: "admin",
          },
        ],
      }));
      return workspaceId;
    },
    updateWorkspace: (workspaceId, updates) => {
      setState((current) => ({
        ...current,
        workspaces: current.workspaces.map((workspace) =>
          workspace._id === workspaceId ? { ...workspace, ...updates } : workspace,
        ),
      }));
    },
    createPosts: ({ content, imageUrls, platforms, scheduledDate, status }) => {
      if (!activeWorkspace) return;

      setState((current) => ({
        ...current,
        posts: [
          ...platforms.map((platform) => ({
            _id: makeId("post"),
            _creationTime: Date.now(),
            content,
            imageUrls,
            platform,
            authorId: current.user.id,
            workspaceId: activeWorkspace._id,
            status,
            scheduledDate: status === "scheduled" ? scheduledDate : undefined,
          })),
          ...current.posts,
        ],
      }));
    },
    updatePost: ({ id, ...updates }) => {
      setState((current) => ({
        ...current,
        posts: current.posts.map((post) =>
          post._id === id
            ? {
                ...post,
                ...updates,
                scheduledDate:
                  updates.status === "scheduled" ? updates.scheduledDate : undefined,
              }
            : post,
        ),
      }));
    },
    deletePost: (postId) => {
      setState((current) => ({
        ...current,
        posts: current.posts.filter((post) => post._id !== postId),
      }));
    },
    getPost: (postId) => state.posts.find((post) => post._id === postId) ?? null,
    updatePostSchedule: (postId, scheduledDate) => {
      setState((current) => ({
        ...current,
        posts: current.posts.map((post) =>
          post._id === postId ? { ...post, scheduledDate, status: "scheduled" } : post,
        ),
      }));
    },
    updatePostStatus: (postId, status) => {
      setState((current) => ({
        ...current,
        posts: current.posts.map((post) =>
          post._id === postId ? { ...post, status } : post,
        ),
      }));
    },
    createIdea: ({ content, tags, priority }) => {
      if (!activeWorkspace) return;

      setState((current) => ({
        ...current,
        ideas: [
          {
            _id: makeId("idea"),
            _creationTime: Date.now(),
            workspaceId: activeWorkspace._id,
            content,
            tags,
            priority,
          },
          ...current.ideas,
        ],
      }));
    },
    updateIdea: (ideaId, updates) => {
      setState((current) => ({
        ...current,
        ideas: current.ideas.map((idea) =>
          idea._id === ideaId ? { ...idea, ...updates } : idea,
        ),
      }));
    },
    deleteIdea: (ideaId) => {
      setState((current) => ({
        ...current,
        ideas: current.ideas.filter((idea) => idea._id !== ideaId),
      }));
    },
    toggleIdeaPin: (ideaId) => {
      setState((current) => ({
        ...current,
        ideas: current.ideas.map((idea) =>
          idea._id === ideaId ? { ...idea, pinned: !idea.pinned } : idea,
        ),
      }));
    },
    inviteMember: (email, role) => {
      if (!activeWorkspace) return;

      const [firstName, ...rest] = email.split("@")[0].split(".");
      setState((current) => ({
        ...current,
        members: [
          ...current.members,
          {
            _id: makeId("member"),
            workspaceId: activeWorkspace._id,
            email,
            firstName: firstName ? firstName[0].toUpperCase() + firstName.slice(1) : email,
            lastName: rest.join(" "),
            role,
          },
        ],
        notifications: [
          {
            _id: makeId("notification"),
            createdAt: Date.now(),
            type: "workspace_invite",
            title: `Invite sent to ${email}`,
            body: `${email} was invited to join ${activeWorkspace.name} as ${role}.`,
            isRead: false,
            workspaceId: activeWorkspace._id,
            metadata: {
              status: "accepted",
              role,
              workspaceName: activeWorkspace.name,
            },
          },
          ...current.notifications,
        ],
      }));
    },
    removeMember: (memberId) => {
      setState((current) => ({
        ...current,
        members: current.members.filter((member) => member._id !== memberId),
      }));
    },
    updateMemberRole: (memberId, role) => {
      setState((current) => ({
        ...current,
        members: current.members.map((member) =>
          member._id === memberId ? { ...member, role } : member,
        ),
      }));
    },
    connectAccount: (platform) => {
      if (!activeWorkspace) return;
      setState((current) => ({
        ...current,
        connectedAccounts: [
          {
            _id: makeId("account"),
            workspaceId: activeWorkspace._id,
            platform,
            handle: `${activeWorkspace.name.toLowerCase().replace(/\s+/g, "")}`,
            displayName: activeWorkspace.name,
          },
          ...current.connectedAccounts.filter(
            (account) =>
              !(
                account.workspaceId === activeWorkspace._id &&
                account.platform === platform
              ),
          ),
        ],
      }));
    },
    disconnectAccount: (accountId) => {
      setState((current) => ({
        ...current,
        connectedAccounts: current.connectedAccounts.filter(
          (account) => account._id !== accountId,
        ),
      }));
    },
    markNotificationRead: (notificationId) => {
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      }));
    },
    markAllNotificationsRead: () => {
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      }));
    },
    acceptInvite: (notificationId) => {
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
                metadata: { ...notification.metadata, status: "accepted" },
              }
            : notification,
        ),
      }));
    },
    declineInvite: (notificationId) => {
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
                metadata: { ...notification.metadata, status: "declined" },
              }
            : notification,
        ),
      }));
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useMockApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useMockApp must be used within MockAppProvider");
  }
  return context;
}
