

function Footer() {
    const currentYear = new Date().getFullYear();

    return(
        <footer className="footer">
            <p>© {currentYear} Reddit Tracker. Powered by Reddit API.</p>
        </footer>
    );
}

export default Footer;