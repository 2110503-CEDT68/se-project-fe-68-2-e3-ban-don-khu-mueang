type ShopImageUrlDialogProps = {
  isOpen: boolean;
  draftUrl: string;
  editingIndex: number | null;
  dialogError: string | null;
  onClose: () => void;
  onSave: () => void;
  onDraftChange: (value: string) => void;
};

export default function ShopImageUrlDialog({
  isOpen,
  draftUrl,
  editingIndex,
  dialogError,
  onClose,
  onSave,
  onDraftChange,
}: ShopImageUrlDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h4 className="text-lg font-headline text-on-surface">
            {editingIndex === null ? "Add Image URL" : "Edit Image URL"}
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-outline-variant/30 px-3 py-1 text-xs text-on-surface-variant"
          >
            Close
          </button>
        </div>

        {dialogError ? (
          <div className="mb-3 rounded-xl border border-error/20 bg-error-container/40 px-4 py-3 text-sm text-on-error-container">
            {dialogError}
          </div>
        ) : null}

        <label className="block text-sm font-medium text-on-surface-variant">
          Image URL
          <input
            autoFocus
            type="url"
            value={draftUrl}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder="https://placehold.co/600x400?text=No+Image"
            className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface"
          />
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-outline-variant/30 px-5 py-2 text-sm text-on-surface-variant"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            {editingIndex === null ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
