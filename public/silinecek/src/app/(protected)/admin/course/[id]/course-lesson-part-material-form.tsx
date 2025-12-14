"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CourseLessonPartMaterialDetailDTO } from "@/types/course/course";
import { EMediaType } from "@/types/enumeration";
import { CourseLessonFormErrors } from "@/types/course/course-lesson";
import { Textarea } from "@/components/ui/textarea";
import { useCourseLessonPartMaterials } from "@/hooks/course/use-course-lesson-part-material";
import { materialDTOToFormData } from "@/types/course/course-lesson-part-material";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUpload from "@/components/ui/file-upload";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css"; // CSS'i de import etmeyi unutma

interface CreateCustomerFormProps {
  selectedMaterial: CourseLessonPartMaterialDetailDTO;
  type: "create" | "update";
  courseLessonPartId: string;
  updateAllData: () => void;
}

const CourseLessonPartMaterialForm = ({
  selectedMaterial,
  type = "create",
  updateAllData,
  courseLessonPartId,
}: CreateCustomerFormProps) => {
  const [formData, setFormData] = useState<CourseLessonPartMaterialDetailDTO>({
    id: "",
    name: "",
    description: "",
    content: "",
    mediaType: EMediaType.TEXT,
    orderNumber: 1,
    duration: 0,
    uploadedFileId: "",
    uploadedFileName: "",
    courseLessonPartId: courseLessonPartId,
    userProgress: null,
  });

  useEffect(() => {
    if (type === "update" && selectedMaterial) {
      setFormData({
        id: selectedMaterial.id,
        name: selectedMaterial.name,
        description: selectedMaterial.description,
        content: selectedMaterial.content,
        mediaType: selectedMaterial.mediaType,
        orderNumber: selectedMaterial.orderNumber,
        duration: selectedMaterial.duration,
        uploadedFileId: selectedMaterial.uploadedFileId,
        uploadedFileName: selectedMaterial.uploadedFileName,
        courseLessonPartId: courseLessonPartId,
        userProgress: null,
      });
    } else {
      if (courseLessonPartId) {
        setFormData({ ...formData, courseLessonPartId });
      }
    }
  }, [courseLessonPartId, selectedMaterial, type]);

  const {
    createCourseLessonPartMaterial,
    updateCourseLessonPartMaterial,
    deleteCourseLessonPartMaterial,
  } = useCourseLessonPartMaterials();

  const [errors, setErrors] = useState<CourseLessonFormErrors>({});

  const validateForm = () => {
    const newErrors: CourseLessonFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Müşteri adı zorunludur";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    deleteCourseLessonPartMaterial(formData.id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      if (type === "create") {
        createCourseLessonPartMaterial(materialDTOToFormData(formData)).then(
          updateAllData
        );
      } else {
        updateCourseLessonPartMaterial(materialDTOToFormData(formData)).then(
          updateAllData
        );
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

  const handleSelectChange = <
    T extends keyof CourseLessonPartMaterialDetailDTO
  >(
    name: T,
    value: CourseLessonPartMaterialDetailDTO[T]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderContent = (text: string) => {
    // Inline math: $...$
    // Block math: $$...$$
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2);
        return <BlockMath key={index} math={math} />;
      } else if (part.startsWith("$") && part.endsWith("$")) {
        const math = part.slice(1, -1);
        return <InlineMath key={index} math={math} />;
      }
      return <span key={index}>{part}</span>;
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Material - {type}</CardTitle>
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
              <Label htmlFor="mediaType">mediaType *</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("mediaType", value as EMediaType)
                }
                value={formData.mediaType ?? ""}
              >
                <SelectTrigger
                  className={errors.status ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(EMediaType).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.mediaType && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.mediaType}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                rows={5}
                id="content"
                name="content"
                value={formData.content || ""}
                onChange={handleChange}
                className={errors.content ? "border-red-500" : ""}
              />
              {errors.content && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.content}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              {renderContent(formData.content || "")}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">duration *</Label>
              <Input
                id="duration"
                type={"number"}
                name="duration"
                value={formData.duration || 0}
                onChange={handleChange}
                className={errors.duration ? "border-red-500" : ""}
              />
              {errors.duration && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.duration}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">uploadedFileId *</Label>
              <Input
                id="uploadedFileId"
                name="uploadedFileId"
                value={formData.uploadedFileId || ""}
                onChange={handleChange}
                className={errors.uploadedFile ? "border-red-500" : ""}
              />
              <FileUpload />
              {errors.uploadedFileId && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.uploadedFileId}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Materyal Oluştur
            </Button>
          </div>
        </form>

        <Button
          className="bg-red-600 hover:bg-blue-700 text-white"
          onClick={handleDelete}
        >
          Materyal Sil
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseLessonPartMaterialForm;
