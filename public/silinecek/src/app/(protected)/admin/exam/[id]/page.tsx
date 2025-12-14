'use client';

import React from 'react';
import {useParams} from 'next/navigation';


export default function CustomerDetail() {
    const params = useParams();
    const courseId = params.id as string;


    return (
        <div className="space-y-6">
           Hello - {courseId}
        </div>
    );
}

