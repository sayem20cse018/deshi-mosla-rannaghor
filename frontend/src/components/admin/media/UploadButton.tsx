'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon, Loader2, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/admin/ui';
import { MediaLibrary } from './MediaLibrary';
import { useUploadMedia, useUploadProgress } from '@/hooks/useMedia';

interface UploadButtonProps {
  value?:       string;
  onChange:     (url: string) => void;
  folder?:      string;
  label?:       string;
  className?:   string;
  aspectRatio?: 'square' | 'wide' | 'tall';
}

const ASPECT: Record<string, string> = {
  square: 'aspect-square',
  wide:   'aspect-video',
  tall:   'aspect-[3/4]',
};

export function UploadButton({
  value,
  onChange,
  folder = 'misc',
  label = 'Upload Image',
  className,
  aspectRatio = 'wide',
}: UploadButtonProps) {
  const [pickerOpen,  setPickerOpen]  = useState(false);
  const [isDragging,  setIsDragging]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { progress, setFileProgress, clearProgress } = useUploadProgress();
  const uploadMut = useUploadMedia(setFileProgress);

  const isUploading = uploadMut.isPending;
  const uploadPct   = Object.values(progress)[0] ?? 0;

  // ── Upload a single file directly ────────────────────────────────────────
  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const res = await uploadMut.mutateAsync({ file, folder });
      onChange(res.data.secureUrl);
    } catch {
      // error handled by mutation
    } finally {
      clearProgress();
    }
  }, [uploadMut, folder, onChange, clearProgress]);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  // ── File input ────────────────────────────────────────────────────────────
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleSelect = (url: string) => { onChange(url); setPickerOpen(false); };
  const handleRemove = (e: React.MouseEvent) => { e.stopPropagation(); onChange(''); };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      <div className={cn('space-y-1.5', className)}>
        {value ? (
          // ── Preview with overlay ────────────────────────────────────────
          <div className={cn('relative rounded-xl overflow-hidden border-2 border-gray-200 group', ASPECT[aspectRatio])}>
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 shadow transition-colors"
              >
                <Upload className="w-3.5 h-3.5" /> Replace
              </button>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 shadow transition-colors"
              >
                <Library className="w-3.5 h-3.5" /> Library
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="w-8 h-8 flex items-center justify-center bg-red-500 rounded-lg text-white hover:bg-red-600 shadow transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          // ── Upload zone ─────────────────────────────────────────────────
          <div
            className={cn(
              'relative w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all cursor-pointer',
              ASPECT[aspectRatio],
              isDragging
                ? 'border-orange-500 bg-orange-50 text-orange-600 scale-[1.01]'
                : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 bg-gray-50 text-gray-400 hover:text-orange-500',
            )}
            onClick={() => !isUploading && inputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {isUploading ? (
              // Upload progress
              <div className="flex flex-col items-center gap-3 w-full px-6">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <div className="w-full">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span className="font-bold">{uploadPct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-200"
                      style={{ width: `${uploadPct}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  {isDragging ? <ImageIcon className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                </div>
                <span className="text-sm font-semibold">{isDragging ? 'Drop to upload' : label}</span>
                <span className="text-xs opacity-60">Drag & drop or click to browse</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPickerOpen(true); }}
                  className="mt-1 text-xs text-orange-500 hover:text-orange-600 font-semibold underline underline-offset-2 transition-colors"
                >
                  Or choose from library
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Media Library picker modal */}
      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Media Library" size="xl">
        <div className="max-h-[72vh] overflow-y-auto -mx-6 -mb-5 px-6 pb-5">
          <MediaLibrary
            mode="picker"
            folder={folder}
            initialFolder={folder}
            onSelect={handleSelect}
            onClose={() => setPickerOpen(false)}
          />
        </div>
      </Modal>
    </>
  );
}
