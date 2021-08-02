import { TextButtonComponent } from "../../button_component";
import { BLUE, ColorScheme, ORANGE } from "../../color_scheme";
import { BrowserHistoryPusher } from "./browser_history_pusher";
import { SIDE_PADDING } from "./common_style";
import { FeedbackComponent } from "./feedback_component";
import { HistoryComponent } from "./history_component";
import { HomeView } from "./home_view";
import { LOCAL_SESSION_STORAGE } from "./local_session_storage";
import { NicknameComponent } from "./nickname_component";
import { PrivacyView } from "./privacy_view";
import { State } from "./state";
import { TabsNavigationController } from "./tabs_navigation_controller";
import { TermsView } from "./terms_view";
import { E } from "@selfage/element/factory";
import { HideableElementController } from "@selfage/element/hideable_element_controller";
import { Ref } from "@selfage/ref";
import { SessionStorage } from "@selfage/service_client/session_storage";
import { TabSwitcher } from "@selfage/tabs/switcher";

export class PageShellComponent {
  private static CHECK_SIGN_IN_STATUS_MAX_COUNT = 10 * 60 * 2; // Roughly 10 mins
  private static CHECK_SIGN_IN_STATUS_INTERVAL = 500; // ms

  private signInButtonsSwitcher = new TabSwitcher();
  private hideableSignInButton: HideableElementController;
  private hideableSignedInButtonsContainer: HideableElementController;
  private checkSignInStatusIntervalId: number;
  private checkSignInStatusCountdown: number;

  public constructor(
    public body: HTMLDivElement,
    private logo: HTMLDivElement,
    private signInButton: HTMLDivElement,
    private signedInButtonsContainer: HTMLDivElement,
    private nicknameButtonWrapper: HTMLDivElement,
    private historyButtonWrapper: HTMLDivElement,
    private signOutButtonWrapper: HTMLDivElement,
    private tabsContainer: HTMLDivElement,
    private termsButtonWrapper: HTMLDivElement,
    private privacyButtonWrapper: HTMLDivElement,
    private feedbackButtonWrapper: HTMLDivElement,
    private nicknameButton: TextButtonComponent,
    private historyButton: TextButtonComponent,
    private signOutButton: TextButtonComponent,
    private termsButton: TextButtonComponent,
    private privacyButton: TextButtonComponent,
    private feedbackButton: TextButtonComponent,
    private homeViewFactoryFn: () => HTMLElement,
    private nicknameComponentFactoryFn: () => NicknameComponent,
    private historyComponentFactoryFn: () => HistoryComponent,
    private termsViewFactoryFn: () => HTMLElement,
    private privacyViewFactoryFn: () => HTMLElement,
    private feedbackComponentFactoryFn: () => FeedbackComponent,
    private state: State,
    private browserHistoryPusher: BrowserHistoryPusher,
    private sessionStorage: SessionStorage,
    private window: Window
  ) {}

  public static create(
    state: State,
    browserHistoryPusher: BrowserHistoryPusher
  ): PageShellComponent {
    return new PageShellComponent(
      ...PageShellComponent.createView(),
      TextButtonComponent.create(E.text("Nickname")),
      TextButtonComponent.create(E.text("History")),
      TextButtonComponent.create(E.text("Sign out")),
      TextButtonComponent.create(E.text("Terms and Conditions")),
      TextButtonComponent.create(E.text("Privacy policy")),
      TextButtonComponent.create(E.text("Feedback")),
      () => HomeView.create(),
      () => NicknameComponent.create(),
      () => HistoryComponent.create(),
      () => TermsView.create(),
      () => PrivacyView.create(),
      () => FeedbackComponent.create(),
      state,
      browserHistoryPusher,
      LOCAL_SESSION_STORAGE,
      window
    ).init();
  }

