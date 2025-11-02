import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="sf-footer">
      <div className="sf-footer__inner">
        <p className="sf-footer__copy">© 2025 StreamFlix</p>

        <a
          href="/Manual%20de%20Usuario.docx"
          download="Manual-de-Usuario-StreamFlix.docx"
          className="sf-footer__manual"
          title="Descargar Manual de Usuario"
          rel="noopener noreferrer"
          target="_blank"
        >
          📘 Manual de Usuario
        </a>
      </div>
    </footer>
  );
}
