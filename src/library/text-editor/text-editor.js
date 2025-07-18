import '../icons/icons.js';

class TextEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.placeholder = this.getAttribute('placeholder') || 'Start typing';
        this.size = '16';
        this.value = `
            <h2>What is Lorem Ipsum?</h2><h2 style="margin: 0px 0px 10px; padding: 0px; font-weight: 400; font-family: DauphinPlain; font-size: 24px; line-height: 24px; color: rgb(0, 0, 0);"><p style="color: rgb(52, 58, 64); font-family: sans-serif; font-size: 16px;"><b><i>Lorem Ipsum</i></b>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.&nbsp;<u>It was popularised</u>&nbsp;in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><hr style="color: rgb(52, 58, 64); font-family: sans-serif; font-size: 16px;"><br></h2>
        `;
        //this.value = '';
    }

    connectedCallback() {
        this.render();
        this._bindToolbarActions();
    }

    static get observedAttributes() {
        return ['placeholder'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[name] = newValue;
        this.render();
    }

    get styles() {
        return `
            :host {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                font-family: sans-serif;
                border: 1px solid #e6e6e6;
                z-index: 1000;
            }

            .toolbar {
                display: flex;
                gap: 0.25rem;
                padding: 0.25rem;
                background: #f1f1f4;
                border-bottom: 1px solid #e6e6e6;
                flex-wrap: wrap;
            }

            .editor {
                font-size: ${this.size}px;
                color: #343a40;
                flex-grow: 1;
                padding: 1rem 0.5rem;
                min-height: 200px;
                background: white;
                outline: none;
            }

            .editor:empty::before {
                content: '${this.placeholder}...';
                color: #818181;
                font-style: italic;
                font-size: 14px;
            }

            icon-elm {
                padding: 0.25rem;
                cursor: pointer;
                border: 1px solid transparent;
            }

            icon-elm:hover {
                opacity: 0.6;
            }

            /*icon-elm.active {
                border: 1px solid #e6e6e6;
                background: #ffffff;
                border-radius: 4px;
            }*/

            .separator {
                margin: 0 0.5rem;
                border-left: 1px solid #e6e6e6;
            }
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${this.styles}</style>
            <div class="toolbar">
                <icon-elm data-cmd="bold" name="bold" size="${this.size}" title="Bold"></icon-elm>
                <icon-elm data-cmd="italic" name="italic" size="${this.size}" title="Italic"></icon-elm>
                <icon-elm data-cmd="underline" name="underline" size="${this.size}" title="Underline"></icon-elm>
                <icon-elm data-cmd="removeFormat" name="remove-format" size="${this.size}" title="Remove Format"></icon-elm>

                <span class="separator"></span>

                <icon-elm data-cmd="justifyLeft" name="align-left" size="${this.size}" title="Align Left"></icon-elm>
                <icon-elm data-cmd="justifyCenter" name="align-center" size="${this.size}" title="Align Center"></icon-elm>
                <icon-elm data-cmd="justifyRight" name="align-right" size="${this.size}" title="Align Right"></icon-elm>
                <icon-elm data-cmd="justifyFull" name="justify" size="${this.size}" title="Justify"></icon-elm>
                <icon-elm data-cmd="insertUnorderedList" name="list-ul" size="${this.size}" title="Unordered List"></icon-elm>
                <icon-elm data-cmd="insertOrderedList" name="list-ol" size="${this.size}" title="Ordered List"></icon-elm>       

                <span class="separator"></span>

                <icon-elm data-cmd="insertHorizontalRule" name="horizental-line" size="${this.size}" title="Insert Horizontal Rule"></icon-elm>
            </div>
            <div class="editor" contenteditable="true">${this.value}</div>
        `;
    }

    _bindToolbarActions() {
        const toolbar = this.shadowRoot.querySelector('.toolbar');
        const editor = this.shadowRoot.querySelector('.editor');

        this.selectedText = '';
        editor.addEventListener('selectstart', () => {
            this.selectedText = this.shadowRoot.querySelector('.editor').innerText.substring(
                this.shadowRoot.querySelector('.editor').selectionStart,
                this.shadowRoot.querySelector('.editor').selectionEnd
            );
        });

        toolbar.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        toolbar.addEventListener('click', (e) => {
            const path = e.composedPath();
            const action = path.find(element => element instanceof Element && element.hasAttribute && element.hasAttribute('data-cmd'));

            if (!action) return;

            const command = action.dataset.cmd;
            editor.focus();

            document.execCommand(command, false, null);
            this.value = editor.innerHTML;

            this.dispatchEvent(new CustomEvent('editor-change', {
                bubbles: true,
                composed: true,
                detail: { value: this.value }
            }));
        });
    }

}

customElements.define('text-editor', TextEditor);
export default TextEditor;