import EventEmitter = require("events");
import { ColorScheme } from "../../../color_scheme";
import { ENTRY_MARGIN_TOP, INPUT_WIDTH, LABEL_STYLE } from "./common";
import { E } from "@selfage/element/factory";
import { TextInputController } from "@selfage/element/text_input_controller";
import { Ref } from "@selfage/ref";

export interface TextInputComponent {
  on(event: "change", listener: (value: string) => void): this;
}

export class TextInputComponent extends EventEmitter {
  public constructor(
    public body: HTMLDivElement,
    private input: HTMLInputElement,
    private textInputController: TextInputController,
    private defaultValue: string
  ) {
    super();
  }

  public static create(
    label: string,
    defaultValue: string,
    value: string
  ): TextInputComponent {
    let views = TextInputComponent.createView(label, value);
    return new TextInputComponent(
      ...views,
      TextInputController.create(views[1]),
      defaultValue
    ).init();
  }

  public static createView(label: string, value: string) {
    let inputRef = new Ref<HTMLInputElement>();
    let body = E.div(
      `class="text-input-container" style="display: flex; ` +
        `flex-flow: row nowrap; justify-content: space-between; ` +
        `align-items: center; ${ENTRY_MARGIN_TOP}"`,
      E.div(
        `class="text-input-label" style="${LABEL_STYLE}" title="${label}"`,
        E.text(label)
      ),
      E.inputRef(
        inputRef,
        `class="text-input" style="padding: 0; margin: 0; outline: none; ` +
          `border: 0; background-color: initial; width: ${INPUT_WIDTH}; ` +
          `border-bottom: .1rem solid ${ColorScheme.getInputBorder()}; ` +
          `font-size: 1.4rem; font-family: initial !important; ` +
          `color: ${ColorScheme.getContent()}; value=${value}"`
      )
    );
    return [body, inputRef.val] as const;
  }

  public init(): this {
    this.textInputController.on("enter", () => this.changeValue());
    this.input.addEventListener("blur", () => this.changeValue());
    return this;
  }

  private changeValue(): void {
    if (!this.input.value) {
      this.input.value = this.defaultValue;
    }
    this.emit("change", this.input.value);
  }

  public reset(): string {
    this.input.value = this.defaultValue;
    return this.defaultValue;
  }
}
