import React from "react";

const ResumePreview: React.FC<{ fields: Record<string, string> }> = ({
  fields,
}) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">Resume Preview</h3>
      <div className="mt-4">
        <p>
          <strong>Name:</strong> {fields.name}
        </p>
        <p>
          <strong>Email:</strong> {fields.email}
        </p>
        <p>
          <strong>Phone:</strong> {fields.phone}
        </p>
        <p>
          <strong>Summary:</strong> {fields.summary}
        </p>
        <p>
          <strong>Experience:</strong> {fields.experience}
        </p>
      </div>
    </div>
  );
};

export default ResumePreview;
