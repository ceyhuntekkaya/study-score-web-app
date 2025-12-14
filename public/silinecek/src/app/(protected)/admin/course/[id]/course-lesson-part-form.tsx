"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CourseLessonPartDetailDTO } from "@/types/course/course";
import { CourseLessonFormErrors } from "@/types/course/course-lesson";
import { Textarea } from "@/components/ui/textarea";
import { useCourseLessonParts } from "@/hooks/course/use-course-lesson-part";
import {
  courseLessonPartDetailDTOToCourseLessonPartFormData,
  CourseLessonPartFormErrors,
} from "@/types/course/course-lesson-part";
import { CopyPlus, EyeOff, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectValues,
} from "@/components/ui/select";
import { useCurriculumContents } from "@/hooks/definition/use-curriculum-content";

interface CreateCustomerFormProps {
  selectedCourseLessonPart: CourseLessonPartDetailDTO;
  type?: "create" | "update";
  courseLessonId: string;
  updateAllData: () => void;
}

const CourseLessonPartForm = ({
  selectedCourseLessonPart,
  type = "create",
  updateAllData,
  courseLessonId,
}: CreateCustomerFormProps) => {
  const [formData, setFormData] = useState<CourseLessonPartDetailDTO>({
    id: "",
    name: "",
    description: "",
    orderNumber: 1,
    curriculumContentIds: [],
    materials: [],
    courseLessonId: courseLessonId,
  });

  const { fetchCurriculumContents, curriculumContents } =
    useCurriculumContents();
  useEffect(() => {
    fetchCurriculumContents();
  }, []);

  useEffect(() => {
    if (type === "update" && selectedCourseLessonPart) {
      setFormData({
        id: selectedCourseLessonPart.id,
        name: selectedCourseLessonPart.name,
        description: selectedCourseLessonPart.description,
        orderNumber: selectedCourseLessonPart.orderNumber,
        curriculumContentIds: selectedCourseLessonPart.curriculumContentIds,
        materials: selectedCourseLessonPart.materials,
        courseLessonId: courseLessonId,
      });
    } else {
      if (courseLessonId) {
        setFormData({ ...formData, courseLessonId });
      }
    }
  }, [selectedCourseLessonPart, type]);

  const {
    createCourseLessonPart,
    updateCourseLessonPart,
    deleteCourseLessonPart,
  } = useCourseLessonParts();

  const [errors, setErrors] = useState<CourseLessonPartFormErrors>({});

  const validateForm = () => {
    const newErrors: CourseLessonFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Müşteri adı zorunludur";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      if (type === "create") {
        createCourseLessonPart(
          courseLessonPartDetailDTOToCourseLessonPartFormData(formData)
        ).then(updateAllData);
      } else {
        updateCourseLessonPart(
          courseLessonPartDetailDTOToCourseLessonPartFormData(formData)
        ).then(updateAllData);
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

  const handleCurriculumChange = (value: SelectValue | SelectValues) => {
    // multiple=true olduğu için value her zaman array gelecek
    const selectedIds = Array.isArray(value) ? value : [value];

    setFormData((prev) => ({
      ...prev,
      curriculumContentIds: selectedIds as string[],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === "create"
            ? `CREATE NEW LESSON PART`
            : `EDIT LESSON PART : ${formData.name}`}
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

            <div className="space-y-2">
              <Label htmlFor="offer">Gains</Label>
              <Select
                multiple={true}
                onValueChange={handleCurriculumChange}
                value={formData.curriculumContentIds ?? []}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {curriculumContents.map((content) => (
                      <SelectItem key={content.id} value={content.id}>
                        {content.content}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {errors.curriculumContentIds && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {errors.curriculumContentIds}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {type === "update" ? (
              <>
                <Button
                  onClick={() => deleteCourseLessonPart(formData.id)}
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

export default CourseLessonPartForm;