  public static createView() {
    let logoRef = new Ref<HTMLDivElement>();
    let signInButtonRef = new Ref<HTMLDivElement>();
    let googleIconSvgRef = new Ref<SVGSVGElement>();
    let signedInButtonsContainerRef = new Ref<HTMLDivElement>();
    let nicknameButtonWrapperRef = new Ref<HTMLDivElement>();
    let historyButtonWrapperRef = new Ref<HTMLDivElement>();
    let signOutButtonWrapperRef = new Ref<HTMLDivElement>();
    let tabsContainerRef = new Ref<HTMLDivElement>();
    let termsButtonWrapperRef = new Ref<HTMLDivElement>();
    let privacyButtonWrapperRef = new Ref<HTMLDivElement>();
    let feedbackButtonWrapperRef = new Ref<HTMLDivElement>();
    let body = E.div(
      `class="main-body" style="display: flex; flex-flow: column nowrap; ` +
        `min-height: 100vh; overflow-y: auto;"`,
      E.div(
        `class="main-header" style="display: flex; flex-flow: row nowrap; ` +
          `align-items: center; padding: 1rem ${SIDE_PADDING}rem; ` +
          `border-bottom: .1rem solid ${ColorScheme.getBlockSeparator()};"`,
        E.divRef(
          logoRef,
          `class="main-logo" style="font-size: 3rem; font-weight: bold; ` +
            `font-family: Comic Sans MS, cursive, sans-serif; ` +
            `cursor: pointer;"`,
          E.div(
            `class="main-logo-left" style="display: inline; color: ${ORANGE};"`,
            E.text("Dan")
          ),
          E.div(
            `class="main-logo-right" style="display: inline; color: ${BLUE};"`,
            E.text("Mage")
          )
        ),
        E.div(`style="flex: 1;"`),
        E.divRef(
          signInButtonRef,
          `class="main-header-sign-in-button" style="display: flex; ` +
            `flex-flow: row nowrap; align-items: center; ` +
            `border: .1rem solid ${ColorScheme.getPrimaryButtonBackground()}; ` +
            `background-color: ${ColorScheme.getPrimaryButtonBackground()}; ` +
            `cursor: pointer;"`,
          E.svgRef(
            googleIconSvgRef,
            `class="main-header-google-icon" viewBox="0 0 46 46" ` +
              `style="width: 3.5rem; height: 3.5rem; background-color: white;"`
          ),
          E.div(
            `class="main-header-sign-in-text" style="padding: 0 1rem; ` +
              `font-size: 1.6rem; color: white;"`,
            E.text("Sign in with Google")
          )
        ),
        E.divRef(
          signedInButtonsContainerRef,
          `class="main-header-signed-in-tab-buttons-container" style="` +
            `display: flex; flex-flow: row nowrap; align-items: center;"`,
          E.divRef(
            nicknameButtonWrapperRef,
            `class="main-header-nickname-button-wrapper" style="` +
              `margin-right: 2rem;"`
          ),
          E.divRef(
            historyButtonWrapperRef,
            `class="main-header-history-button-wrapper" style="` +
              `margin-right: 2rem;"`
          ),
          E.divRef(
            signOutButtonWrapperRef,
            `class="main-heaer-history-button-wrapper"`
          )
        )
      ),
      E.divRef(tabsContainerRef, `class="main-tab-container" style="flex: 1;"`),
      E.div(
        `class="main-footer" style="display: flex; flex-flow: row nowrap; ` +
          `align-items: center; justify-content: center; padding: 2rem 0; ` +
          `border-top: .1rem solid ${ColorScheme.getBlockSeparator()};"`,
        E.divRef(termsButtonWrapperRef, `class="main-terms-button-wrapper"`),
        E.div(
          `style="height: 2rem; margin: 0 .2rem; width: .1rem; ` +
            `background-color: ${ColorScheme.getBlockSeparator()}"`
        ),
        E.divRef(
          privacyButtonWrapperRef,
          `class="main-privacy-button-wrapper"`
        ),
        E.div(
          `style="height: 2rem; margin: 0 .2rem; width: .1rem; ` +
            `background-color: ${ColorScheme.getBlockSeparator()}"`
        ),
        E.divRef(
          feedbackButtonWrapperRef,
          `class="main-feedback-button-wrapper"`
        )
      )
    );
    googleIconSvgRef.val.innerHTML = `
    <g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <g id="9-PATCH" sketch:type="MSArtboardGroup" transform="translate(-608.000000, -160.000000)"></g>
        <g id="btn_google_light_normal" sketch:type="MSArtboardGroup" transform="translate(-1.000000, -1.000000)">
            <g id="button" sketch:type="MSLayerGroup" transform="translate(4.000000, 4.000000)" filter="url(#filter-1)">
                <g id="button-bg">
                    <use fill="#FFFFFF" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-2"></use>
                    <use fill="none" xlink:href="#path-2"></use>
                    <use fill="none" xlink:href="#path-2"></use>
                    <use fill="none" xlink:href="#path-2"></use>
                </g>
            </g>
            <g id="logo_googleg_48dp" sketch:type="MSLayerGroup" transform="translate(15.000000, 15.000000)">
                <path d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z" id="Shape" fill="#4285F4" sketch:type="MSShapeGroup"></path>
                <path d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z" id="Shape" fill="#34A853" sketch:type="MSShapeGroup"></path>
                <path d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z" id="Shape" fill="#FBBC05" sketch:type="MSShapeGroup"></path>
                <path d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z" id="Shape" fill="#EA4335" sketch:type="MSShapeGroup"></path>
                <path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" sketch:type="MSShapeGroup"></path>
            </g>
            <g id="handles_square" sketch:type="MSLayerGroup"></g>
        </g>
    </g>`;
    return [
      body,
      logoRef.val,
      signInButtonRef.val,
      signedInButtonsContainerRef.val,
      nicknameButtonWrapperRef.val,
      historyButtonWrapperRef.val,
      signOutButtonWrapperRef.val,
      tabsContainerRef.val,
      termsButtonWrapperRef.val,
      privacyButtonWrapperRef.val,
      feedbackButtonWrapperRef.val,
    ] as const;
  }

