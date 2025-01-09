import React from "react";

export const ReviewSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-primary">{title}</h4>
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">{children}</div>
    </div>
  );
};
