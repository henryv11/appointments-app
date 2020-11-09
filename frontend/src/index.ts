import { createElement } from 'react';
import { render } from 'react-dom';
import App from './components/App';
import './styles/main.scss';

render(createElement(App), document.getElementById('root'));
