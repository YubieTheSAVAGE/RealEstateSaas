import React, { useState } from "react";
import { CardDescription, CardTitle } from "../../ui/card";
import { FaStickyNote, FaEdit, FaSave, FaTimes } from "react-icons/fa";

interface ClientNoteCardProps {
  clientNote: string;
  onNoteUpdate?: (newNote: string) => void;
  editable?: boolean;
}

export default function ClientNoteCard({ clientNote, onNoteUpdate, editable = false }: ClientNoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(clientNote);

  const handleSave = () => {
    if (onNoteUpdate) {
      onNoteUpdate(noteText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNoteText(clientNote);
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-600 dark:from-yellow-500/20 dark:to-yellow-600/20 dark:text-yellow-400">
            <FaStickyNote size={24} />
          </div>
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Notes
          </CardTitle>
        </div>
        
        {editable && (
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 hover:text-green-700 transition-colors"
                  title="Sauvegarder"
                >
                  <FaSave className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700 transition-colors"
                  title="Annuler"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 hover:text-blue-700 transition-colors"
                title="Modifier"
              >
                <FaEdit className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {!clientNote && !isEditing && (
        <div className="text-center py-8">
          <FaStickyNote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Aucune note disponible
          </p>
          {editable && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-3 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Ajouter une note
            </button>
          )}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Ajoutez vos notes sur ce client..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={6}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      ) : (
        clientNote && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {clientNote}
            </p>
          </div>
        )
      )}
    </div>
  );
}
