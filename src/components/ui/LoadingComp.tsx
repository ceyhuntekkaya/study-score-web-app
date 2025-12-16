'use client';

import React from "react";
import LoadingSpinner from './LoadingSpinner';

export default function LoadingComp() {
    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '256px' }}>
            <LoadingSpinner size="md" />
        </div>
    );
}
