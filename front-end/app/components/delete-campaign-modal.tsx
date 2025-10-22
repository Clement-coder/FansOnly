"use client"

import { Trash2 } from "lucide-react"

export function DeleteCampaignModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-card rounded-2xl p-8 shadow-lg w-full max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Are you sure?</h2>
          <p className="text-muted mb-8">
            Do you really want to delete this campaign? This process cannot be undone.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-red-500 text-white hover:bg-red-600 font-semibold px-6 py-3 rounded-xl transition-all duration-300 ease-in-out" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
