"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function RegisterIssue() {
  const [userType, setUserType] = React.useState<string | null>(null);

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
    console.log("Selected User Type:", type);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-4xl min-h-[400px]">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-purple-600 mb-2 sm:mb-4">
          Register Your Business Issue and Get Help Problem
        </h2>
        <p className="text-center text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
          Solve your business problem with our help and track your issue
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          <Link href="/register-issue/haveBusiness">
            <div
              className={cn(
                "p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-center gap-3 sm:gap-4",
                userType === "haveBusiness"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-400"
              )}
              onClick={() => handleUserTypeSelection("haveBusiness")}
            >
              <Image
                src="/yse.svg"
                alt="haveBusiness"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                width={500}
                height={300}
              />
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-base sm:text-lg">Have Business</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Please Register Your Business Issue If You Have Business
                </p>
              </div>
            </div>
          </Link>
          <Link href="/register-issue/noBusiness">
            <div
              className={cn(
                "p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-center gap-3 sm:gap-4",
                userType === "notHaveBusiness"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-400"
              )}
              onClick={() => handleUserTypeSelection("notHaveBusiness")}
            >
              <Image
                src="/not.svg"
                alt="notHaveBusiness"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                width={500}
                height={300}
              />
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-base sm:text-lg">Not Have Business</h3>
                <p className="text-xs sm:text-sm text-gray-600">
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
