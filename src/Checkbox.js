class Checkbox {
    constructor(checkboxData, onSelected) {
        this.onSelected = onSelected
        this.el = this.getCheckboxTpl();
        this.createCheckbox(checkboxData)
    }

    createCheckbox({
                       id,
                       name,
                       value,
                       label,
                       checked,
                       attrs,
                       i,
                       highlight = true,
                       tip
                   }) {
        const inputEl = this.el.querySelector("input"),
            labelEl = this.el.querySelector("label")

        this.el.classList.add("c-checkbox")

        labelEl.classList.add("c-checkbox__label")
        if (highlight) labelEl.classList.add("c-checkbox__label--highlight")

        inputEl.addEventListener("change", e => {
            if (this.onSelected) {
                const state = this.getChecked()
                this.onSelected(state)
            }
        })

        if (!isset(id) && isset(i)) {
            id = `${name}_${i}`
        }

        setAttributes(inputEl, {id, name, value})

        if (isset(checked) && checked) {
            inputEl.checked = true
        }

        if (label) {
            this.setLabel(label)
        } else {
            this.el.classList.add("checkbox-custom--alone")
        }
        if (tip) this.setTip(tip)

        if (id) labelEl.setAttribute("for", id.toString())

        if (attrs && typeof attrs === "object") {
            setAttributes(this.el, attrs)
        }
    }

    setTip(value) {
        return $(this.el).tip(value)
    }

    setLabel(label) {
        const labelEl = this.el.querySelector("label")
        if (typeof label === "object") {
            // if html
            labelEl.appendChild(label)
        } else {
            // string
            labelEl.innerHTML = label
        }
    }

    getCheckbox() {
        return this.el
    }

    getChecked() {
        const inputEl = this.el.querySelector("input")
        return inputEl.checked
    }

    setChecked(state) {
        const inputEl = this.el.querySelector("input")
        inputEl.checked = state
    }

    getCheckboxTpl() {
        return $(`
      <div class="checkbox-custom">
          <input type="checkbox" id="xxx" name="xxx">
          <label for="xxx"></label>
      </div>
    `)[0];
    }
}
