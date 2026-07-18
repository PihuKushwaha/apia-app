// Module 12 - Print Center. Shows draft, asks "Is this document correct?" before finalizing.
export default function PrintPreviewModal({ draft, onConfirm, onClose }) {
  if (!draft) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-5">
        <h3 className="font-semibold mb-1">{draft.title}</h3>
        <span className="text-xs px-2 py-0.5 rounded bg-alertOrange/10 text-alertOrange">
          {draft.status === "approved" ? "Approved" : "Draft - Review pending"}
        </span>

        <div className="border rounded p-3 my-4 text-sm text-gray-700 bg-gray-50 whitespace-pre-wrap">
          {draft.content}
        </div>

        <p className="text-sm font-medium mb-3">Is this document correct?</p>

        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-alertGreen text-white rounded py-2 text-sm"
          >
            Yes, finalize
          </button>
          <button
            onClick={onClose}
            className="flex-1 border rounded py-2 text-sm"
          >
            No, edit
          </button>
        </div>
      </div>
    </div>
  );
}
