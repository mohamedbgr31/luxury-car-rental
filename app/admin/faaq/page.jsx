"use client"

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useFaqs } from "@/context/FaqContext";
import Sidebar from "@/components/ui/sidebar";
import { usePermissions } from "@/app/hooks/usePermissions";

const AdminFaqPanel = () => {
  const { faqs, loading, addFaq, updateFaq, deleteFaq, toggleVisibility } = useFaqs();
  const [openIndex, setOpenIndex] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const { canCreate, canEdit, canDelete } = usePermissions();

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAddFaq = async () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      await addFaq(newFaq);
      setNewFaq({ question: '', answer: '' });
      setIsAddingNew(false);
    }
  };

  const handleUpdateFaq = async (id, updatedFaq) => {
    if (updatedFaq.question.trim() && updatedFaq.answer.trim()) {
      await updateFaq(id, { question: updatedFaq.question, answer: updatedFaq.answer });
      setEditingId(null);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      await deleteFaq(id);
    }
  };

  return (
    <div className="bg-black flex min-h-screen relative font-bruno text-white">
      <div className="hidden lg:block fixed h-screen z-10">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col min-h-screen lg:ml-72 xl:ml-80">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-yellow-500">FAQ Management</h1>
            <button
              onClick={() => setIsAddingNew(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New FAQ
            </button>
          </div>

          {/* Add New Form */}
          {isAddingNew && (
            <div className="bg-[#282828] border-2 border-yellow-500/50 rounded-xl p-6 mb-8 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Add New FAQ</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
                  <input
                    type="text"
                    placeholder="Enter question..."
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Answer</label>
                  <textarea
                    placeholder="Enter answer..."
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none h-32 resize-none transition-colors"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewFaq({ question: '', answer: '' });
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFaq}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Save FAQ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FAQ List */}
          <div className="space-y-6">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const isEditing = editingId === faq._id;

              return (
                <div
                  key={faq._id}
                  className={`bg-[#282828] border-2 rounded-xl p-6 transition-all duration-300 shadow-lg ${faq.isVisible
                      ? 'border-yellow-500 opacity-100'
                      : 'border-gray-600 opacity-60'
                    }`}
                >
                  {/* Admin Controls */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                      {canEdit && (
                        <button
                          onClick={() => setEditingId(isEditing ? null : faq._id)}
                          className={`${isEditing
                              ? 'bg-gray-600 hover:bg-gray-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                            } text-white p-2 rounded-lg transition-colors`}
                          title={isEditing ? "Cancel Edit" : "Edit FAQ"}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canEdit && (
                        <button
                          onClick={() => toggleVisibility(faq._id)}
                          className={`${faq.isVisible
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'bg-green-600 hover:bg-green-700'
                            } text-white p-2 rounded-lg transition-colors`}
                          title={faq.isVisible ? 'Hide FAQ' : 'Show FAQ'}
                        >
                          {faq.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteFaq(faq._id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Status: {faq.isVisible ? 'Visible' : 'Hidden'}
                    </div>
                  </div>

                  {/* FAQ Content */}
                  {isEditing ? (
                    <EditForm
                      faq={faq}
                      onSave={(updatedFaq) => handleUpdateFaq(faq._id, updatedFaq)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <>
                      {/* FAQ Header */}
                      <div
                        onClick={() => toggleFaq(index)}
                        className="cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-white flex-1 pr-4">
                            {faq.question}
                          </h3>
                          <button className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black transition-transform duration-200 hover:scale-105">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {isOpen && (
                          <div className="w-full h-[1px] bg-yellow-400 mt-4" />
                        )}
                      </div>

                      {/* FAQ Answer */}
                      <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-96 mt-4" : "max-h-0"
                          }`}
                      >
                        <p className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {faqs.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl">No FAQs found. Create your first FAQ!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Edit Form Component
const EditForm = ({ faq, onSave, onCancel }) => {
  const [editedFaq, setEditedFaq] = useState({
    question: faq.question,
    answer: faq.answer,
  });

  const handleSave = () => {
    if (editedFaq.question.trim() && editedFaq.answer.trim()) {
      onSave(editedFaq);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
        <input
          type="text"
          value={editedFaq.question}
          onChange={(e) => setEditedFaq({ ...editedFaq, question: e.target.value })}
          className="w-full bg-[#1C1C1C] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Answer</label>
        <textarea
          value={editedFaq.answer}
          onChange={(e) => setEditedFaq({ ...editedFaq, answer: e.target.value })}
          className="w-full bg-[#1C1C1C] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none h-32 resize-none transition-colors"
        />
      </div>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminFaqPanel;