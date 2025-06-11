
import React from 'react';
import { QuickSnoozeOption } from '../types';

interface QuickSnoozeMenuProps {
  isOpen: boolean;
  onClose: () => void; // Added onClose prop
  onSelectOption: (option: QuickSnoozeOption) => void;
  position: { top: number; left: number } | null;
  triggerButtonId: string | null; // ID of the button that triggered this menu
}

const QuickSnoozeMenu: React.FC<QuickSnoozeMenuProps> = ({
  isOpen,
  onSelectOption,
  position,
  triggerButtonId,
  // onClose is accepted but not directly used by this component's internal logic for now
  // as App.tsx handles the state change that closes it.
}) => {
  if (!isOpen || !position) return null;

  const menuOptions = [
    { label: 'Later Today (+4h)', option: QuickSnoozeOption.LaterToday },
    { label: 'Tomorrow (8 AM)', option: QuickSnoozeOption.Tomorrow },
    { label: 'This Weekend (Fri 5 PM)', option: QuickSnoozeOption.ThisWeekend },
    { label: 'Next Week (Mon 8 AM)', option: QuickSnoozeOption.NextWeek },
    { label: 'Pick Date & Time...', option: QuickSnoozeOption.PickDateTime },
  ];

  const menuItemClass = "block w-full text-left px-4 py-2 text-sm text-[rgb(var(--text-primary))] hover:bg-[rgba(var(--accent-color),0.1)] focus:bg-[rgba(var(--accent-color),0.15)] focus:outline-none transition-colors duration-150";

  return (
    <div
      id="qs-menu" // Static ID for the menu container
      className="fixed z-[60] bg-[rgb(var(--card-bg-color))] border border-[rgb(var(--divider-color))] rounded-md shadow-xl py-1 w-56"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={triggerButtonId ?? undefined}
      onClick={(e) => e.stopPropagation()} 
    >
      {menuOptions.map(({ label, option }) => (
        <button
          key={option}
          onClick={() => {
            onSelectOption(option);
            // The actual closing is handled by App.tsx's logic triggered by onSelectOption
          }}
          className={menuItemClass}
          role="menuitem"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default QuickSnoozeMenu;