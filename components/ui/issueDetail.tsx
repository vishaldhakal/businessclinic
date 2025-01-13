import React from "react";
import { FileText, CheckCircle, Clock, Bell, File } from "lucide-react";

const IssueDetail = () => {
  const data = [
    {
      icon: <FileText className="text-blue-500 text-2xl" />,
      title: "Total",
      count: "20 invoices",
      amount: "$46,218.04",
    },
    {
      icon: <CheckCircle className="text-green-500 text-2xl" />,
      title: "Paid",
      count: "10 invoices",
      amount: "$23,110.23",
    },
    {
      icon: <Clock className="text-yellow-500 text-2xl" />,
      title: "Pending",
      count: "6 invoices",
      amount: "$13,825.05",
    },
    {
      icon: <Bell className="text-red-500 text-2xl" />,
      title: "Overdue",
      count: "2 invoices",
      amount: "$4,655.63",
    },
    {
      icon: <File className="text-gray-500 text-2xl" />,
      title: "Draft",
      count: "2 invoices",
      amount: "$4,627.13",
    },
  ];

  return (
    <div className=" items-center justify-between gap-4 bg-white p-6 shadow-md rounded-lg  hidden">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center text-center border-r last:border-r-0 pr-6 last:pr-0"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
            {item.icon}
          </div>
          <div className="ml-2">
            <h4 className="text-sm font-semibold">{item.title}</h4>
            <p className="text-xs text-gray-500">{item.count}</p>
            <p className="text-lg font-bold">{item.amount}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IssueDetail;