  public init(): this {
    this.nicknameButtonWrapper.appendChild(this.nicknameButton.body);
    this.historyButtonWrapper.appendChild(this.historyButton.body);
    this.signOutButtonWrapper.appendChild(this.signOutButton.body);
    this.termsButtonWrapper.appendChild(this.termsButton.body);
    this.privacyButtonWrapper.appendChild(this.privacyButton.body);
    this.feedbackButtonWrapper.appendChild(this.feedbackButton.body);
    new TabsNavigationController(
      this.tabsContainer,
      this.state,
      this.browserHistoryPusher
    )
      .addWithHTMLButton("showHome", this.logo, this.homeViewFactoryFn)
      .addWithHideable(
        "showNickname",
        this.nicknameButton,
        this.nicknameComponentFactoryFn
      )
      .addWithHideable(
        "showHistory",
        this.historyButton,
        this.historyComponentFactoryFn
      )
      .addWithButton("showTerms", this.termsButton, this.termsViewFactoryFn)
      .addWithButton(
        "showPrivacy",
        this.privacyButton,
        this.privacyViewFactoryFn
      )
      .addWithHideable(
        "showFeedback",
        this.feedbackButton,
        this.feedbackComponentFactoryFn
      )
      .init();

    this.hideableSignInButton = new HideableElementController(
      this.signInButton
    );
    this.hideableSignInButton.hide();
    this.hideableSignedInButtonsContainer = new HideableElementController(
      this.signedInButtonsContainer
    );
    this.hideableSignedInButtonsContainer.hide();
    if (!this.sessionStorage.read()) {
      this.showSignInButton();
    } else {
      this.showSignedInButtonsContainer();
    }
    this.signInButton.addEventListener("click", () => this.signIn());
    this.signOutButton.on("click", () => this.signOut());
    return this;
  }

  private showSignInButton(): void {
    this.signInButtonsSwitcher.show(
      () => {
        this.hideableSignInButton.show();
      },
      () => {
        this.hideableSignInButton.hide();
      }
    );
  }

  private showSignedInButtonsContainer(): void {
    this.signInButtonsSwitcher.show(
      () => {
        this.hideableSignedInButtonsContainer.show();
      },
      () => {
        this.hideableSignedInButtonsContainer.hide();
      }
    );
  }

  private signIn(): void {
    this.window.open("/oauth_start");
    this.checkSignInStatusCountdown =
      PageShellComponent.CHECK_SIGN_IN_STATUS_MAX_COUNT;
    if (this.checkSignInStatusIntervalId) {
      return;
    }

    this.checkSignInStatusIntervalId = this.window.setInterval(
      () => this.checkSignInStatus(),
      PageShellComponent.CHECK_SIGN_IN_STATUS_INTERVAL
    );
  }

  private checkSignInStatus(): void {
    if (!this.sessionStorage.read()) {
      this.checkSignInStatusCountdown -= 1;
      if (this.checkSignInStatusCountdown <= 0) {
        this.window.clearInterval(this.checkSignInStatusIntervalId);
        this.checkSignInStatusIntervalId = undefined;
      }
    } else {
      this.window.clearInterval(this.checkSignInStatusIntervalId);
      this.checkSignInStatusIntervalId = undefined;
      this.showSignedInButtonsContainer();
    }
  }

  private signOut(): void {
    this.sessionStorage.clear();
    this.showSignInButton();
  }
}
