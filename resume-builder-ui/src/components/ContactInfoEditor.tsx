import React from "react";

interface ContactInfo {
  name: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
}

const ContactInfoEditor: React.FC<{
  contactInfo: ContactInfo | null;
  setContactInfo: (info: ContactInfo) => void;
}> = ({ contactInfo, setContactInfo }) => {
  if (!contactInfo) return null;

  return (
    <div className="border p-6 mb-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(contactInfo).map((key) => (
          <div key={key}>
            <label className="block text-gray-700 font-medium mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type="text"
              value={contactInfo[key as keyof ContactInfo] || ""}
              onChange={(e) =>
                setContactInfo({
                  ...contactInfo,
                  [key]: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfoEditor;
