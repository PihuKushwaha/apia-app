import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCaseContext } from "../../../../context/CaseContext.jsx";
import DocumentPreview from "../../../../components/common/DocumentPreview.jsx";
import PrintPreviewModal from "../../../../components/common/PrintPreviewModal.jsx";

export default function Documents() {
  const { caseId } = useParams();
  const { getCase, approveDocument } = useCaseContext();
  const c = getCase(caseId);
  const [activeIndex, setActiveIndex] = useState(null);

  if (!c) return <p className="text-sm text-gray-500">Case not found.</p>;

  const handleConfirm = () => {
    approveDocument(caseId, activeIndex);
    setActiveIndex(null);
  };

  return (
    <div className="space-y-3">
      {c.documents.map((d, i) => (
        <DocumentPreview key={d.title + i} title={d.title} approved={d.status === "approved"}>
          <p className="mb-2 line-clamp-3">{d.content}</p>
          <button onClick={() => setActiveIndex(i)} className="text-navy text-xs underline">
            Preview & print
          </button>
        </DocumentPreview>
      ))}

      <PrintPreviewModal
        draft={activeIndex !== null ? c.documents[activeIndex] : null}
        onConfirm={handleConfirm}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
}