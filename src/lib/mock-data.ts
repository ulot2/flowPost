"use client";

export type WorkspaceRole = "admin" | "editor" | "viewer";
export type WorkspaceType = "personal" | "team" | "company";
export type Platform = "twitter" | "linkedin" | "instagram" | "pinterest";
export type PostStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "failed"
  | "publishing";
export type IdeaPriority = "hot" | "maybe" | "someday" | undefined;
export type NotificationType =
  | "post_published"
  | "post_failed"
  | "workspace_invite"
  | "role_update";

export interface MockUser {
  id: string;
  fullName: string;
  firstName: string;
  email: string;
  imageUrl: string;
  createdAt: number;
}

export interface MockWorkspace {
  _id: string;
  name: string;
  description?: string;
  type: WorkspaceType;
  brandLogoUrl?: string;
  role: WorkspaceRole;
}

export interface MockPost {
  _id: string;
  _creationTime: number;
  scheduledDate?: number;
  imageUrls?: string[];
  content: string;
  platform: Platform;
  authorId: string;
  workspaceId: string;
  status: PostStatus;
}

export interface MockIdea {
  _id: string;
  _creationTime: number;
  workspaceId: string;
  content: string;
  tags?: string[];
  pinned?: boolean;
  priority?: IdeaPriority;
}

export interface MockMember {
  _id: string;
  workspaceId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: WorkspaceRole;
}

export interface MockConnectedAccount {
  _id: string;
  workspaceId: string;
  platform: Platform;
  handle: string;
  displayName: string;
  avatarUrl?: string;
}

export interface MockNotification {
  _id: string;
  createdAt: number;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  workspaceId?: string;
  metadata?: {
    status?: "pending" | "accepted" | "declined";
    role?: WorkspaceRole;
    workspaceName?: string;
  };
}

export interface MockAppState {
  user: MockUser;
  workspaces: MockWorkspace[];
  activeWorkspaceId: string;
  posts: MockPost[];
  ideas: MockIdea[];
  members: MockMember[];
  connectedAccounts: MockConnectedAccount[];
  notifications: MockNotification[];
}

const now = Date.now();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

