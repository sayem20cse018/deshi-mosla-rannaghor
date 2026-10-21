'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Upload, Grid, List, Trash2, Edit2, Copy, Check, X,
  Loader2, ImageIcon, FolderOpen, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useMediaList,
  useDeleteMedia,
  useBulkDeleteMedia,
  useUpdateMediaAlt,
  useUploadMedia,
  useUploadProgress,
  MediaFile,
  MediaFilters,
} from '@/hooks/useMedia';
import {
  PageHeader,
  AdminBtn,
  FilterBar,
  Pagination,
  EmptyState,
  LoadingState,
  ErrorState,
  ConfirmDialog,
  Modal,
} from '@/components/admin/ui';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatBytes(bytes: number | null): string {
  if (!bytes) return '-';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function formatDims(w: number | null, h: number | null): string {
  if (!w || !h) return '-';
  return `${w} x ${h}`;
}

const FOLDERS = [
  { value: '',             label: 'All Folders' },
  { value: 'products',     label: 'Products' },
  { value: 'categories',   label: 'Categories' },
  { value: 'brands',       label: 'Brands' },
  { value: 'collections',  label: 'Collections' },
  { value: 'banners',      label: 'Banners' },
  { value: 'blog',         label: 'Blog' },
  { value: 'recipes',      label: 'Recipes' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'misc',         label: 'Misc' },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface MediaLibraryProps {
  mode?:          'page' | 'picker';
  onSelect?:      (url: string, publicId?: string) => void;
  onClose?:       () => void;
  folder?:        string;
  multiple?:      boolean;
  initialFolder?: string;
}

// ---------------------------------------------------------------------------
// CopyBtn
// ---------------------------------------------------------------------------
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      title="Copy URL"
      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/90 hover:bg-white text-gray-600 shadow transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// GridCard
// ---------------------------------------------------------------------------
interface GridCardProps {
  media:       MediaFile;
  selected:    boolean;
  pickerMode:  boolean;
  onToggle:    () => void;
  onPreview:   () => void;
  onSelect?:   () => void;
  onDelete:    () => void;
  onEditAlt:   () => void;
}

function GridCard({
  media, selected, pickerMode, onToggle, onPreview, onSelect, onDelete, onEditAlt,
}: GridCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-2xl border-2 overflow-hidden bg-gray-50 transition-all cursor-pointer',
        selected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-100 hover:border-orange-300',
      )}
      onClick={pickerMode ? onSelect : onPreview}
    >
      {/* Checkbox */}
      {!pickerMode && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={cn(
            'absolute top-2 left-2 z-10 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
            selected
              ? 'bg-orange-500 border-orange-500 text-white'
              : 'bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100',
          )}
        >
          {selected && <Check className="w-3 h-3" />}
        </button>
      )}

      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {media.secureUrl ? (
          <Image
            src={media.secureUrl}
            alt={media.altText ?? media.originalName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-gray-300" />
          </div>
        )}
      </div>

      {/* Overlay actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <CopyBtn text={media.secureUrl} />
        <button
          onClick={(e) => { e.stopPropagation(); onEditAlt(); }}
          title="Edit alt text"
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/90 hover:bg-white text-gray-600 shadow transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        {!pickerMode && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            title="Delete"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/90 hover:bg-red-50 text-red-500 shadow transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="p-2">
        <p className="text-xs font-medium text-gray-700 truncate">{media.originalName}</p>
        <p className="text-xs text-gray-400">{formatBytes(media.bytes)} &bull; {media.format?.toUpperCase()}</p>
      </div>

      {/* Picker select */}
      {pickerMode && (
        <div className="absolute bottom-0 inset-x-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
            className="w-full py-1 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors"
          >
            Select
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// UploadQueue
// ---------------------------------------------------------------------------
interface UploadQueueProps {
  files:    File[];
  progress: Record<string, number>;
}

function UploadQueue({ files, progress }: UploadQueueProps) {
  if (!files.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2 shadow-sm">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Uploading...</p>
      {files.map((f) => {
        const pct = progress[f.name] ?? 0;
        return (
          <div key={f.name} className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span className="truncate max-w-[200px]">{f.name}</span>
              <span className="font-semibold">{pct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-200"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AltTextModal
// ---------------------------------------------------------------------------
interface AltTextModalProps {
  open:    boolean;
  media:   MediaFile | null;
  onClose: () => void;
}

function AltTextModal({ open, media, onClose }: AltTextModalProps) {
  const [value, setValue] = useState('');
  const updateAlt = useUpdateMediaAlt();

  useEffect(() => {
    if (media) setValue(media.altText ?? '');
  }, [media]);

  const save = async () => {
    if (!media) return;
    await updateAlt.mutateAsync({ id: media.id, altText: value });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Alt Text" size="sm">
      <div className="space-y-4">
        {media && (
          <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={media.secureUrl}
              alt={media.altText ?? media.originalName}
              fill
              className="object-contain"
              sizes="400px"
            />
          </div>
        )}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            Alt Text
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe the image..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={updateAlt.isPending}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
          >
            {updateAlt.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// PreviewModal
// ---------------------------------------------------------------------------
interface PreviewModalProps {
  open:    boolean;
  media:   MediaFile | null;
  onClose: () => void;
  onEdit:  () => void;
}

function PreviewModal({ open, media, onClose, onEdit }: PreviewModalProps) {
  if (!media) return null;
  return (
    <Modal open={open} onClose={onClose} title={media.originalName} size="xl">
      <div className="space-y-4">
        <div className="relative w-full h-72 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={media.secureUrl}
            alt={media.altText ?? media.originalName}
            fill
            className="object-contain"
            sizes="640px"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Format',     value: media.format?.toUpperCase() ?? '-' },
            { label: 'Size',       value: formatBytes(media.bytes) },
            { label: 'Dimensions', value: formatDims(media.width, media.height) },
            { label: 'Folder',     value: media.folder ?? '-' },
            { label: 'Uploaded by',value: media.uploadedBy ?? '-' },
            { label: 'Alt text',   value: media.altText ?? '-' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-gray-700 font-semibold truncate">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 overflow-hidden">
            <span className="text-xs text-gray-500 truncate flex-1">{media.secureUrl}</span>
            <CopyBtn text={media.secureUrl} />
          </div>
          <AdminBtn variant="secondary" icon={<Edit2 className="w-4 h-4" />} onClick={onEdit}>
            Edit Alt
          </AdminBtn>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// FolderDropdown
// ---------------------------------------------------------------------------
interface FolderDropdownProps {
  value:    string;
  onChange: (v: string) => void;
}

function FolderDropdown({ value, onChange }: FolderDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = FOLDERS.find((f) => f.value === value) ?? FOLDERS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors shadow-sm"
      >
        <FolderOpen className="w-4 h-4" />
        {selected.label}
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1">
            {FOLDERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { onChange(f.value); setOpen(false); }}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors',
                  f.value === value ? 'font-bold text-orange-600 bg-orange-50' : 'text-gray-700',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main MediaLibrary
// ---------------------------------------------------------------------------
export function MediaLibrary({
  mode = 'page',
  onSelect,
  onClose,
  folder: forcedFolder,
  initialFolder = '',
}: MediaLibraryProps) {
  const [filters, setFilters]           = useState<MediaFilters>({ page: 1, limit: 24, folder: initialFolder });
  const [search, setSearch]             = useState('');
  const [selectedFolder, setSelectedFolder] = useState(initialFolder);
  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('grid');
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set());
  const [uploadQueue, setUploadQueue]   = useState<File[]>([]);
  const [isDragging, setIsDragging]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
  const [editAltMedia, setEditAltMedia] = useState<MediaFile | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const { progress, setFileProgress, clearProgress } = useUploadProgress();
  const uploadMut    = useUploadMedia(setFileProgress);
  const bulkUpload   = useUploadMedia(setFileProgress);
  const deleteMedia  = useDeleteMedia();
  const bulkDelete   = useBulkDeleteMedia();

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, search: search || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      folder: forcedFolder ?? (selectedFolder || undefined),
      page: 1,
    }));
  }, [selectedFolder, forcedFolder]);

  const { data, isLoading, isError, refetch } = useMediaList(filters);
  const media     = data?.data ?? [];
  const meta      = data?.meta;

  // ---------------------------------------------------------------------------
  // Upload helpers
  // ---------------------------------------------------------------------------
  const handleFiles = useCallback(
    async (files: File[]) => {
      const images = files.filter((f) => f.type.startsWith('image/'));
      if (!images.length) return;
      setUploadQueue(images);
      const folder = forcedFolder ?? selectedFolder ?? 'misc';
      for (const f of images) {
        try {
          await uploadMut.mutateAsync({ file: f, folder });
        } catch {}
      }
      clearProgress();
      setUploadQueue([]);
    },
    [forcedFolder, selectedFolder, uploadMut, clearProgress],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const onBrowse = () => inputRef.current?.click();

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  // ---------------------------------------------------------------------------
  // Selection
  // ---------------------------------------------------------------------------
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(media.map((m) => m.id)));
  };

  const clearSelection = () => setSelectedIds(new Set());

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMedia.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const confirmBulkDelete = async () => {
    await bulkDelete.mutateAsync(Array.from(selectedIds));
    clearSelection();
    setBulkDeleteOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  const isUploading = uploadMut.isPending || bulkUpload.isPending;

  return (
    <div
      className={cn('space-y-4', isDragging && 'ring-2 ring-orange-400 ring-offset-2 rounded-2xl')}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={onFileInputChange}
      />

      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-orange-500/10 border-4 border-dashed border-orange-400 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl text-center">
            <Upload className="w-10 h-10 text-orange-500 mx-auto mb-2" />
            <p className="text-lg font-black text-gray-900">Drop images to upload</p>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[180px]">
          <FilterBar
            search={search}
            onSearch={setSearch}
            placeholder="Search images..."
          >
            {!forcedFolder && (
              <FolderDropdown value={selectedFolder} onChange={setSelectedFolder} />
            )}
          </FilterBar>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
                viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600',
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
                viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600',
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Upload button */}
          <AdminBtn
            icon={isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            loading={isUploading}
            onClick={onBrowse}
          >
            Upload
          </AdminBtn>

          {/* Close button in picker mode */}
          {mode === 'picker' && onClose && (
            <AdminBtn variant="ghost" icon={<X className="w-4 h-4" />} onClick={onClose} />
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5">
          <span className="text-sm font-semibold text-orange-700">
            {selectedIds.size} selected
          </span>
          <button
            onClick={selectAll}
            className="text-xs text-orange-600 hover:text-orange-800 font-semibold"
          >
            Select All
          </button>
          <button
            onClick={clearSelection}
            className="text-xs text-gray-500 hover:text-gray-700 font-semibold"
          >
            Clear
          </button>
          <div className="flex-1" />
          <AdminBtn
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => setBulkDeleteOpen(true)}
          >
            Delete {selectedIds.size}
          </AdminBtn>
        </div>
      )}

      {/* Upload queue progress */}
      {uploadQueue.length > 0 && (
        <UploadQueue files={uploadQueue} progress={progress} />
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingState message="Loading media..." />
      ) : isError ? (
        <ErrorState message="Failed to load media." onRetry={refetch} />
      ) : media.length === 0 ? (
        <EmptyState
          title="No images found"
          description="Upload images by clicking the Upload button or dragging files here."
          icon={<ImageIcon className="w-8 h-8 text-gray-300" />}
          action={
            <AdminBtn icon={<Upload className="w-4 h-4" />} onClick={onBrowse}>
              Upload Images
            </AdminBtn>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {media.map((m) => (
            <GridCard
              key={m.id}
              media={m}
              selected={selectedIds.has(m.id)}
              pickerMode={mode === 'picker'}
              onToggle={() => toggleSelect(m.id)}
              onPreview={() => setPreviewMedia(m)}
              onSelect={() => onSelect?.(m.secureUrl, m.publicId)}
              onDelete={() => setDeleteTarget(m)}
              onEditAlt={() => setEditAltMedia(m)}
            />
          ))}
        </div>
      ) : (
        // List view
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm bg-white">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {mode !== 'picker' && (
                  <th className="w-8 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === media.length && media.length > 0}
                      onChange={selectedIds.size === media.length ? clearSelection : selectAll}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-300"
                    />
                  </th>
                )}
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Image</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Size</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Dimensions</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Format</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Folder</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {media.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                  {mode !== 'picker' && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(m.id)}
                        onChange={() => toggleSelect(m.id)}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-300"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div
                      className="relative w-12 h-10 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => mode === 'picker' ? onSelect?.(m.secureUrl, m.publicId) : setPreviewMedia(m)}
                    >
                      {m.secureUrl && (
                        <Image
                          src={m.secureUrl}
                          alt={m.altText ?? m.originalName}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[160px]">
                    <p className="font-medium truncate">{m.originalName}</p>
                    {m.altText && <p className="text-xs text-gray-400 truncate">{m.altText}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatBytes(m.bytes)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDims(m.width, m.height)}</td>
                  <td className="px-4 py-3 text-gray-500 uppercase text-xs font-semibold">{m.format ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{m.folder ?? '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <CopyBtn text={m.secureUrl} />
                      <button
                        onClick={() => setEditAltMedia(m)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {mode === 'picker' ? (
                        <button
                          onClick={() => onSelect?.(m.secureUrl, m.publicId)}
                          className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
                        >
                          Select
                        </button>
                      ) : (
                        <button
                          onClick={() => setDeleteTarget(m)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Image"
        message={`Are you sure you want to delete "${deleteTarget?.originalName}"? This action cannot be undone.`}
        loading={deleteMedia.isPending}
        danger
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Selected"
        message={`Delete ${selectedIds.size} selected images? This cannot be undone.`}
        loading={bulkDelete.isPending}
        danger
      />

      {/* Preview modal */}
      <PreviewModal
        open={!!previewMedia}
        media={previewMedia}
        onClose={() => setPreviewMedia(null)}
        onEdit={() => { setEditAltMedia(previewMedia); setPreviewMedia(null); }}
      />

      {/* Alt text modal */}
      <AltTextModal
        open={!!editAltMedia}
        media={editAltMedia}
        onClose={() => setEditAltMedia(null)}
      />
    </div>
  );
}
