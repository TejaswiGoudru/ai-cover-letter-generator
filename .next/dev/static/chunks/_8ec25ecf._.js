(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/llm.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateCoverLetter",
    ()=>generateCoverLetter,
    "getAvailableModels",
    ()=>getAvailableModels
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
async function getAvailableModels() {
    try {
        const response = await fetch(`${API_URL}/models`);
        if (!response.ok) throw new Error('Failed to fetch models');
        return await response.json();
    } catch (error) {
        console.error("Error fetching models:", error);
        return [];
    }
}
async function generateCoverLetter(promptData) {
    try {
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(promptData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate cover letter');
        }
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("Generation Error:", error);
        throw new Error(error.message || 'Failed to generate cover letter. Make sure the backend API and Ollama are running.');
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/pdf.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "downloadPDF",
    ()=>downloadPDF
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
;
function downloadPDF(content, fileName = "Cover_Letter.pdf") {
    // Basic HTML to plain text conversion to preserve structure in PDF
    const plainText = content.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<\/div>/gi, '\n').replace(/<li>/gi, '• ').replace(/<\/li>/gi, '\n').replace(/<[^>]+>/g, '') // Strip remaining tags
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
    const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
    // PDF Settings
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 2 * margin;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(33, 33, 33);
    // Split text into lines that fit the width
    const splitText = doc.splitTextToSize(plainText, contentWidth);
    // Add text to document
    doc.text(splitText, margin, margin + 10);
    // Save the PDF
    doc.save(fileName);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/CoverLetterForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CoverLetterForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$llm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/llm.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pdf$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pdf.ts [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/react-quill-new/lib/index.js [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/react-quill-new/lib/index.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "textarea",
            style: {
                minHeight: '500px'
            },
            children: "Loading editor..."
        }, void 0, false, {
            fileName: "[project]/components/CoverLetterForm.tsx",
            lineNumber: 11,
            columnNumber: 20
        }, ("TURBOPACK compile-time value", void 0))
});
_c = ReactQuill;
;
function CoverLetterForm() {
    _s();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        companyName: '',
        role: '',
        jobDescription: '',
        resumeInfo: '',
        model: '',
        userName: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [availableModels, setAvailableModels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoverLetterForm.useEffect": ()=>{
            async function fetchModels() {
                const models = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$llm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvailableModels"])();
                setAvailableModels(models);
                if (models.length > 0) {
                    // Prefer llama3.2 if available, otherwise first one
                    const defaultModel = models.includes('llama3.2:latest') ? 'llama3.2:latest' : models[0];
                    setFormData({
                        "CoverLetterForm.useEffect.fetchModels": (prev)=>({
                                ...prev,
                                model: defaultModel
                            })
                    }["CoverLetterForm.useEffect.fetchModels"]);
                }
            }
            fetchModels();
        }
    }["CoverLetterForm.useEffect"], []);
    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleGenerate = async (e)=>{
        e.preventDefault();
        if (!formData.model) {
            setError('Please select an Ollama model. If none appear, ensure Ollama is running.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const text = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$llm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateCoverLetter"])(formData);
            // Convert plain text to basic HTML for the editor
            const htmlText = text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>');
            setResult(`<p>${htmlText}</p>`);
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally{
            setLoading(false);
        }
    };
    const handleManualMode = ()=>{
        setResult('<p><br></p>');
    };
    const handleDownload = ()=>{
        if (result) {
            const fileName = `${formData.companyName.replace(/\s+/g, '_') || 'My'}_Cover_Letter.pdf`;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pdf$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["downloadPDF"])(result, fileName);
        }
    };
    const quillModules = {
        toolbar: [
            [
                {
                    'header': [
                        1,
                        2,
                        false
                    ]
                }
            ],
            [
                'bold',
                'italic',
                'underline',
                'strike',
                'blockquote'
            ],
            [
                {
                    'list': 'ordered'
                },
                {
                    'list': 'bullet'
                },
                {
                    'indent': '-1'
                },
                {
                    'indent': '+1'
                }
            ],
            [
                'link'
            ],
            [
                'clean'
            ]
        ]
    };
    const quillFormats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link'
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-9c088fa609496641" + " " + "animate-fade-in",
        children: [
            !result ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleGenerate,
                style: {
                    padding: '32px',
                    maxWidth: '800px',
                    margin: '0 auto'
                },
                className: "jsx-9c088fa609496641" + " " + "glass",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        },
                        className: "jsx-9c088fa609496641",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "jsx-9c088fa609496641",
                                children: "Generator Details"
                            }, void 0, false, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 99,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleManualMode,
                                style: {
                                    background: 'var(--glass-border)',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    border: 'none'
                                },
                                className: "jsx-9c088fa609496641" + " " + "label",
                                children: "Write Manually"
                            }, void 0, false, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 100,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CoverLetterForm.tsx",
                        lineNumber: 98,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9c088fa609496641" + " " + "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "jsx-9c088fa609496641" + " " + "label",
                                children: "Ollama Model"
                            }, void 0, false, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 106,
                                columnNumber: 25
                            }, this),
                            availableModels.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                name: "model",
                                value: formData.model,
                                onChange: handleInputChange,
                                required: true,
                                className: "jsx-9c088fa609496641" + " " + "input",
                                children: availableModels.map((model)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: model,
                                        className: "jsx-9c088fa609496641",
                                        children: model
                                    }, model, false, {
                                        fileName: "[project]/components/CoverLetterForm.tsx",
                                        lineNumber: 116,
                                        columnNumber: 37
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 108,
                                columnNumber: 29
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "model",
                                placeholder: "Loading models or enter manually...",
                                value: formData.model,
                                onChange: handleInputChange,
                                required: true,
                                className: "jsx-9c088fa609496641" + " " + "input"
                            }, void 0, false, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 120,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    marginTop: '4px'
                                },
                                className: "jsx-9c088fa609496641",
                                children: "Showing installed models from your local Ollama instance."
                            }, void 0, false, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 129,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CoverLetterForm.tsx",
                        lineNumber: 105,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px'
                        },
                        className: "jsx-9c088fa609496641",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9c088fa609496641" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "jsx-9c088fa609496641" + " " + "label",
                                        children: "Your Name"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoverLetterForm.tsx",
                                        lineNumber: 136,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        name: "userName",
                                        placeholder: "e.g. John Doe",
                                        value: formData.userName,
                                        onChange: handleInputChange,
                                        required: true,
                                        className: "jsx-9c088fa609496641" + " " + "input"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoverLetterForm.tsx",
                                        lineNumber: 137,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 135,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9c088fa609496641" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "jsx-9c088fa609496641" + " " + "label",
                                        children: "Application Date"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoverLetterForm.tsx",
                                        lineNumber: 147,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        name: "date",
                                        type: "date",
                                        value: formData.date,
                                        onChange: handleInputChange,
                                        required: true,
                                        className: "jsx-9c088fa609496641" + " " + "input"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoverLetterForm.tsx",
                                        lineNumber: 148,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 146,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CoverLetterForm.tsx",
                        lineNumber: 134,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px'
                        },
                        className: "jsx-9c088fa609496641",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9c088fa609496641" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "jsx-9c088fa609496641" + " " + "label",
                                        children: "Company Name"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoverLetterForm.tsx",
                                        lineNumber: 161,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        name: "companyName",
                                        placeholder: "e.g. Google",
                                        value: formData.companyName,
                                        onChange: handleInputChange,
                                        required: true,
                                        className: "jsx-9c088fa609496641" + " " + "input"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoverLetterForm.tsx",
                                        lineNumber: 162,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 160,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9c088fa609496641" + " " + "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "jsx-9c088fa609496641" + " " + "label",
                                        children: "Target Role"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoverLetterForm.tsx",
                                        lineNumber: 172,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        name: "role",
                                        placeholder: "e.g. Software Engineer",
                                        value: formData.role,
                                        onChange: handleInputChange,
                                        required: true,
                                        className: "jsx-9c088fa609496641" + " " + "input"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoverLetterForm.tsx",
                                        lineNumber: 173,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 171,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CoverLetterForm.tsx",
                        lineNumber: 159,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9c088fa609496641" + " " + "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "jsx-9c088fa609496641" + " " + "label",
                                children: "Job Description"
                            }, void 0, false, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 185,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                name: "jobDescription",
                                placeholder: "Paste the job description here...",
                                value: formData.jobDescription,
                                onChange: handleInputChange,
                                required: true,
                                className: "jsx-9c088fa609496641" + " " + "textarea"
                            }, void 0, false, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 186,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CoverLetterForm.tsx",
                        lineNumber: 184,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9c088fa609496641" + " " + "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "jsx-9c088fa609496641" + " " + "label",
                                children: "Your Resume / Key Skills"
                            }, void 0, false, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 197,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                name: "resumeInfo",
                                placeholder: "Paste your resume content or key experience here...",
                                value: formData.resumeInfo,
                                onChange: handleInputChange,
                                required: true,
                                className: "jsx-9c088fa609496641" + " " + "textarea"
                            }, void 0, false, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 198,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CoverLetterForm.tsx",
                        lineNumber: 196,
                        columnNumber: 21
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: '#ef4444',
                            marginBottom: '16px'
                        },
                        className: "jsx-9c088fa609496641",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/CoverLetterForm.tsx",
                        lineNumber: 208,
                        columnNumber: 31
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        style: {
                            width: '100%'
                        },
                        disabled: loading,
                        className: "jsx-9c088fa609496641" + " " + "btn-primary",
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-9c088fa609496641" + " " + "spin-loader"
                                }, void 0, false, {
                                    fileName: "[project]/components/CoverLetterForm.tsx",
                                    lineNumber: 213,
                                    columnNumber: 33
                                }, this),
                                "Generating..."
                            ]
                        }, void 0, true) : 'Generate Cover Letter'
                    }, void 0, false, {
                        fileName: "[project]/components/CoverLetterForm.tsx",
                        lineNumber: 210,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CoverLetterForm.tsx",
                lineNumber: 97,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '32px',
                    maxWidth: '1000px',
                    margin: '0 auto'
                },
                className: "jsx-9c088fa609496641" + " " + "glass",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        },
                        className: "jsx-9c088fa609496641",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "jsx-9c088fa609496641",
                                children: "Your Cover Letter"
                            }, void 0, false, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 222,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '12px'
                                },
                                className: "jsx-9c088fa609496641",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setResult(''),
                                        style: {
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer'
                                        },
                                        className: "jsx-9c088fa609496641" + " " + "label",
                                        children: "Edit Info"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoverLetterForm.tsx",
                                        lineNumber: 224,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleDownload,
                                        className: "jsx-9c088fa609496641" + " " + "btn-primary",
                                        children: "Download PDF"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoverLetterForm.tsx",
                                        lineNumber: 225,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CoverLetterForm.tsx",
                                lineNumber: 223,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CoverLetterForm.tsx",
                        lineNumber: 221,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: 'white',
                            borderRadius: '8px',
                            minHeight: '600px',
                            color: 'black'
                        },
                        className: "jsx-9c088fa609496641" + " " + "quill-wrapper",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactQuill, {
                            theme: "snow",
                            value: result,
                            onChange: setResult,
                            modules: quillModules,
                            formats: quillFormats,
                            style: {
                                height: '550px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/CoverLetterForm.tsx",
                            lineNumber: 229,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/CoverLetterForm.tsx",
                        lineNumber: 228,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CoverLetterForm.tsx",
                lineNumber: 220,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "9c088fa609496641",
                children: ".ql-container{color:#000;background:#fff;border-bottom-right-radius:8px;border-bottom-left-radius:8px;font-size:16px}.ql-toolbar{background:#f3f4f6;border-top-left-radius:8px;border-top-right-radius:8px}.ql-editor{min-height:500px}.spin-loader{border:2px solid #fff;border-top-color:#0000;border-radius:50%;width:16px;height:16px;margin-right:8px;animation:1s linear infinite spin;display:inline-block}@keyframes spin{to{transform:rotate(360deg)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CoverLetterForm.tsx",
        lineNumber: 95,
        columnNumber: 9
    }, this);
}
_s(CoverLetterForm, "d2YoPfkNIt/BymO/mew9s0PCbFU=");
_c1 = CoverLetterForm;
var _c, _c1;
__turbopack_context__.k.register(_c, "ReactQuill");
__turbopack_context__.k.register(_c1, "CoverLetterForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_8ec25ecf._.js.map