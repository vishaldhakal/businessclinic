"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function RegisterIssue() {
  const [userType, setUserType] = React.useState<string | null>(null);

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
    console.log("Selected User Type:", type);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] ">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-4xl min-h-[400px]">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">
          Register Your Business Issue and Get Help Problem
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Solve your business problem with our help and track your issue
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10  ">
          <Link href="/register-issue/haveBusiness">
            <div
              className={cn(
                "p-10 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4",
                userType === "haveBusiness"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-400"
              )}
              onClick={() => handleUserTypeSelection("haveBusiness")}
            >
              <img
                src="/yse.svg"
                alt="haveBusiness"
                className="w-24 h-24 object-contain"
              />
              <div>
                <h3 className="font-semibold text-lg">Have Business</h3>
                <p className="text-sm text-gray-600">
                  Please Register Your Business Issue If You Have Business
                </p>
              </div>
            </div>
          </Link>
          <Link href="/register-issue/noBusiness">
            <div
              className={cn(
                "p-10 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4",
                userType === "notHaveBusiness"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-400"
              )}
              onClick={() => handleUserTypeSelection("notHaveBusiness")}
            >
              <img
                src="/not.svg"
                alt="notHaveBusiness"
                className="w-24 h-24 object-contain"
              />
              <div>
                <h3 className="font-semibold text-lg">Not Have Business</h3>
                <p className="text-sm text-gray-600">
                  Please Register Your Business Issue If You Not Have Business
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
