import {
  FASTElement,
  html,
  css,
  repeat,
} from 'https://cdn.jsdelivr.net/npm/@microsoft/fast-element/dist/fast-element.min.js';

const styles = css`
  body {
    background-color: #aaaaaa;
  }
  .mainDiv {
    margin: 25px;
    height: 100%;
    padding: 25px;
    border: 1px solid black;
    display: flex;
    flex-direction: row;
    margin-right: 25px;
    width: fit-content;
  }

  .containerDiv {
    display: flex;
    flex-direction: column;
    border: 3px solid #333333;
    background-color: #666666;
    margin: 25px;
    padding: 30px;
  }

  .svgMain {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    border: 3px dotted #333333;
    background-color: #666666;
    margin: 25px;
    padding: 30px;
  }
`;

let template = html`
  <div class="mainDiv">
    <control-component
      id="controlcomponent"
      class="containerDiv"
    ></control-component>
    <d3-chart-component id="d3chartcomponent"></d3-chart-component>
  </div>
`;

export class ContainerComponent extends FASTElement {
  static definition = {
    name: 'container-component',
    template,
    styles: styles,
    attributes: [],
  };

  connectedCallback() {
    super.connectedCallback();
  }
}

FASTElement.define(ContainerComponent);
