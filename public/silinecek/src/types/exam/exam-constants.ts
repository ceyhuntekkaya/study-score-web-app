
export const EXAM_FLOW_STEPS = {
    LANDING: 'landing',
    AUTH: 'authentication',
    INFO: 'information',
    RULES: 'rules',
    SYSTEM_CHECK: 'system-check',
    DEMO: 'demo',
    FINAL_CHECKS: 'final-checks',
    START: 'start',
    TAKING: 'taking',
    COMPLETED: 'completed'
};

export const SYSTEM_REQUIREMENTS = {
    MIN_INTERNET_SPEED: 5, // Mbps
    MIN_SCREEN_RESOLUTION: { width: 1024, height: 768 },
    SUPPORTED_BROWSERS: ['Chrome', 'Firefox', 'Safari', 'Edge']
};


export interface BrowserInfo {
    name: string;
    version: string;
    platform: string;
    mobile: boolean;
    supported: boolean;
    features: {
        webgl: boolean;
        localStorage: boolean;
        sessionStorage: boolean;
        webRTC: boolean;
        mediaDevices: boolean;
        fullscreen: boolean;
        canvas: boolean;
        websockets: boolean;
    };
}

export interface BrowserCompatibilityCheckTestResult {
    success: boolean;
    warning?: boolean;
    message: string;
    details: {
        browserInfo: BrowserInfo;
        recommendations: string[];
    };
}

export interface InternetSpeedTestResult {
    success: boolean;
    warning?: boolean;
    message: string;
    details: {
        downloadSpeed: number,
        uploadSpeed: number,
        latency: number,
        jitter: number,
        recommendation: string
    };
}


export interface DeviceInfo {
    deviceId: string;
    label: string;
    kind: 'videoinput' | 'audioinput';
}


export interface CameraMicrophoneTestResult {
    success: boolean;
    message: string;
    details: {
        cameraAccess: boolean;
        microphoneAccess: boolean;
        videoDevices: DeviceInfo[];
        audioDevices: DeviceInfo[];
        cameraResolution: string;
        audioLevel: number;
        recommendations: string[];
    };
}


export interface ScreenOptimizationCheckTestResult {
    success: boolean;
    message: string;
    details: {
        screenInfo: ScreenInfo;
        zoomLevel: number;
        fullscreenSupported: boolean;
        recommendations: string[];
        optimizationScore: number;
    };
}


export interface ScreenInfo {
    width: number;
    height: number;
    colorDepth: number;
    pixelDepth: number;
    orientation: string;
    devicePixelRatio: number;
    availWidth: number;
    availHeight: number;
}