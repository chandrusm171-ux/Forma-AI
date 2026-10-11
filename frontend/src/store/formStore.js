import { create } from "zustand";

/**
 * Zustand store for Forma AI dynamic form engine state management.
 * Manages active schema, form values, AI extraction state, and UI notifications.
 */
export const useFormStore = create((set) => ({
  // Active schema & form values
  schema: null,
  prefillData: {},
  
  // AI extraction states
  isExtracting: false,
  extractionError: null,

  // Submission states
  isSubmitting: false,
  submitStatus: null, // null | 'success' | 'error'

  // Toast notifications
  toast: {
    visible: false,
    type: "info",
    message: "",
  },

  // Actions
  setSchema: (schema) => set({ schema }),
  setPrefillData: (data) => set({ prefillData: data }),
  
  setIsExtracting: (isExtracting) => set({ isExtracting }),
  setExtractionError: (error) => set({ extractionError: error }),
  
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSubmitStatus: (status) => set({ submitStatus: status }),

  showToast: (type, message) =>
    set({
      toast: {
        visible: true,
        type,
        message,
      },
    }),

  hideToast: () =>
    set((state) => ({
      toast: {
        ...state.toast,
        visible: false,
      },
    })),

  resetForm: () =>
    set({
      prefillData: {},
      isExtracting: false,
      extractionError: null,
      isSubmitting: false,
      submitStatus: null,
    }),
}));

export default useFormStore;
