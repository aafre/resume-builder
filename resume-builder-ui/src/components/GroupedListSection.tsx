import React, { useState, useEffect, useCallback } from "react";
import { SectionHeader } from "./SectionHeader";
import { GhostButton } from "./shared/GhostButton";
import { MdDelete, MdAdd } from "react-icons/md";
import { GroupedListItem } from "../types";

interface GroupedListSectionProps {
  sectionName: string;
  groups: GroupedListItem[];
  onUpdate: (updatedContent: GroupedListItem[]) => void;
  onTitleEdit: () => void;
  onTitleSave: () => void;
  onTitleCancel: () => void;
  onDelete: () => void;
  isEditing: boolean;
  temporaryTitle: string;
  setTemporaryTitle: (title: string) => void;
}

const GroupedListSection: React.FC<GroupedListSectionProps> = ({
  sectionName,
  groups,
  onUpdate,
  onTitleEdit,
  onTitleSave,
  onTitleCancel,
  onDelete,
  isEditing,
  temporaryTitle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isCollapsed) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCollapsed]);

  const handleLabelChange = useCallback(
    (groupIndex: number, newLabel: string) => {
      const updated = [...groups];
      updated[groupIndex] = { ...updated[groupIndex], label: newLabel };
      onUpdate(updated);
    },
    [groups, onUpdate]
  );

  const handleItemsChange = useCallback(
    (groupIndex: number, newItems: string) => {
      const updated = [...groups];
      updated[groupIndex] = {
        ...updated[groupIndex],
        items: newItems.split(",").map((s) => s.trim()).filter(Boolean),
      };
      onUpdate(updated);
    },
    [groups, onUpdate]
  );

  const handleAddGroup = useCallback(() => {
    onUpdate([...groups, { label: "", items: [""] }]);
  }, [groups, onUpdate]);

  const handleDeleteGroup = useCallback(
    (groupIndex: number) => {
      const updated = groups.filter((_, i) => i !== groupIndex);
      onUpdate(updated);
    },
    [groups, onUpdate]
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader
        title={sectionName}
        isEditing={isEditing}
        temporaryTitle={temporaryTitle}
        onTitleEdit={onTitleEdit}
        onTitleSave={onTitleSave}
        onTitleCancel={onTitleCancel}
        onDelete={onDelete}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {groups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="flex gap-2 items-start group"
            >
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={group.label}
                  onChange={(e) =>
                    handleLabelChange(groupIndex, e.target.value)
                  }
                  placeholder="Category name (e.g., Programming Languages)"
                  className="w-full text-sm font-semibold px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
                <input
                  type="text"
                  value={group.items.join(", ")}
                  onChange={(e) =>
                    handleItemsChange(groupIndex, e.target.value)
                  }
                  placeholder="Items separated by commas (e.g., Python, Java, Go)"
                  className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <button
                onClick={() => handleDeleteGroup(groupIndex)}
                className="mt-1.5 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove group"
              >
                <MdDelete size={16} />
              </button>
            </div>
          ))}

          <GhostButton onClick={handleAddGroup} icon={<MdAdd />}>
            Add Category
          </GhostButton>
        </div>
      )}
    </div>
  );
};

export default GroupedListSection;
