const WHATSAPP_NUMBER = "923002029179";
const PRESET_MESSAGE = "Hi SJ Academy, I'd like to ask about tuitions";

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  PRESET_MESSAGE,
)}`;

export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SJ Academy on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:h-16 sm:w-16"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 sm:h-8 sm:w-8"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.04 4C9.43 4 4.06 9.37 4.06 15.98c0 2.11.55 4.17 1.6 5.99L4 28l6.2-1.62a11.9 11.9 0 0 0 5.84 1.49h.01c6.6 0 11.98-5.37 11.98-11.98C28.03 9.37 22.65 4 16.04 4Zm0 21.83h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.68.96.98-3.59-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.91a9.83 9.83 0 0 1 2.9 7 9.92 9.92 0 0 1-9.97 9.91Zm5.44-7.42c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
