'use client';

import { useState, useRef } from 'react';
import { Calculator, PenTool, ZoomIn, ZoomOut,Volume2, VolumeX, Maximize, Minimize, Clock, Palette, Eraser, CheckCircle, Play, Pause, SkipForward, SkipBack, Settings, Eye, EyeOff } from 'lucide-react';

interface ExamTool {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    category: 'essential' | 'accessibility' | 'advanced';
    demo: React.ReactNode;
    shortcuts?: string[];
    tips: string[];
    completed: boolean;
}

interface ToolsIntroductionProps {
    onCompleted: () => void;
}

export function ToolsIntroduction({ onCompleted }: ToolsIntroductionProps) {
    const [activeTool, setActiveTool] = useState<string>('calculator');
    const [completedTools, setCompletedTools] = useState<Set<string>>(new Set());
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [calculatorInput, setCalculatorInput] = useState('');
    const [notepadContent, setNotepadContent] = useState('');
    const [isTimerVisible, setIsTimerVisible] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [isHighContrast, setIsHighContrast] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');

    // Hesap makinesi işlemleri
    const handleCalculatorInput = (value: string) => {
        if (value === 'C') {
            setCalculatorInput('');
        } else if (value === '=') {
            try {
                const result = eval(calculatorInput.replace('×', '*').replace('÷', '/'));
                setCalculatorInput(result.toString());
            } catch {
                setCalculatorInput('Error');
            }
        } else {
            setCalculatorInput(prev => prev + value);
        }

        // Calculator aracını tamamla
        if (!completedTools.has('calculator')) {
            setCompletedTools(prev => new Set([...prev, 'calculator']));
        }
    };

    // Çizim fonksiyonları
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(x, y);
            }
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = 2;
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }

        // Drawing aracını tamamla
        if (!completedTools.has('drawing')) {
            setCompletedTools(prev => new Set([...prev, 'drawing']));
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };



    // Sınav araçları
    const examTools: ExamTool[] = [
        {
            id: 'calculator',
            name: 'Hesap Makinesi',
            icon: <Calculator className="w-5 h-5" />,
            description: 'Matematik sorularında kullanabileceğiniz temel hesap makinesi',
            category: 'essential',
            completed: completedTools.has('calculator'),
            shortcuts: ['Ctrl + K'],
            tips: [
                'Sadece temel matematik işlemleri yapabilir',
                'Sonuçları kopyalayabilirsiniz',
                'Geçmiş hesaplamaları görebilirsiniz'
            ],
            demo: (
                <div className="bg-gray-900 rounded-lg p-4 max-w-xs mx-auto">
                    <div className="bg-black text-green-400 p-3 rounded mb-3 text-right font-mono">
                        {calculatorInput || '0'}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            'C', '±', '%', '÷',
                            '7', '8', '9', '×',
                            '4', '5', '6', '-',
                            '1', '2', '3', '+',
                            '0', '.', '='
                        ].map((btn, index) => (
                            <button
                                key={index}
                                onClick={() => handleCalculatorInput(btn)}
                                className={`h-10 rounded text-sm font-medium ${
                                    ['C', '±', '%', '÷', '×', '-', '+', '='].includes(btn)
                                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                                        : 'bg-gray-600 text-white hover:bg-gray-500'
                                } ${btn === '0' ? 'col-span-2' : ''}`}
                            >
                                {btn}
                            </button>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'notepad',
            name: 'Not Defteri',
            icon: <PenTool className="w-5 h-5" />,
            description: 'Sınav sırasında not alabilir, hesaplamalar yapabilirsiniz',
            category: 'essential',
            completed: completedTools.has('notepad'),
            shortcuts: ['Ctrl + N'],
            tips: [
                'Notlarınız otomatik olarak kaydedilir',
                'Kopyala/yapıştır işlevlerini kullanabilirsiniz',
                'Sınav boyunca erişilebilir'
            ],
            demo: (
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b flex items-center justify-between">
                        <span className="text-sm font-medium">Not Defteri</span>
                        <div className="flex gap-1">
                            <button className="w-3 h-3 bg-red-500 rounded-full"></button>
                            <button className="w-3 h-3 bg-yellow-500 rounded-full"></button>
                            <button className="w-3 h-3 bg-green-500 rounded-full"></button>
                        </div>
                    </div>
                    <textarea
                        value={notepadContent}
                        onChange={(e) => setNotepadContent(e.target.value)}
                        placeholder="Buraya not alabilirsiniz..."
                        className="w-full h-32 p-3 resize-none focus:outline-none"
                    />
                    <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 border-t">
                        Kelime sayısı: {notepadContent.split(' ').filter(word => word.length > 0).length}
                    </div>
                </div>
            )
        },
        {
            id: 'zoom',
            name: 'Yakınlaştırma',
            icon: <ZoomIn className="w-5 h-5" />,
            description: 'Soruları ve seçenekleri daha büyük görmek için yakınlaştırma',
            category: 'accessibility',
            completed: completedTools.has('zoom'),
            shortcuts: ['Ctrl + +', 'Ctrl + -'],
            tips: [
                '%75 ile %150 arasında ayarlanabilir',
                'Tüm sayfa içeriği etkilenir',
                'Klavye kısayolları da kullanılabilir'
            ],
            demo: (
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => setZoomLevel(prev => Math.max(75, prev - 25))}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            <ZoomOut className="w-4 h-4" />
                            Uzaklaştır
                        </button>
                        <span className="font-mono text-lg min-w-[60px] text-center">
              %{zoomLevel}
            </span>
                        <button
                            onClick={() => setZoomLevel(prev => Math.min(150, prev + 25))}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            <ZoomIn className="w-4 h-4" />
                            Yakınlaştır
                        </button>
                    </div>
                    <div
                        className="border rounded-lg p-4 bg-white transition-transform origin-center"
                        style={{ transform: `scale(${zoomLevel / 100})` }}
                    >
                        <h4 className="font-medium mb-2">Örnek Soru Metni</h4>
                        <p className="text-gray-700 text-sm">
                            Bu metin yakınlaştırma özelliğini test etmek için kullanılır.
                            Zoom seviyesini değiştirerek metnin nasıl büyüdüğünü görebilirsiniz.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'timer',
            name: 'Zaman Takibi',
            icon: <Clock className="w-5 h-5" />,
            description: 'Sınav süresini takip etmek ve zaman uyarıları almak',
            category: 'essential',
            completed: completedTools.has('timer'),
            tips: [
                'Kalan süre sürekli görünür',
                'Son 10 dakikada uyarı verir',
                'Gizleyip gösterebilirsiniz'
            ],
            demo: (
                <div className="space-y-4">
                    <div className="flex items-center justify-center">
                        <div className={`text-center transition-opacity ${isTimerVisible ? 'opacity-100' : 'opacity-50'}`}>
                            <div className="text-3xl font-mono font-bold text-blue-600 mb-1">
                                1:23:45
                            </div>
                            <div className="text-sm text-gray-600">Kalan Süre</div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => setIsTimerVisible(!isTimerVisible)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                            {isTimerVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {isTimerVisible ? 'Gizle' : 'Göster'}
                        </button>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-amber-800 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Son 10 dakikada otomatik uyarı gelir</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'audio',
            name: 'Ses Kontrolü',
            icon: <Volume2 className="w-5 h-5" />,
            description: 'Ses içerikli sorular için ses ayarları',
            category: 'essential',
            completed: completedTools.has('audio'),
            shortcuts: ['M (Mute)'],
            tips: [
                'Ses seviyesini ayarlayabilirsiniz',
                'Hızlı susturma özelliği',
                'Ses dosyalarını tekrar oynatabilirsiniz'
            ],
            demo: (
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                            className={`p-3 rounded-full ${
                                isAudioEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            {isAudioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                        </button>
                        <div className="flex-1 max-w-32">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={isAudioEnabled ? 75 : 0}
                                disabled={!isAudioEnabled}
                                className="w-full"
                            />
                        </div>
                        <span className="text-sm text-gray-600 min-w-[30px]">
              {isAudioEnabled ? '75%' : '0%'}
            </span>
                    </div>
                    <div className="bg-white border rounded-lg p-4">
                        <h4 className="font-medium mb-3">Ses Oynatıcı</h4>
                        <div className="flex items-center gap-3">
                            <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                                <Play className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300">
                                <Pause className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300">
                                <SkipBack className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300">
                                <SkipForward className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'drawing',
            name: 'Çizim Aracı',
            icon: <Palette className="w-5 h-5" />,
            description: 'Matematik ve fen sorularında çizim yapabilme',
            category: 'advanced',
            completed: completedTools.has('drawing'),
            tips: [
                'Farklı renk ve kalınlıklar kullanabilirsiniz',
                'Çizimlerinizi silebilirsiniz',
                'Geometrik şekiller çizebilirsiniz'
            ],
            demo: (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex gap-1">
                            {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setCurrentColor(color)}
                                    className={`w-6 h-6 rounded border-2 ${
                                        currentColor === color ? 'border-gray-600' : 'border-gray-300'
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <button
                            onClick={clearCanvas}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                        >
                            <Eraser className="w-3 h-3" />
                            Temizle
                        </button>
                    </div>
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={200}
                        className="border rounded-lg bg-white cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                    <p className="text-xs text-gray-500 text-center">
                        Çizim yapmak için fareyi sürükleyin
                    </p>
                </div>
            )
        },
        {
            id: 'accessibility',
            name: 'Erişilebilirlik',
            icon: <Settings className="w-5 h-5" />,
            description: 'Görme zorluğu yaşayanlar için özel ayarlar',
            category: 'accessibility',
            completed: completedTools.has('accessibility'),
            tips: [
                'Yüksek kontrast modu',
                'Font boyutu değiştirme',
                'Renk körü dostu renkler'
            ],
            demo: (
                <div className="space-y-4">
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                Font Boyutu
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                                    className="px-2 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                                >
                                    A-
                                </button>
                                <span className="text-sm min-w-[40px] text-center">{fontSize}px</span>
                                <button
                                    onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                                    className="px-2 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                                >
                                    A+
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isHighContrast}
                                    onChange={(e) => setIsHighContrast(e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-sm">Yüksek Kontrast Modu</span>
                            </label>
                        </div>
                    </div>

                    <div
                        className={`p-3 rounded-lg transition-colors ${
                            isHighContrast
                                ? 'bg-black text-white border-2 border-white'
                                : 'bg-gray-50 text-gray-900 border border-gray-200'
                        }`}
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        Örnek metin - erişilebilirlik ayarları
                    </div>
                </div>
            )
        },
        {
            id: 'fullscreen',
            name: 'Tam Ekran',
            icon: <Maximize className="w-5 h-5" />,
            description: 'Dikkat dağıtıcı unsurları kaldırmak için tam ekran modu',
            category: 'essential',
            completed: completedTools.has('fullscreen'),
            shortcuts: ['F11'],
            tips: [
                'Dikkat dağıtıcı unsurları gizler',
                'Daha fazla alan sağlar',
                'ESC ile çıkabilirsiniz'
            ],
            demo: (
                <div className="text-center space-y-4">
                    <div className={`mx-auto border-2 rounded-lg transition-all ${
                        isFullscreen ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`} style={{ width: '200px', height: '120px' }}>
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className={`text-sm ${isFullscreen ? 'text-blue-700' : 'text-gray-600'}`}>
                                    {isFullscreen ? 'Tam Ekran Modu' : 'Normal Ekran'}
                                </div>
                                {isFullscreen ? <Maximize className="w-6 h-6 mx-auto mt-2 text-blue-600" /> : <Minimize className="w-6 h-6 mx-auto mt-2 text-gray-400" />}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className={`px-4 py-2 rounded-lg ${
                            isFullscreen
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekrana Geç'}
                    </button>
                </div>
            )
        }
    ];


    // Araç tıklandığında tamamla
    const handleToolInteraction = (toolId: string) => {
        setActiveTool(toolId);
        if (!completedTools.has(toolId)) {
            setCompletedTools(prev => new Set([...prev, toolId]));
        }
    };

    // Kategoriye göre araçları grupla
    const toolsByCategory = {
        essential: examTools.filter(tool => tool.category === 'essential'),
        accessibility: examTools.filter(tool => tool.category === 'accessibility'),
        advanced: examTools.filter(tool => tool.category === 'advanced')
    };

    const categoryNames = {
        essential: 'Temel Araçlar',
        accessibility: 'Erişilebilirlik',
        advanced: 'Gelişmiş Araçlar'
    };

    // Tamamlama durumu
    const totalTools = examTools.length;
    const completedCount = completedTools.size;
    const progressPercentage = Math.round((completedCount / totalTools) * 100);
    const isAllCompleted = completedCount >= totalTools * 0.8; // %80 tamamlanırsa yeterli

    // Tamamlandığında
    const handleComplete = () => {
        onCompleted();
    };

    const activeTollData = examTools.find(tool => tool.id === activeTool);

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm text-purple-800 mb-2">
                    <span>Araç Keşfi İlerlemesi</span>
                    <span>{completedCount}/{totalTools} araç denendi</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                {isAllCompleted && (
                    <div className="mt-2 text-sm text-purple-700 font-medium">
                        ✨ Araçları başarıyla keşfettiniz!
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Tool Categories */}
                <div className="lg:col-span-1 space-y-6">
                    {Object.entries(toolsByCategory).map(([category, tools]) => (
                        <div key={category} className="bg-white border rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-4">
                                {categoryNames[category as keyof typeof categoryNames]}
                            </h3>
                            <div className="space-y-2">
                                {tools.map(tool => (
                                    <button
                                        key={tool.id}
                                        onClick={() => handleToolInteraction(tool.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                            activeTool === tool.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : tool.completed
                                                    ? 'border-green-200 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className={`flex-shrink-0 ${
                                            tool.completed
                                                ? 'text-green-600'
                                                : activeTool === tool.id
                                                    ? 'text-blue-600'
                                                    : 'text-gray-400'
                                        }`}>
                                            {tool.completed ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                tool.icon
                                            )}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h4 className={`text-sm font-medium ${
                                                tool.completed ? 'text-green-900' : 'text-gray-900'
                                            }`}>
                                                {tool.name}
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {tool.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Completion Action */}
                    {isAllCompleted && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="text-center">
                                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <h3 className="font-medium text-green-900 mb-2">
                                    Araç Tanıtımı Tamamlandı!
                                </h3>
                                <p className="text-sm text-green-700 mb-4">
                                    Sınav araçlarını başarıyla keşfettiniz. Artık sonraki aşamaya geçebilirsiniz.
                                </p>
                                <button
                                    onClick={handleComplete}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                >
                                    Tamamla
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tool Demo */}
                <div className="lg:col-span-2">
                    {activeTollData && (
                        <div className="bg-white border rounded-lg">
                            {/* Tool Header */}
                            <div className="border-b p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${
                                        activeTollData.completed
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {activeTollData.completed ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            activeTollData.icon
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {activeTollData.name}
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            {activeTollData.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                        activeTollData.category === 'essential' ? 'bg-blue-100 text-blue-800' :
                            activeTollData.category === 'accessibility' ? 'bg-purple-100 text-purple-800' :
                                'bg-orange-100 text-orange-800'
                    }`}>
                      {activeTollData.category === 'essential' ? 'Temel' :
                          activeTollData.category === 'accessibility' ? 'Erişilebilirlik' : 'Gelişmiş'}
                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tool Demo */}
                            <div className="p-6">
                                <div className="mb-6">
                                    {activeTollData.demo}
                                </div>

                                {/* Shortcuts */}
                                {activeTollData.shortcuts && activeTollData.shortcuts.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-900 mb-2">Klavye Kısayolları:</h4>
                                        <div className="flex gap-2">
                                            {activeTollData.shortcuts.map((shortcut, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-mono"
                                                >
                          {shortcut}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tips */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">💡 İpuçları:</h4>
                                    <ul className="space-y-1">
                                        {activeTollData.tips.map((tip, index) => (
                                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                                <span className="text-blue-500 mt-1">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Completion Status */}
                                {activeTollData.completed && (
                                    <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-800">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">Bu aracı başarıyla deneyimlediniz!</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">📌 Nasıl Kullanılır?</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                        <p><strong>1. Araç Seçin:</strong> Sol taraftaki listeden bir araç seçin</p>
                        <p><strong>2. Deneyin:</strong> Sağ taraftaki demo alanında aracı kullanın</p>
                    </div>
                    <div>
                        <p><strong>3. Öğrenin:</strong> İpuçlarını ve klavye kısayollarını okuyun</p>
                        <p><strong>4. Tamamlayın:</strong> Tüm araçları deneyerek eğitimi bitirin</p>
                    </div>
                </div>
            </div>
        </div>
    );
}