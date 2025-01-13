import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  maxWidth = "md:max-w-7xl",
}) => {
  return (
    <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