export const mockAppSeed: MockAppState = {
  user: {
    id: "user-1",
    fullName: "Jordan Lee",
    firstName: "Jordan",
    email: "jordan@postflow.app",
    imageUrl: "",
    createdAt: now - 240 * day,
  },
  workspaces: [
    {
      _id: "ws-postflow",
      name: "PostFlow Studio",
      description: "Editorial planning for product launches and growth content.",
      type: "company",
      role: "admin",
    },
    {
      _id: "ws-personal",
      name: "Jordan Personal",
      description: "Thought leadership experiments and weekly writing.",
      type: "personal",
      role: "editor",
    },
  ],
  activeWorkspaceId: "ws-postflow",
  posts: [
    {
      _id: "post-1",
      _creationTime: now - 10 * day,
      scheduledDate: now + 2 * day + 3 * hour,
      imageUrls: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"],
      content:
        "Shipping a cleaner publishing workflow this week. Faster approvals, sharper previews, fewer bottlenecks.",
      platform: "linkedin",
      authorId: "user-1",
      workspaceId: "ws-postflow",
      status: "scheduled",
    },
    {
      _id: "post-2",
      _creationTime: now - 8 * day,
      scheduledDate: now + day + 6 * hour,
      content:
        "Three small UX changes that made our content calendar feel dramatically lighter.",
      platform: "twitter",
      authorId: "user-1",
      workspaceId: "ws-postflow",
      status: "scheduled",
    },
    {
      _id: "post-3",
      _creationTime: now - 6 * day,
      scheduledDate: now - 2 * day,
      content:
        "New product teaser frames are ready. Carousel copy just needs final polish.",
      platform: "instagram",
      authorId: "user-1",
      workspaceId: "ws-postflow",
      status: "published",
    },
    {
      _id: "post-4",
      _creationTime: now - 3 * day,
      content:
        "Drafting a behind-the-scenes thread on how we batch content production across channels.",
      platform: "twitter",
      authorId: "user-1",
      workspaceId: "ws-postflow",
      status: "draft",
    },
    {
      _id: "post-5",
      _creationTime: now - 9 * day,
      scheduledDate: now + 4 * day,
      content:
        "Moodboard pin set for spring launch visuals. Minimal typography, warmer neutrals, stronger product framing.",
      platform: "pinterest",
      authorId: "user-1",
      workspaceId: "ws-postflow",
      status: "scheduled",
    },
    {
      _id: "post-6",
      _creationTime: now - 5 * day,
      scheduledDate: now + 5 * hour,
      content:
        "Personal note on staying consistent with writing even when the pipeline feels messy.",
      platform: "linkedin",
      authorId: "user-1",
      workspaceId: "ws-personal",
      status: "scheduled",
    },
  ],
  ideas: [
    {
      _id: "idea-1",
      _creationTime: now - 5 * day,
      workspaceId: "ws-postflow",
      content: "Turn our analytics dashboard redesign into a launch diary series.",
      tags: ["launch", "design"],
      pinned: true,
      priority: "hot",
    },
    {
      _id: "idea-2",
      _creationTime: now - 3 * day,
      workspaceId: "ws-postflow",
      content: "Short-form tips on writing captions from feature benefits, not feature lists.",
      tags: ["copywriting", "education"],
      priority: "maybe",
    },
    {
      _id: "idea-3",
      _creationTime: now - day,
      workspaceId: "ws-postflow",
      content: "Founder POV post about choosing constraints before choosing channels.",
      tags: ["founder", "strategy"],
      priority: "someday",
    },
    {
      _id: "idea-4",
      _creationTime: now - 2 * day,
      workspaceId: "ws-personal",
      content: "Personal writing sprint recap with screenshots of the weekly system.",
      tags: ["writing"],
      pinned: true,
      priority: "hot",
    },
  ],
  members: [
    {
      _id: "member-1",
      workspaceId: "ws-postflow",
      email: "jordan@postflow.app",
      firstName: "Jordan",
      lastName: "Lee",
      role: "admin",
    },
    {
      _id: "member-2",
      workspaceId: "ws-postflow",
      email: "maya@postflow.app",
      firstName: "Maya",
      lastName: "Cole",
      role: "editor",
    },
    {
      _id: "member-3",
      workspaceId: "ws-postflow",
      email: "sam@postflow.app",
      firstName: "Sam",
      lastName: "Owens",
      role: "viewer",
    },
    {
      _id: "member-4",
      workspaceId: "ws-personal",
      email: "jordan@postflow.app",
      firstName: "Jordan",
      lastName: "Lee",
      role: "editor",
    },
  ],
  connectedAccounts: [
    {
      _id: "account-1",
      workspaceId: "ws-postflow",
      platform: "linkedin",
      handle: "postflowhq",
      displayName: "PostFlow HQ",
    },
    {
      _id: "account-2",
      workspaceId: "ws-postflow",
      platform: "twitter",
      handle: "postflowapp",
      displayName: "PostFlow",
    },
  ],
  notifications: [
    {
      _id: "notification-1",
      createdAt: now - 4 * hour,
      type: "post_published",
      title: "Instagram post published",
      body: "Your teaser post is now live on Instagram.",
      isRead: false,
      workspaceId: "ws-postflow",
    },
    {
      _id: "notification-2",
      createdAt: now - 26 * hour,
      type: "workspace_invite",
      title: "Invite to Northstar Labs",
      body: "You were invited to join Northstar Labs as an editor.",
      isRead: false,
      metadata: {
        status: "pending",
        role: "editor",
        workspaceName: "Northstar Labs",
      },
    },
    {
      _id: "notification-3",
      createdAt: now - 2 * day,
      type: "role_update",
      title: "Role updated",
      body: "Your role in PostFlow Studio is now admin.",
      isRead: true,
      workspaceId: "ws-postflow",
    },
  ],
};
