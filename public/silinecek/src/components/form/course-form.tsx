'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Course, CourseFormData, CourseFormErrors } from "@/types/course/course";
import { ECourseCategory } from "@/types/enumeration";
import { Curriculum } from "@/types/definition/curriculum";

interface CourseFormProps {
    onSubmit: (formData: CourseFormData) => void;
    course?: Course | null;
    curriculums?: Curriculum[];
}

const CourseForm: React.FC<CourseFormProps> = ({
                                                   onSubmit,
                                                   course,
                                                   curriculums = []
                                               }) => {
    const [formData, setFormData] = useState<CourseFormData>({
        id: null,
        name: '',
        category: null,
        imageUrl: '',
        description: '',
        code: '',
        language: '',
        level: '',
        curriculumId: null
    });

    const [errors, setErrors] = useState<CourseFormErrors>({});

    useEffect(() => {
        if (course) {
            setFormData({
                id: course.id,
                name: course.name,
                category: course.category,
                imageUrl: course.imageUrl || '',
                description: course.description || '',
                code: course.code || '',
                language: course.language || '',
                level: course.level || '',
                curriculumId: course.curriculum?.id || null
            });
        }
    }, [course]);

    const validateForm = (): boolean => {
        const newErrors: CourseFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Kurs adı zorunludur.';
        }

        if (!formData.category) {
            newErrors.category = 'Kategori seçimi zorunludur.';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Kurs kodu zorunludur.';
        }

        if (!formData.language.trim()) {
            newErrors.language = 'Dil seçimi zorunludur.';
        }

        if (!formData.level.trim()) {
            newErrors.level = 'Seviye seçimi zorunludur.';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Açıklama zorunludur.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = <T extends keyof CourseFormData>(
        name: T,
        value: CourseFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {course ? "Kurs Güncelle" : "Yeni Kurs Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Kurs Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Kurs Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Kurs adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Kurs Kodu */}
                        <div className="space-y-2">
                            <Label htmlFor="code">Kurs Kodu *</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => handleChange('code', e.target.value)}
                                className={errors.code ? 'border-red-500' : ''}
                                placeholder="Kurs kodunu giriniz"
                            />
                            {errors.code && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.code}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Kategori */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori *</Label>
                            <Select
                                onValueChange={(value) => handleChange('category', value as ECourseCategory)}
                                value={formData.category ?? ""}
                            >
                                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Kategori seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.entries(ECourseCategory).map(([key, value]) => (
                                            <SelectItem key={key} value={value}>
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.category}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Müfredat */}
                        <div className="space-y-2">
                            <Label htmlFor="curriculum">Müfredat</Label>
                            <Select
                                onValueChange={(value) => handleChange('curriculumId', value as string)}
                                value={formData.curriculumId ?? ""}
                            >
                                <SelectTrigger className={errors.curriculumId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Müfredat seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="">Müfredat seçin</SelectItem>
                                        {curriculums.map(curriculum => (
                                            <SelectItem key={curriculum.id} value={curriculum.id}>
                                                {curriculum.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.curriculumId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.curriculumId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Dil */}
                        <div className="space-y-2">
                            <Label htmlFor="language">Dil *</Label>
                            <Input
                                id="language"
                                value={formData.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                                className={errors.language ? 'border-red-500' : ''}
                                placeholder="Dil giriniz (örn: Türkçe, İngilizce)"
                            />
                            {errors.language && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.language}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Seviye */}
                        <div className="space-y-2">
                            <Label htmlFor="level">Seviye *</Label>
                            <Input
                                id="level"
                                value={formData.level}
                                onChange={(e) => handleChange('level', e.target.value)}
                                className={errors.level ? 'border-red-500' : ''}
                                placeholder="Seviye giriniz (örn: Başlangıç, Orta, İleri)"
                            />
                            {errors.level && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.level}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Resim URL */}
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Resim URL</Label>
                        <Input
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => handleChange('imageUrl', e.target.value)}
                            className={errors.imageUrl ? 'border-red-500' : ''}
                            placeholder="Kurs resmi URL'si giriniz"
                        />
                        {errors.imageUrl && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.imageUrl}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                            placeholder="Kurs açıklaması giriniz..."
                        />
                        {errors.description && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.description}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            {course ? "Kurs Güncelle" : "Kurs Oluştur"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CourseForm;