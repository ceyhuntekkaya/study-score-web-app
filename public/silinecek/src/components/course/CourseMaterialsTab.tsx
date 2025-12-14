import React from "react";
import { Download, FileText, Info } from "lucide-react";

const CourseMaterialsTab: React.FC = () => {
  // Sample materials data - replace with real data when available
  const materials = [
    {
      id: 1,
      name: "Course Introduction Document",
      size: "1.2 MB",
      type: "PDF",
      downloadUrl: "#",
    },
    {
      id: 2,
      name: "Workbook",
      size: "0.8 MB",
      type: "PDF",
      downloadUrl: "#",
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText size={20} className="text-red-500" />;
      case "doc":
      case "docx":
        return <FileText size={20} className="text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileText size={20} className="text-green-500" />;
      default:
        return <FileText size={20} className="text-gray-500" />;
    }
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-800";
      case "doc":
      case "docx":
        return "bg-blue-100 text-blue-800";
      case "xls":
      case "xlsx":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Course Materials
        </h2>

        {/* Materials Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-16">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  File
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-24">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-24">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-32">
                  Event
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {materials.map((material, index) => (
                <tr
                  key={material.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getFileIcon(material.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {material.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatFileSize(material.size)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFileTypeColor(
                        material.type
                      )}`}
                    >
                      {material.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        // Handle download logic here
                        console.log(`Downloading: ${material.name}`);
                      }}
                      className="static inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <Download size={14} className="mr-1" />
                      İndir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {materials.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No materials have been added yet.
            </h3>
            <p className="text-gray-500">
              Material files for this course have not been prepared yet.
            </p>
          </div>
        )}

        {/* Info Alert */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info
              size={20}
              className="text-blue-600 mr-3 mt-0.5 flex-shrink-0"
            />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Info</p>
              <p>
                Additional materials will be added here as the course
                progresses.
              </p>
            </div>
          </div>
        </div>

        {/* Download All Section */}
        {materials.length > 1 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-medium text-gray-900">
                  Bulk Download
                </h3>
                <p className="text-sm text-gray-600">
                  You can download all materials at once.
                </p>
              </div>
              <button className="static inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                <Download size={18} className="mr-2" />
                Download All (ZIP)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseMaterialsTab;
