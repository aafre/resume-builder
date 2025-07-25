import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTemplates } from "../services/templates";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

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
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading beautiful templates...</p>
          </div>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // Empty state
    if (templates.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <p className="text-xl text-gray-500 text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            No templates available at the moment.
          </p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header Section */}
        <div className="text-center py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 mb-6">
            Choose Your Perfect Template
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a professional template that matches your style and industry
          </p>
        </div>

        {/* Templates Grid */}
        <div className="container mx-auto max-w-6xl px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {templates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              return (
                <div
                  key={template.id}
                  className={`group cursor-pointer transition-all duration-300 ${
                    isSelected ? "scale-[1.02]" : "hover:scale-[1.02]"
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                    isSelected 
                      ? "border-blue-500 ring-4 ring-blue-200/50" 
                      : "border-gray-200 hover:border-blue-300"
                  }`}>
                    {/* Template Preview - Larger Image */}
                    <div className="relative overflow-hidden bg-gray-50">
                      <img
                        src={template.image_url}
                        alt={template.name}
                        className="w-full h-96 sm:h-[500px] object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                      {isSelected && (
                        <div className="absolute top-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-xl">
                          <CheckCircleIcon className="w-7 h-7" />
                        </div>
                      )}
                      
                      {/* Overlay with quick info on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end">
                        <div className="w-full p-6 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm font-medium">Click to preview details</p>
                        </div>
                      </div>
                    </div>

                    {/* Template Info - Compact but informative */}
                    <div className="p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {isSelected ? (
                          <>
                            <button
                              className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUseTemplate(template.id);
                              }}
                            >
                              Start Building Resume
                              <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </button>
                          </>
                        ) : (
                          <button className="w-full text-blue-600 bg-blue-50 border-2 border-blue-200 py-4 px-6 rounded-xl font-semibold hover:bg-blue-100 transition-colors duration-300">
                            Select This Template
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  export default TemplateCarousel;
