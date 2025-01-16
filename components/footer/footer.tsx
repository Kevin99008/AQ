import classes from './footer.module.css'; // Import the CSS module

export default function Footer() {
    return (
        <footer className={classes.footer}>
            <div className={classes.container}>
                <div className={classes.footerContent}>
                    <p className={classes.copyright}>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                    <nav>
                        <ul className={classes.navList}>
                            <li>Tel. 0972762626</li>
                            <li><a href="https://www.facebook.com/profile.php?id=100063802697610" className={classes.navLink}>AquaKids</a></li>
                            <li><a href="https://www.facebook.com/profile.php?id=100067089941474" className={classes.navLink}>PlaySound</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
