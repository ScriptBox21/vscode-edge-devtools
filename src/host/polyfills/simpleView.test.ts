// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getTextFromFile } from "../../test/helpers";

describe("simpleView", () => {
    it("revealInVSCode calls openInEditor", async () => {
        const apply = await import("./simpleView");
        const expected = {
            columnNumber: 0,
            lineNumber: 0,
            omitFocus: false,
            uiSourceCode: {
                _url: "http://bing.com",
            },
        };
        const mockOpen = jest.fn();
        (global as any).InspectorFrontendHost = {
            openInEditor: mockOpen,
        };

        await apply.revealInVSCode(expected, expected.omitFocus);

        expect(mockOpen).toHaveBeenCalled();
    });

    it("applyCommonRevealerPatch correctly changes text", async () => {
        const comparableText = "let reveal = function(revealable, omitFocus) {";
        let fileContents = getTextFromFile("common/Revealer.js");

        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;

        const apply = await import("./simpleView");
        const result = apply.applyCommonRevealerPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(
            expect.stringContaining("let reveal = function revealInVSCode(revealable, omitFocus) {"));
    });

    it("applyInspectorViewPatch correctly changes handleAction text", async () => { 
        const comparableText = "handleAction(context, actionId) {\n";
        let fileContents = getTextFromFile("ui/InspectorView.js");
        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;

        const apply = await import("./simpleView");
        const result = apply.applyInspectorViewHandleActionPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(
            expect.stringContaining("handleAction(context, actionId) { return false;"));
    });

    it("applyInspectorViewPatch correctly changes _showDrawer text", async () => {
        const comparableText = "_showDrawer(focus) {";
        let fileContents = getTextFromFile("ui/InspectorView.js");
        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;

        const apply = await import("./simpleView");
        const result = apply.applyInspectorViewShowDrawerPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(expect.stringContaining("_showDrawer(focus) { return false;"));
    });

    it("applyMainViewPatch correctly changes text", async () => {
        const comparableText = "const moreTools = getExtensions();";
        let fileContents = getTextFromFile("main/MainImpl.js");

        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;
        const apply = await import("./simpleView");
        const result = apply.applyMainViewPatch(comparableText);
        expect(result).not.toEqual(null);
        expect(result).toEqual(
            expect.stringContaining("const moreTools = { defaultSection: () => ({ appendItem: () => {} }) };"));
    });

    it("applyInspectorCommonCssPatch correctly changes tabbed-pane-tab-slider", async () => {
        const comparableText = `.tabbed-pane-tab-slider {
            height: 2px;
            position: absolute;
            bottom: -1px;
            background-color: var(--accent-color);
            left: 0;
            z-index: 50;
            transform-origin: 0 100%;
            transition: transform 150ms cubic-bezier(0, 0, 0.2, 1);
            visibility: hidden;
        }`;
        const expectedResult = `.tabbed-pane-tab-slider {
            display: none !important;
        }`;
        let fileContents = getTextFromFile("shell.js");

        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;
        const apply = await import("./simpleView");
        const result = apply.applyInspectorCommonCssTabSliderPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(expect.stringContaining(expectedResult));
    });

    it("applyInspectorCommonCssRightToolbarPatch correctly changes tabbed-pane-right-toolbar", async () => {
        const comparableText = `.tabbed-pane-right-toolbar {
            margin-left: -4px;
            flex: none;
        }`;
        const expectedResult = `.tabbed-pane-right-toolbar {
            display: none !important;
        }`;
        let fileContents = getTextFromFile("shell.js");

        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;
        const apply = await import("./simpleView");
        const result = apply.applyInspectorCommonCssRightToolbarPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(expect.stringContaining(expectedResult));
    });

    it("applyInspectorCommonCssTabSliderPatch correctly changes tabbed-pane-tab-slider in release mode", async () => {
        const comparableText = `.tabbed-pane-tab-slider {
            height: 2px;
            position: absolute;
            bottom: -1px;
            background-color: var(--accent-color);
            left: 0;
            z-index: 50;
            transform-origin: 0 100%;
            transition: transform 150ms cubic-bezier(0, 0, 0.2, 1);
            visibility: hidden;
        }`;
        const expectedResult =
            ".tabbed-pane-tab-slider {\\n            display: none !important;\\n        }";
        let fileContents = getTextFromFile("shell.js");

        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;
        const apply = await import("./simpleView");
        const result = apply.applyInspectorCommonCssTabSliderPatch(fileContents, true);
        expect(result).not.toEqual(null);
        expect(result).toEqual(expect.stringContaining(expectedResult));
    });

    it("applyInspectorCommonCssRightToolbarPatch correctly changes tabbed-pane-right-toolbar in release mode", async () => {
        const comparableText = `.tabbed-pane-right-toolbar {
            margin-left: -4px;
            flex: none;
        }`;
        const expectedResult =
            ".tabbed-pane-right-toolbar {\\n            display: none !important;\\n        }";
        let fileContents = getTextFromFile("shell.js");

        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;
        const apply = await import("./simpleView");
        const result = apply.applyInspectorCommonCssRightToolbarPatch(fileContents, true);
        expect(result).not.toEqual(null);
        expect(result).toEqual(expect.stringContaining(expectedResult));
    });

    it("applyDrawerTabLocationPatch correctly changes text", async () => {
        const apply = await import("./simpleView");

        const comparableText = "this._showDrawer.bind(this, false), 'drawer-view', true, true";
        let fileContents = getTextFromFile("ui/InspectorView.js");
        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;
        const result = apply.applyDrawerTabLocationPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(expect.stringContaining(
            "this._showDrawer.bind(this, false), 'drawer-view', true, true, 'network.blocked-urls'"));
    });

    it("applyMainTabTabLocationPatch correctly changes text", async () => {
        const apply = await import("./simpleView");

        const comparableText = "InspectorFrontendHostInstance), 'panel', true, true, Root.Runtime.queryParam('panel')";
        let fileContents = getTextFromFile("ui/InspectorView.js");
        // The file was not found, so test that at least the text is being replaced.
        fileContents = fileContents ? fileContents : comparableText;
        const result = apply.applyMainTabTabLocationPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(expect.stringContaining("InspectorFrontendHostInstance), 'panel', true, true, 'network'"));
    });

    it("applyAppendTabPatch correctly changes text", async () => {
        const apply = await import("./simpleView");
        const comparableText = "appendTab(id, tabTitle, view, tabTooltip, userGesture, isCloseable, index) {"

        let fileContents = getTextFromFile("ui/TabbedPane.js");
        fileContents = fileContents ? fileContents : comparableText;
        const result = apply.applyAppendTabPatch(fileContents);
        expect(result).not.toEqual(null);
        expect(result).toEqual(expect.stringContaining("appendTab(id, tabTitle, view, tabTooltip, userGesture, isCloseable, index) { if (id"));
    });

    it("applyInspectorCommonCssPatch correctly changes text", async () => {
        const apply = await import("./simpleView");
        const comparableText = ":host-context(.platform-mac) .monospace,";
        let fileContents = getTextFromFile("shell.js");
        fileContents = fileContents ? fileContents : comparableText;
        const result = apply.applyInspectorCommonCssPatch(fileContents);

        // If this part of the css was correctly applied to the file, the rest of the css will be there as well.
        const expectedString = ".toolbar-button[aria-label='Toggle screencast'] {\n            visibility: visible !important;"

        expect(result).not.toEqual(null);
        if (result) {
          expect(result).toEqual(expect.stringContaining(expectedString));
        }
    });

    it("applyInspectorCommonCssPatch correctly changes text in release mode", async () => {
        const apply = await import("./simpleView");
        const comparableText = ":host-context(.platform-mac) .monospace,";
        let fileContents = getTextFromFile("shell.js");
        fileContents = fileContents ? fileContents : comparableText;
        const result = apply.applyInspectorCommonCssPatch(fileContents, true);

        const expectedString = ".toolbar-button[aria-label='Toggle screencast'] {\\n            visibility: visible !important;";

        expect(result).not.toEqual(null);
        if (result) {
          expect(result).toEqual(expect.stringContaining(expectedString));
        }
    });

    it("applyShowElementsTab correctly changes text", async () => {
      const apply = await import("./simpleView");
      const comparableText = "this._defaultTab = defaultTab;";
      let fileContents = getTextFromFile("ui/ViewManager.js");
      fileContents = fileContents ? fileContents : comparableText;
      const result = apply.applyShowElementsTab(fileContents);
      expect(result).not.toEqual(null);
      if (result) {
        expect(result).toEqual(expect.stringContaining("this._defaultTab = 'elements';"));
      }
  });
});
