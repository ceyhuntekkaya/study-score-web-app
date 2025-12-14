"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CourseLessonDetailDTO } from "@/types/course/course";
import { ELessonLevel } from "@/types/enumeration";
import { useCourseLessons } from "@/hooks/course/use-course-lesson";
import {
  courseLessonConvert,
  CourseLessonFormErrors,
} from "@/types/course/course-lesson";
import { Textarea } from "@/components/ui/textarea";
import { CopyPlus, EyeOff, Trash } from "lucide-react";

interface CourseLessonFormProps {
  selectedCourseLesson: CourseLessonDetailDTO;
  type?: "create" | "update";
  parentLessonId?: string | null;
  courseId: string;
  updateAllData: () => void;
}

const CourseLessonForm = ({
  selectedCourseLesson,
  type = "create",
  parentLessonId,
  courseId,
  updateAllData,
}: CourseLessonFormProps) => {
  const getLevel = (): ELessonLevel => {
    if (!selectedCourseLesson.id) {
      return ELessonLevel.UNIT;
    } else if (selectedCourseLesson.lessonLevel === ELessonLevel.UNIT) {
      return ELessonLevel.TOPIC;
    } else if (selectedCourseLesson.lessonLevel === ELessonLevel.TOPIC) {
      return ELessonLevel.LESSON;
    } else if (selectedCourseLesson.lessonLevel === ELessonLevel.LESSON) {
      return ELessonLevel.LESSON;
    } else {
      return ELessonLevel.LESSON;
    }
  };

  const [formData, setFormData] = useState<CourseLessonDetailDTO>({
    id: "",
    name: "",
    description: "",
    lessonLevel: getLevel(),
    orderNumber: 1,
    parentLessonId: selectedCourseLesson.id
      ? selectedCourseLesson.id
      : parentLessonId || null,
    childLessons: [],
    lessonParts: [],
    courseId: courseId,
  });

  useEffect(() => {
    if (type === "update" && selectedCourseLesson) {
      setFormData({
        id: selectedCourseLesson.id,
        name: selectedCourseLesson.name,
        description: selectedCourseLesson.description,
        lessonLevel: selectedCourseLesson.lessonLevel,
        orderNumber: selectedCourseLesson.orderNumber,
        parentLessonId: selectedCourseLesson.parentLessonId,
        childLessons: selectedCourseLesson.childLessons,
        lessonParts: selectedCourseLesson.lessonParts,
        courseId: courseId,
      });
    } else {
      if (parentLessonId && courseId) {
        setFormData({
          ...formData,
          parentLessonId,
          courseId,
          lessonLevel: getLevel(),
        });
      } else if (courseId) {
        setFormData({ ...formData, courseId, lessonLevel: getLevel() });
      }
    }
  }, [courseId, parentLessonId, selectedCourseLesson, type]);

  const { createCourseLesson, updateCourseLesson, deleteCourseLesson } =
    useCourseLessons();

  const [errors, setErrors] = useState<CourseLessonFormErrors>({});

  const validateForm = () => {
    const newErrors: CourseLessonFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.description) {
      newErrors.description = "Description is required";
    }
    if (!formData.orderNumber) {
      newErrors.orderNumber = "Order number must be greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      if (type === "create") {
        createCourseLesson(courseLessonConvert(formData)).then(updateAllData);
      } else {
        updateCourseLesson(courseLessonConvert(formData)).then(updateAllData);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === "create"
            ? `CREATE NEW ${formData.lessonLevel}`
            : `EDIT ${formData.lessonLevel} : ${formData.name}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Temel Bilgiler */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                rows={5}
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.description}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Sıra No *</Label>
              <Input
                id="orderNumber"
                type={"number"}
                name="orderNumber"
                value={formData.orderNumber || 0}
                onChange={handleChange}
                className={errors.orderNumber ? "border-red-500" : ""}
              />
              {errors.orderNumber && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.orderNumber}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {type === "update" ? (
              <>
                <Button
                  onClick={() => deleteCourseLesson(formData.id)}
                  className="bg-red-600 hover:bg-blue-700 text-white"
                >
                  <Trash size={24} />
                  <span className={"pl-3"}>DELETE</span>
                </Button>
                <Button className="bg-yellow-600 hover:bg-blue-700 text-white">
                  <EyeOff size={24} />
                  <span className={"pl-3"}>MAKE PASSIVE</span>
                </Button>
              </>
            ) : null}

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CopyPlus size={24} />
              <span className={"pl-3"}>SAVE</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseLessonForm;
