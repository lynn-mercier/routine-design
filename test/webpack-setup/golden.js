import {Renderer} from 'routine-design';
import './index.scss';
import Routes from './routes.js';
new Renderer(Routes, document.getElementById('foo')).render();