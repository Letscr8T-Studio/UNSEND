// Opens the Tally survey as a popup over the page.
// Docs: https://tally.so/help/developer-resources

type TallyPopupOptions = {
  layout?: "default" | "modal";
  width?: number;
  overlay?: boolean;
  emoji?: { text: string; animation: string };
  hiddenFields?: Record<string, string>;
  onSubmit?: (payload: unknown) => void;
  onClose?: () => void;
};

declare global {
  interface Window {
    Tally?: {
      openPopup: (formId: string, options?: TallyPopupOptions) => void;
      closePopup: (formId: string) => void;
    };
  }
}

export const TALLY_FORM_ID = process.env.NEXT_PUBLIC_TALLY_FORM_ID ?? "";
export const TALLY_SCRIPT_SRC = "https://tally.so/widgets/embed.js";

export function openSurvey(email: string, onSubmit?: () => void) {
  if (!TALLY_FORM_ID) {
    console.warn("NEXT_PUBLIC_TALLY_FORM_ID is not set, so the survey can't open.");
    return;
  }

  if (window.Tally) {
    window.Tally.openPopup(TALLY_FORM_ID, {
      layout: "modal",
      width: 640,
      overlay: true,
      hiddenFields: { email },
      onSubmit: () => onSubmit?.(),
    });
    return;
  }

  // Fallback if the Tally script hasn't loaded yet (slow network, ad blocker):
  // open the form in a new tab with the email prefilled as a hidden field.
  const url = `https://tally.so/r/${TALLY_FORM_ID}?email=${encodeURIComponent(email)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
