  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { fetchTemplates } from "../services/templates";

  interface Template {
    id: string;
    name: string;
    description: string;
    image_url: string;
  }

  const TemplateCarousel: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
      null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch templates on component mount
    useEffect(() => {
      const loadTemplates = async () => {
        try {
          setLoading(true);
          const data = await fetchTemplates();
          setTemplates(data);
          setSelectedTemplate(data[0] || null); // Select the first template by default
        } catch (err) {
          setError("Failed to load templates. Please try again later.");
          console.error("Error fetching templates:", err);
        } finally {
          setLoading(false);
        }
      };

      loadTemplates();
    }, []);

    // Handle template selection
    const handleSelectTemplate = (template: Template) => {
      setSelectedTemplate(template);
    };

    // Navigate to editor with the selected template
    const handleUseTemplate = (templateId: string) => {
      navigate(`/editor?template=${templateId}`);
    };

    // Loading state
    if (loading) {
      return <p className="text-center text-gray-600">Loading templates...</p>;
    }

    // Error state
    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }

    // Empty state
    if (templates.length === 0) {
      return <p className="text-center text-gray-500">No templates available.</p>;
    }

    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Pane: List of Templates */}
        <div className="w-full md:w-1/3 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Templates</h2>
          <ul className="space-y-4">
            {templates.map((template) => (
              <li
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer shadow-sm transition ${
                  selectedTemplate?.id === template.id
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white hover:shadow-md"
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={template.image_url}
                    alt={template.name}
                    className="w-20 h-auto rounded-md"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-600 truncate max-w-[2/3]">
                      {template.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Pane: Template Preview */}
        <div className="w-full md:w-2/3 p-6 flex flex-col items-center">
          {selectedTemplate ? (
            <>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedTemplate.name}
              </h1>
              <div className="w-full max-w-lg p-4 border rounded-lg shadow hover:shadow-lg transition">
                <img
                  src={selectedTemplate.image_url}
                  alt={selectedTemplate.name}
                  className="w-full rounded-lg mb-4"
                />
                <p className="text-gray-600 mb-4">
                  {selectedTemplate.description}
                </p>
                <button
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
                  onClick={() => handleUseTemplate(selectedTemplate.id)}
                >
                  Use This Template
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a template to preview it here.</p>
          )}
        </div>
      </div>
    );
  };

  export default TemplateCarousel;
