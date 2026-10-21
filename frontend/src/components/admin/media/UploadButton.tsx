'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/admin/ui';
import { MediaLibrary } from './MediaLibrary';

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
  const [open, setOpen] = useState(false);

  const handleSelect = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <>
      <div className={cn('space-y-1.5', className)}>
        {value ? (
          <div className={cn('relative rounded-xl overflow-hidden border-2 border-gray-200 group', ASPECT[aspectRatio])}>
            <Image
              src={value}
              alt="Selected image"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 400px"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="px-3 py-1.5 bg-white rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow transition-colors"
              >
                Change
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
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              'w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 bg-gray-50 text-gray-400 hover:text-orange-500 transition-all',
              ASPECT[aspectRatio],
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold">{label}</span>
            <span className="text-xs text-gray-400">Click to browse or drop an image</span>
          </button>
        )}
      </div>

      {/* Media picker modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Select Image"
        size="xl"
      >
        <div className="max-h-[70vh] overflow-y-auto -mx-6 -mb-5 px-6 pb-5">
          <MediaLibrary
            mode="picker"
            folder={folder}
            initialFolder={folder}
            onSelect={handleSelect}
            onClose={() => setOpen(false)}
          />
        </div>
      </Modal>
    </>
  );
}
