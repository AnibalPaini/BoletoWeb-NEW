function Footer() {
  return (
    <footer className="footer-muni">
      <div className="footer-content">
        <img
          src="/footer_muni- capital.svg"
          alt="La capital que queremos"
          className="footer-capital"
        />

        {/* Redes sociales */}
        <div className="footer-social-icons">
          <a href="#facebook" target="_blank" rel="noopener noreferrer">
            <img src="/icono-red-social-facebook.svg" alt="Facebook" />
          </a>
          <a href="#twitter" target="_blank" rel="noopener noreferrer">
            <img src="/icono-red-social-twitter.svg" alt="Twitter/X" />
          </a>
          <a href="#youtube" target="_blank" rel="noopener noreferrer">
            <img src="/icono-red-social-youtube.svg" alt="YouTube" />
          </a>
          <a href="#instagram" target="_blank" rel="noopener noreferrer">
            <img src="/icono-red-social-instagram.svg" alt="Instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
