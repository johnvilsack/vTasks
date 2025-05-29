

import React, { useState, useEffect } from 'react';

interface SnoozeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSnooze: (snoozeUntil: string) => void;
  entryTitle: string;
  currentSnoozeUntil?: string;
}

const SnoozeModal: React.FC<SnoozeModalProps> = ({ isOpen, onClose, onConfirmSnooze, entryTitle, currentSnoozeUntil }) => {
  const getInitialDateTime = () => {
    const now = new Date();
    if (currentSnoozeUntil) {
        const current = new Date(currentSnoozeUntil);
        if (current > now) {
            return current;
        }
    }
    // Default to 1 hour from now
    now.setHours(now.getHours() + 1);
    // Ensure time is not in the past if currentSnoozeUntil was in the past
    if (now < new Date()) {
        const futureNow = new Date();
        futureNow.setHours(futureNow.getHours() + 1);
        return futureNow;
    }
    return now;
  };
  
  const initialDateTime = getInitialDateTime();
  const [date, setDate] = useState<string>(initialDateTime.toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(initialDateTime.toTimeString().substring(0,5)); // HH:MM

  useEffect(() => {
    if (isOpen) {
        const newInitialDateTime = getInitialDateTime();
        setDate(newInitialDateTime.toISOString().split('T')[0]);
        setTime(newInitialDateTime.toTimeString().substring(0,5));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentSnoozeUntil]); // Dependencies are correct


  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!date || !time) {
      alert("Please select a valid date and time.");
      return;
    }
    const selectedDateTime = new Date(`${date}T${time}:00`);
    if (selectedDateTime <= new Date()) {
      alert("Snooze time must be in the future.");
      return;
    }
    onConfirmSnooze(selectedDateTime.toISOString());
  };

  const inputBaseClass = "mt-1 block w-full px-3 py-2 bg-[rgb(var(--input-bg-color))] border border-[rgb(var(--input-border-color))] rounded-md shadow-sm focus:ring-1 focus:ring-[rgb(var(--accent-color))] focus:border-[rgb(var(--accent-color))] text-sm text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-placeholder))] transition-colors duration-150";
  const buttonBaseClass = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--card-bg-color))] transition-colors duration-150";
  const primaryButtonClass = `${buttonBaseClass} bg-[rgb(var(--accent-color))] text-[rgb(var(--accent-text-color))] hover:bg-[rgb(var(--accent-color-hover))] focus:ring-[rgb(var(--accent-color))]`;
  const secondaryButtonClass = `${buttonBaseClass} bg-[rgb(var(--button-secondary-bg-color))] text-[rgb(var(--button-secondary-text-color))] hover:bg-opacity-80 focus:ring-[rgb(var(--accent-color))]`;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="snooze-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[rgba(var(--accent-color),0.1)] sm:mx-0 sm:h-10 sm:w-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[rgb(var(--accent-color))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 id="snooze-modal-title" className="text-lg font-semibold leading-6 text-[rgb(var(--text-primary))]">
              Snooze Item
            </h3>
            <p className="text-sm text-[rgb(var(--text-secondary))] mt-1">
              Snooze "<strong>{entryTitle}</strong>" until:
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="snooze-date" className="block text-xs font-medium text-[rgb(var(--text-secondary))]">Date</label>
                <input
                  id="snooze-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`${inputBaseClass} appearance-none dark-input-icons`}
                  min={new Date().toISOString().split('T')[0]} 
                />
              </div>
              <div>
                <label htmlFor="snooze-time" className="block text-xs font-medium text-[rgb(var(--text-secondary))]">Time</label>
                <input
                  id="snooze-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`${inputBaseClass} appearance-none dark-input-icons`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="button"
            className={`${primaryButtonClass} w-full sm:w-auto`}
            onClick={handleSubmit}
          >
            Snooze
          </button>
          <button
            type="button"
            className={`${secondaryButtonClass} w-full sm:w-auto`}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnoozeModal;
