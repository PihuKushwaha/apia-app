import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMerg } from "../../context/MergContext.jsx";

const steps = [
  {
    title: "Hospital Information",
    fields: [
      { key: "hospitalName", label: "Hospital Name" },
      { key: "ward", label: "Ward" },
      { key: "bedNumber", label: "Bed Number" },
    ],
  },
  {
    title: "Merg Details",
    fields: [
      { key: "registrationDate", label: "Registration Date", type: "date" },
      { key: "registrationTime", label: "Registration Time", type: "time" },
    ],
  },
  {
    title: "Deceased Details",
    fields: [
      { key: "deceasedName", label: "Name" },
      { key: "fatherName", label: "Father's Name" },
      { key: "age", label: "Age" },
      { key: "gender", label: "Gender" },
      { key: "address", label: "Address" },
      { key: "mobile", label: "Mobile Number" },
    ],
  },
  {
    title: "Informant Details",
    fields: [
      { key: "informantName", label: "Name" },
      { key: "relationship", label: "Relationship" },
      { key: "informantMobile", label: "Mobile Number" },
    ],
  },
  {
    title: "Hospital Details",
    fields: [
      { key: "mlcNumber", label: "MLC Number" },
      { key: "admissionDate", label: "Admission Date", type: "date" },
      { key: "deathDateTime", label: "Date & Time of Death", type: "datetime-local" },
      { key: "treatingDoctor", label: "Treating Doctor" },
    ],
  },
];

export default function NewMergWizard() {
  const navigate = useNavigate();
  const { createMergCase } = useMerg();
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({});

  const current = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const handleChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleNext = async (e) => {
    e.preventDefault();
    if (isLast) {
      const id = await createMergCase(formData);
      navigate(`/merg/cases/${id}`);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-xl">
      <h1 className="text-xl font-semibold mb-1">New Merg Case</h1>
      <p className="text-sm text-gray-500 mb-4">
        Step {stepIndex + 1} of {steps.length}: {current.title}
      </p>

      <div className="flex gap-1 mb-6">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className={`h-1.5 flex-1 rounded ${i <= stepIndex ? "bg-navy" : "bg-gray-200"}`}
          />
        ))}
      </div>

      <form onSubmit={handleNext} className="space-y-3">
        {current.fields.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-medium block mb-1">{f.label}</label>
            <input
              type={f.type || "text"}
              value={formData[f.key] || ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>
        ))}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((i) => i - 1)}
            className="px-4 py-2 text-sm rounded border disabled:opacity-30"
          >
            Back
          </button>
          <button type="submit" className="bg-navy text-white px-4 py-2 rounded text-sm">
            {isLast ? "Create Merg Case" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
