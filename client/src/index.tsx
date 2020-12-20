import React from 'react';
import ReactDom from 'react-dom';

const Root = () => (
  <div>works</div>
);

const appDiv = document.createElement('div');
appDiv.id = 'app';

document.querySelector('body')?.appendChild(appDiv);


ReactDom.render(<Root />, document.querySelector('div#app'));
