import appCss from './styles.css';
import d2hCss from 'diff2html/bundles/css/diff2html.min.css';

GM_addStyle(appCss);
GM_addStyle(d2hCss);

const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
document.head.appendChild(fontAwesome);
