"use client";

import React, { useEffect } from "react";
import DynamicTable from "@/components/ui/dynamic-table";
import { Column, RecordType } from "@/types/table";
import { useRouter } from "next/navigation";
import { useExams } from "@/hooks/exam/use-exam";

const ExamsPage: React.FC = () => {
  const router = useRouter();

  const { exams, getAllExams } = useExams();

  useEffect(() => {
    getAllExams();
  }, []);

  const columns: Column<RecordType>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (value, record) => (
        <div
          className="font-medium cursor-pointer hover:text-blue-600"
          onClick={() => router.push(`/admin/exam/${record.id}`)}
        >
          {value as string}
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (value, record) => (
        <div
          className="font-medium cursor-pointer hover:text-blue-600"
          onClick={() => router.push(`/admin/exam/${record.id}`)}
        >
          {value as string}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <DynamicTable columns={columns} data={exams} />
    </div>
  );
};

export default ExamsPage;
