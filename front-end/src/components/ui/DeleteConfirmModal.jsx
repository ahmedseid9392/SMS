import React from "react";
import { AlertTriangle, X, Trash2, Save, Edit } from "lucide-react";

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  subtitle = "",
  type = "delete", // delete, update, save, warning
  loading = false
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "delete":
        return {
          icon: AlertTriangle,
          iconColor: "text-red-600",
          buttonColor: "bg-red-600 hover:bg-red-700",
          buttonText: "Delete",
          gradient: "from-red-500 to-red-600"
        };
      case "update":
        return {
          icon: Edit,
          iconColor: "text-blue-600",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
          buttonText: "Update",
          gradient: "from-blue-500 to-blue-600"
        };
      case "save":
        return {
          icon: Save,
          iconColor: "text-green-600",
          buttonColor: "bg-green-600 hover:bg-green-700",
          buttonText: "Save",
          gradient: "from-green-500 to-green-600"
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: "text-yellow-600",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
          buttonText: "Confirm",
          gradient: "from-yellow-500 to-yellow-600"
        };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 animate-slideUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mt-6">
          <div className={`p-4 rounded-full bg-${styles.iconColor.split('-')[1]}-100 dark:bg-${styles.iconColor.split('-')[1]}-900/20`}>
            <Icon size={48} className={styles.iconColor} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            {title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {message}
          </p>
          
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {subtitle}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600
                       text-gray-700 dark:text-gray-300 font-medium
                       hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-xl text-white font-medium
                       transition-all duration-200 hover:scale-105
                       disabled:opacity-50 disabled:hover:scale-100
                       bg-gradient-to-r ${styles.gradient}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                styles.buttonText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;