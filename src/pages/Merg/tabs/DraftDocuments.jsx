import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMerg } from "../../../context/MergContext.jsx";
import DocumentPreview from "../../../components/common/DocumentPreview.jsx";
import PrintPreviewModal from "../../../components/common/PrintPreviewModal.jsx";

// Module 4 - Auto Draft Engine + Module 12 - Print Center
export default function DraftDocuments() {
  const { mergId } = useParams();
  const { getCase, approveDraft } = useMerg();
  const mergCase = getCase(mergId);
  const [activeIndex, setActiveIndex] = useState(null);

  if (!mergCase) return <p className="text-sm text-gray-500">Case not found.</p>;

  const handleConfirm = () => {
    approveDraft(mergId, activeIndex);
    setActiveIndex(null);
  };

  return (
    <div className="space-y-3">
      {mergCase.drafts.map((d, i) => (
        <DocumentPreview key={d.title} title={d.title} approved={d.status === "approved"}>
          <p className="mb-2">{d.content}</p>
          <button onClick={() => setActiveIndex(i)} className="text-navy text-xs underline">
            Preview & print
          </button>
        </DocumentPreview>
      ))}

      <PrintPreviewModal
        draft={activeIndex !== null ? mergCase.drafts[activeIndex] : null}
        onConfirm={handleConfirm}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
}
