import React from "react";

import "./BackupStatus.scss";

interface BackupStatusProps {
  isLoading: boolean;
  lastSaved?: Date | null;
  error?: string | null;
}

export const BackupStatus: React.FC<BackupStatusProps> = ({
  isLoading,
  lastSaved,
  error,
}) => {
  if (error) {
    return (
      <div className="backup-status backup-status--error">
        <span className="backup-status__icon">⚠️</span>
        <span className="backup-status__text">Backup failed</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="backup-status backup-status--loading">
        <span className="backup-status__icon">⏳</span>
        <span className="backup-status__text">Loading backup...</span>
      </div>
    );
  }

  if (lastSaved) {
    const timeAgo = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    let timeText = "just now";

    if (timeAgo > 60) {
      const minutes = Math.floor(timeAgo / 60);
      timeText = `${minutes}m ago`;
    } else if (timeAgo > 10) {
      timeText = `${timeAgo}s ago`;
    }

    return (
      <div className="backup-status backup-status--saved">
        <span className="backup-status__icon">✅</span>
        <span className="backup-status__text">Saved {timeText}</span>
      </div>
    );
  }

  return null;
};
