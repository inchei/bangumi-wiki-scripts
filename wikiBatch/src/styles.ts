import appCss from './styles.css';
import diffViewCss from '@git-diff-view/svelte/styles/diff-view.css';

GM_addStyle(appCss);
GM_addStyle(diffViewCss);

const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
document.head.appendChild(fontAwesome);
