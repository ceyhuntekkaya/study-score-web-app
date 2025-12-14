"use client";

import React, { useEffect } from "react";
import { useCourses } from "@/hooks/course/use-course";
import DynamicTable from "@/components/ui/dynamic-table";
import { Column, RecordType } from "@/types/table";
import { useRouter } from "next/navigation";

const CoursesPage: React.FC = () => {
  const router = useRouter();

  const { courses, fetchCourses } = useCourses();

  useEffect(() => {
    fetchCourses();
  }, []);

  const columns: Column<RecordType>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (value, record) => (
        <div
          className="font-medium cursor-pointer hover:text-blue-600"
          onClick={() => router.push(`/admin/course/${record.id}`)}
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
          onClick={() => router.push(`/admin/course/${record.id}`)}
        >
          {value as string}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <DynamicTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
