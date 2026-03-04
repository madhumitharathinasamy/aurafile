import React from 'react';
import { Icon } from '@/components/ui/Icon';

interface ToolSettingsRendererProps {
    title: string;
    isBatchMode?: boolean;
    applyToAll?: boolean;
    onApplyToAllChange?: (applyToAll: boolean) => void;
    children: React.ReactNode;
}

export function ToolSettingsRenderer({
    title,
    isBatchMode,
    applyToAll = false,
    onApplyToAllChange,
    children
}: ToolSettingsRendererProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-slate-800 font-sans">{title}</h2>

                {isBatchMode && onApplyToAllChange && (
                    <div className="flex items-center bg-[#F1F5F9] p-1 rounded-lg self-start sm:self-auto shrink-0">
                        <button
                            onClick={() => onApplyToAllChange(false)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${!applyToAll ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-muted-foreground hover:text-slate-800'}`}
                        >
                            Active File
                        </button>
                        <button
                            onClick={() => onApplyToAllChange(true)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${applyToAll ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-muted-foreground hover:text-slate-800'}`}
                        >
                            <Icon name="layers" size={14} className={applyToAll ? "text-slate-800" : "text-slate-400"} />
                            All Files
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}

// Reusable tight-typography setting components
export function SettingGroup({ title, children }: { title?: string, children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            {title && <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">{title}</label>}
            <div className="space-y-4 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4">
                {children}
            </div>
        </div>
    );
}

export function SettingRow({ label, value, description, children }: { label: string, value?: React.ReactNode, description?: string, children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-700">{label}</span>
                {value && <span className="font-semibold text-slate-800">{value}</span>}
            </div>
            {children}
            {description && <p className="text-muted-foreground leading-relaxed mt-1">{description}</p>}
        </div>
    );
}

export function ToggleRow({ label, description, checked, onChange }: { label: string, description?: string, checked: boolean, onChange: (checked: boolean) => void }) {
    return (
        <label className="flex items-start justify-between cursor-pointer group">
            <div className="flex flex-col gap-0.5 max-w-[80%] pr-4">
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{label}</span>
                {description && <span className="text-xs text-slate-400 leading-relaxed">{description}</span>}
            </div>
            <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0081C9] focus-visible:ring-offset-2 ${checked ? 'bg-[#0081C9]' : 'bg-slate-300'}`}>
                <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
            </div>
        </label>
    );
}

export function SelectRow({ label, value, options, onChange, disabled }: { label: string, value: string, options: { label: string, value: string }[], onChange: (val: string) => void, disabled?: boolean }) {
    return (
        <div className={`flex items-center justify-between text-sm ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <span className="font-medium text-slate-700">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0081C9] focus:border-[#0081C9] block p-2 shrink-0 outline-none max-w-[150px] shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
