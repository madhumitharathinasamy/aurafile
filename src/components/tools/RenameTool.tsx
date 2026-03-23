"use client";

import { useState, useMemo, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ToolModal } from "@/components/modal/ToolModal";
import { Icon } from "@/components/ui/Icon";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";
import {
  ToolSettingsRenderer,
  SettingGroup,
  ToggleRow,
  SelectRow,
} from "@/components/tools/ToolSettingsRenderer";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RenameSettings {
  prefix: string;
  suffix: string;
  caseFormat: "none" | "lowercase" | "uppercase";
  findText: string;
  replaceText: string;
  addNumber: boolean;
  startNumber: number;
  separator: string;
  removeOriginalName: boolean;
}

const DEFAULT_SETTINGS: RenameSettings = {
  prefix: "",
  suffix: "",
  caseFormat: "none",
  findText: "",
  replaceText: "",
  addNumber: false,
  startNumber: 1,
  separator: "-",
  removeOriginalName: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTypeName(file: File): string {
  const t = file.type;
  if (t.startsWith("image/")) return "IMG";
  if (t === "application/pdf") return "DOC";
  if (t.startsWith("video/")) return "VID";
  if (t.startsWith("audio/")) return "AUD";
  if (t.includes("word") || t.includes("document")) return "DOC";
  if (t.includes("spreadsheet") || t.includes("excel")) return "SHEET";
  return "FILE";
}

/** Returns a file-type icon name from icon.tsx */
function getFileIconName(file: File): string {
  const t = file.type;
  if (t.startsWith("image/")) return "image";
  if (t === "application/pdf" || t.includes("pdf")) return "file-text";
  if (t.startsWith("video/")) return "file-image";
  if (t.startsWith("audio/")) return "file-image";
  if (t.includes("word") || t.includes("document")) return "file-text";
  if (t.includes("spreadsheet") || t.includes("excel")) return "file-text";
  if (t.includes("zip") || t.includes("archive")) return "folder";
  return "file-plus";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function computeNewName(
  file: File,
  settings: RenameSettings,
  index: number
): string {
  const lastDot = file.name.lastIndexOf(".");
  const ext = lastDot !== -1 ? file.name.substring(lastDot) : "";
  const originalBase = lastDot !== -1 ? file.name.substring(0, lastDot) : file.name;

  let base: string;

  if (settings.removeOriginalName) {
    // Start fresh — use prefix/suffix as name if set, otherwise type name
    if (settings.prefix || settings.suffix) {
      base = ""; // prefix/suffix will wrap nothing
    } else {
      base = getTypeName(file);
    }
  } else {
    base = originalBase;
    if (settings.findText) {
      base = base.split(settings.findText).join(settings.replaceText);
    }
  }

  // Numbering
  if (settings.addNumber) {
    const num = settings.startNumber + index;
    base = settings.removeOriginalName && !base
      ? `${num}`
      : `${base}${settings.separator}${num}`;
  }

  let finalBase = `${settings.prefix}${base}${settings.suffix}`;

  // Double-safety fallback
  if (!finalBase.trim()) finalBase = originalBase;

  // Case
  if (settings.caseFormat === "lowercase") finalBase = finalBase.toLowerCase();
  else if (settings.caseFormat === "uppercase") finalBase = finalBase.toUpperCase();

  return `${finalBase}${ext}`;
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────

function AllFilesDropzone({ onUpload }: { onUpload: (files: File[]) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => {
      if (accepted.length > 0) onUpload(accepted);
    },
    // No accept restriction — all file types welcome
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center gap-4 p-10 md:p-14 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-[#00B4D8] bg-[#00B4D8]/5 shadow-[inset_0_0_30px_rgba(0,180,216,0.05)] scale-[1.01]"
            : "border-slate-300 hover:border-[#00B4D8] hover:bg-[#00B4D8]/10 bg-slate-50 shadow-inner"
        }`}
      >
        <input {...getInputProps()} />

        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            isDragActive ? "bg-[#00B4D8] text-white animate-pulse" : "bg-white text-[#00B4D8]"
          }`}
        >
          <Icon name="folder" size={28} />
        </div>

        <div className="text-center">
          <p className="text-slate-600 font-bold text-lg md:text-xl tracking-tight">
            Drag &amp; drop any files here
          </p>
          <p className="text-slate-500 mt-1.5 text-sm">
            or{" "}
            <span className="text-[#00B4D8] font-medium px-1 rounded hover:bg-[#00B4D8]/10 transition-colors">
              click to browse
            </span>{" "}
            files
          </p>
        </div>

        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">
          Images • PDFs • Documents • Videos • Any file type
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mt-4 pt-4 border-t border-slate-200/60 w-full max-w-sm">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Icon name="shield-check" size={16} className="text-emerald-500" />
            100% Private
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200" />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Icon name="cpu" size={16} className="text-[#00B4D8]" />
            Browser-Only Processing
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RenameTool() {
  const {
    files,
    activeIndex,
    setActiveIndex,
    activeFile,
    addFiles,
    clearAll,
    updateFileSettings,
    updateAllFileSettings,
    isBatchMode,
  } = useFileUpload([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [applyToAll, setApplyToAll] = useState(true);

  const handleUpload = useCallback(
    (uploaded: File[]) => {
      addFiles(uploaded, { ...DEFAULT_SETTINGS });
    },
    [addFiles]
  );

  const activeSettings: RenameSettings = activeFile?.settings ?? DEFAULT_SETTINGS;

  const handleSettingChange = <K extends keyof RenameSettings>(
    key: K,
    value: RenameSettings[K]
  ) => {
    if (!activeFile) return;
    if (applyToAll && isBatchMode) {
      updateAllFileSettings({ [key]: value });
    } else {
      updateFileSettings(activeFile.id, { [key]: value });
    }
  };

  // Derive preview names
  const previewFiles = useMemo(() => {
    if (!files.length) return [];
    // When applyToAll, use first file's settings as the reference for everyone
    const refSettings: RenameSettings =
      applyToAll && files[0] ? files[0].settings ?? DEFAULT_SETTINGS : DEFAULT_SETTINGS;

    return files.map((f, i) => {
      const settings = applyToAll ? refSettings : (f.settings ?? DEFAULT_SETTINGS);
      return {
        ...f,
        newName: computeNewName(f.file, settings, i),
        isImage: f.file.type.startsWith("image/"),
      };
    });
  }, [files, applyToAll]);

  const handleDownloadZip = async () => {
    if (!previewFiles.length) return;
    setIsProcessing(true);
    try {
      const zip = new JSZip();
      previewFiles.forEach((f) => zip.file(f.newName, f.file));
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "renamed_files.zip");
      toast.success(`${previewFiles.length} file${previewFiles.length > 1 ? "s" : ""} downloaded as ZIP!`);
    } catch {
      toast.error("Failed to create ZIP file.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Custom left-pane: file list with preview/icon + name mapping ─────────
  const previewPane = (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#e3e7e9]">
      {/* Header bar */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <p className="text-sm font-bold text-slate-800">
          {previewFiles.length} file{previewFiles.length !== 1 ? "s" : ""}
          <span className="font-normal text-slate-500"> · rename preview</span>
        </p>
        <span className="text-xs font-medium text-[#0081C9] bg-blue-50 px-2 py-1 rounded-full">
          Live Preview
        </span>
      </div>

      {/* Scrollable file list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {previewFiles.map((f, i) => {
          const isActive = i === activeIndex;
          const changed = f.newName !== f.file.name;

          return (
            <div
              key={f.id}
              onClick={() => setActiveIndex(i)}
              className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 cursor-pointer transition-all ${
                isActive
                  ? "ring-2 ring-[#0081C9] border-transparent shadow-sm"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              {/* Thumbnail or icon */}
              <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                {f.isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.previewUrl}
                    alt={f.file.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Icon name={getFileIconName(f.file)} size={20} className="text-slate-400" />
                )}
              </div>

              {/* Names */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 truncate" title={f.file.name}>
                  {f.file.name}
                </p>
                <p
                  className={`text-sm font-semibold truncate mt-0.5 ${
                    changed ? "text-[#0081C9]" : "text-slate-400 italic"
                  }`}
                  title={f.newName}
                >
                  {changed ? `→ ${f.newName}` : "unchanged"}
                </p>
              </div>

              {/* Size badge */}
              <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap shrink-0">
                {formatFileSize(f.file.size)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-8">
      {/* ── Upload State ── */}
      {files.length === 0 && (
        <div className="mt-6 w-full max-w-7xl mx-auto">
          <div className="rounded-2xl border border-border bg-surface shadow-xl p-4 md:p-8 backdrop-blur-sm">
            <AllFilesDropzone onUpload={handleUpload} />
          </div>
        </div>
      )}

      {/* ── Tool Modal ── */}
      <ToolModal
        isOpen={files.length > 0}
        onClose={clearAll}
        title="Rename Files"
        files={files}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        onPrimaryAction={handleDownloadZip}
        primaryActionText={
          <span className="flex items-center justify-center gap-2">
            <Icon name="download" size={18} />
            {files.length > 1
              ? `Download All ${files.length} as ZIP`
              : "Download Renamed File"}
          </span>
        }
        isProcessing={isProcessing}
        customPreview={previewPane}
      >
        {/* ── Sidebar Settings ── */}
        {activeFile && (
          <ToolSettingsRenderer
            title="Rename Settings"
            isBatchMode={isBatchMode}
            applyToAll={applyToAll}
            onApplyToAllChange={setApplyToAll}
          >
            {/* Current file summary */}
            <div className="bg-[#E8ECEF] rounded-xl p-4 space-y-1.5 shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">Original</span>
                <span
                  className="text-sm font-bold text-slate-800 truncate"
                  title={activeFile.file.name}
                >
                  {activeFile.file.name}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-t border-slate-300/50 pt-1.5">
                <span className="text-xs font-medium text-[#0081C9]">New Name</span>
                <span
                  className="text-sm font-bold text-slate-800 truncate"
                  title={computeNewName(activeFile.file, activeSettings, activeIndex)}
                >
                  {computeNewName(activeFile.file, activeSettings, activeIndex)}
                </span>
              </div>
            </div>

            {/* Base name mode */}
            <SettingGroup title="Base Name">
              <ToggleRow
                label="Remove Original Name"
                description="Replace with auto-name: IMG_1, DOC_2, FILE_3…"
                checked={activeSettings.removeOriginalName}
                onChange={(val) => handleSettingChange("removeOriginalName", val)}
              />
            </SettingGroup>

            {/* Prefix / Suffix */}
            <SettingGroup title="Prefix & Suffix">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Prefix
                  </label>
                  <input
                    type="text"
                    value={activeSettings.prefix}
                    onChange={(e) => handleSettingChange("prefix", e.target.value)}
                    placeholder="e.g. product_"
                    className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0081C9] focus:border-[#0081C9] block p-2 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={activeSettings.suffix}
                    onChange={(e) => handleSettingChange("suffix", e.target.value)}
                    placeholder="e.g. _v2"
                    className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0081C9] focus:border-[#0081C9] block p-2 outline-none shadow-sm"
                  />
                </div>
              </div>
            </SettingGroup>

            {/* Case format */}
            <SettingGroup title="Case Format">
              <SelectRow
                label="Text Case"
                value={activeSettings.caseFormat}
                onChange={(val) =>
                  handleSettingChange("caseFormat", val as RenameSettings["caseFormat"])
                }
                options={[
                  { label: "Original Case", value: "none" },
                  { label: "lowercase", value: "lowercase" },
                  { label: "UPPERCASE", value: "uppercase" },
                ]}
              />
            </SettingGroup>

            {/* Find & Replace — hidden when original name is removed */}
            {!activeSettings.removeOriginalName && (
              <SettingGroup title="Find & Replace">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Find text
                    </label>
                    <input
                      type="text"
                      value={activeSettings.findText}
                      onChange={(e) => handleSettingChange("findText", e.target.value)}
                      placeholder="Text to find"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0081C9] focus:border-[#0081C9] block p-2 outline-none shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Replace with
                    </label>
                    <input
                      type="text"
                      value={activeSettings.replaceText}
                      onChange={(e) => handleSettingChange("replaceText", e.target.value)}
                      placeholder="Replacement text"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0081C9] focus:border-[#0081C9] block p-2 outline-none shadow-sm"
                    />
                  </div>
                </div>
              </SettingGroup>
            )}

            {/* Numbering */}
            <SettingGroup title="Sequential Numbering">
              <ToggleRow
                label="Add Numbers"
                description="Append incrementing numbers to filenames"
                checked={activeSettings.addNumber}
                onChange={(val) => handleSettingChange("addNumber", val)}
              />

              {activeSettings.addNumber && (
                <div className="flex gap-3 pt-2">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Start at
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={activeSettings.startNumber}
                      onChange={(e) =>
                        handleSettingChange("startNumber", parseInt(e.target.value) || 0)
                      }
                      className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0081C9] focus:border-[#0081C9] block p-2 outline-none shadow-sm"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Separator
                    </label>
                    <input
                      type="text"
                      value={activeSettings.separator}
                      onChange={(e) => handleSettingChange("separator", e.target.value)}
                      placeholder="-"
                      className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-[#0081C9] focus:border-[#0081C9] block p-2 outline-none shadow-sm text-center"
                    />
                  </div>
                </div>
              )}
            </SettingGroup>
          </ToolSettingsRenderer>
        )}
      </ToolModal>
    </div>
  );
}
