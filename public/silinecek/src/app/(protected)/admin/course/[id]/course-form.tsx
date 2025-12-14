'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {CourseFormData, CourseFormErrors} from "@/types/course/course";
import {ECourseCategory} from "@/types/enumeration";
import {useCourses} from "@/hooks/course/use-course";

interface CreateCustomerFormProps {
    selectedCourse?: CourseFormData | null
    courseId: string
}


const CourseForm = ({selectedCourse, courseId}: CreateCustomerFormProps) => {
    const [formData, setFormData] = useState<CourseFormData>({
        id: '',
        name: "",
        category: ECourseCategory.IELTS,
        imageUrl: '',
        description: '',
        code: '',
        language: '',
        level: '',
        curriculumId: ''
    });
    const {createCourse} = useCourses();

    console.log(selectedCourse)
    console.log(courseId)


    const [errors, setErrors] = useState<CourseFormErrors>({});

    const validateForm = () => {
        const newErrors: CourseFormErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Müşteri adı zorunludur';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            createCourse(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

/*

@Enumerated(EnumType.STRING)
private ECourseCategory category;
private String imageUrl;

@Column(columnDefinition = "TEXT")
private String description;


private String code;
private String language;
private String level;
@ManyToOne
private Curriculum curriculum;

private LocalDateTime updatedAt = LocalDateTime.now();
private Integer version;

*/

    return (
        <Card>
            <CardHeader>
                <CardTitle>Yeni Müşteri Oluştur</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        {/* Temel Bilgiler */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Description *</Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={errors.description ? 'border-red-500' : ''}
                            />
                            {errors.description && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.description}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                    </div>


                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Müşteri Oluştur
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )

};

export default CourseForm;