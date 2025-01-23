import React from "react";

export const ReviewItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
  customClass?: string;
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};
