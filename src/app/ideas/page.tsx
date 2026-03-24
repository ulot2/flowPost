"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { IdeaInput } from "@/components/ideas/IdeaInput";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { IdeaFilters } from "@/components/ideas/IdeaFilters";
import { toast } from "sonner";
import { Lightbulb } from "lucide-react";
import { useState, useMemo } from "react";
import { useMockApp } from "@/components/providers/MockAppProvider";

type Priority = "hot" | "maybe" | "someday" | undefined;
type SortOrder = "newest" | "oldest";

export default function IdeasPage() {
  const {
    activeRole,
    activeIdeas,
    createIdea,
    deleteIdea,
    updateIdea,
    toggleIdeaPin,
  } = useMockApp();
  const canEdit = activeRole === "admin" || activeRole === "editor";

  // Filter/sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activePriority, setActivePriority] = useState<
    "hot" | "maybe" | "someday" | null
  >(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // Compute all unique tags across ideas
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    activeIdeas.forEach((idea) => {
      idea.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [activeIdeas]);

  // Filter & sort ideas
  const filteredIdeas = useMemo(() => {
    let result = [...activeIdeas];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.content.toLowerCase().includes(q) ||
          idea.tags?.some((tag) => tag.includes(q)),
      );
    }

    // Tag filter
    if (activeTag) {
      result = result.filter((idea) => idea.tags?.includes(activeTag));
    }

    // Priority filter
    if (activePriority) {
      result = result.filter((idea) => idea.priority === activePriority);
    }

    // Sort: pinned first, then by time
    const pinned = result.filter((i) => i.pinned);
    const unpinned = result.filter((i) => !i.pinned);

    const sortFn = (
      a: { _creationTime: number },
      b: { _creationTime: number },
    ) =>
      sortOrder === "newest"
        ? b._creationTime - a._creationTime
        : a._creationTime - b._creationTime;

    pinned.sort(sortFn);
    unpinned.sort(sortFn);

    return [...pinned, ...unpinned];
  }, [activeIdeas, searchQuery, activeTag, activePriority, sortOrder]);

  const handleCreate = async (
    content: string,
    tags: string[],
    priority?: Priority,
  ) => {
    createIdea({
      content,
      tags: tags.length > 0 ? tags : undefined,
      priority,
    });
    toast.success("Idea saved!");
  };

  const handleDelete = async (id: string) => {
    deleteIdea(id);
    toast.success("Idea deleted");
  };

  const handleUpdate = async (id: string, content: string) => {
    updateIdea(id, { content });
    toast.success("Idea updated");
  };

  const handleTogglePin = async (id: string) => {
    toggleIdeaPin(id);
  };

  const handleUpdatePriority = async (id: string, priority: Priority) => {
    updateIdea(id, { priority });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f7f4ef] flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white border border-[#e0dbd3] p-4 rounded-xl shrink-0">
          <div>
            <h1 className="text-[28px] sm:text-3xl font-extrabold tracking-tight text-[#0f0f0f] mb-1 font-syne">
              Ideas
            </h1>
            <p className="text-[12px] sm:text-sm text-[#6b6b6b]">
              Capture fleeting thoughts. Turn them into posts later.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#b0a99e]">
            <Lightbulb className="w-5 h-5" />
            <span className="text-sm font-semibold tabular-nums">
              {activeIdeas.length} {activeIdeas.length === 1 ? "idea" : "ideas"}
            </span>
          </div>
        </header>

        {/* Quick Input — only for editors/admins */}
        {canEdit && (
          <div className="mb-6">
            <IdeaInput onSubmit={handleCreate} />
          </div>
        )}

        {/* Filters */}
        {activeIdeas.length > 0 && (
          <div className="mb-6">
            <IdeaFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              allTags={allTags}
              activeTag={activeTag}
              onTagFilter={setActiveTag}
              activePriority={activePriority}
              onPriorityFilter={setActivePriority}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
          </div>
        )}

        {/* Ideas List */}
        {filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea._id}
                id={idea._id}
                content={idea.content}
                createdAt={idea._creationTime}
                tags={idea.tags}
                pinned={idea.pinned}
                priority={idea.priority}
                onDelete={canEdit ? handleDelete : undefined}
                onUpdate={canEdit ? handleUpdate : undefined}
                onTogglePin={canEdit ? handleTogglePin : undefined}
                onUpdatePriority={canEdit ? handleUpdatePriority : undefined}
              />
            ))}
          </div>
        ) : activeIdeas.length > 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <p className="text-[#6b6b6b] text-sm">
              No ideas match your filters.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#f0fdce] border border-[#d4f24a]/30 flex items-center justify-center mb-5">
              <Lightbulb className="w-8 h-8 text-[#7a8a2a]" />
            </div>
            <h3 className="text-lg font-bold text-[#0f0f0f] mb-2 font-syne">
              No ideas yet
            </h3>
            <p className="text-[#6b6b6b] text-sm max-w-sm">
              Use the input above to jot down a quick thought. You can turn it
              into a full post later.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
