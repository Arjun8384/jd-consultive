import { FaWhatsapp } from 'react-icons/fa';
import '../styles/WhatsAppButton.css';

export default function WhatsAppButton() {

  const whatsappNumber =
    process.env.REACT_APP_WHATSAPP_NUMBER;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
}