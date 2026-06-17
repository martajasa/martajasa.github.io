/**
 * @jest-environment jsdom
 */

const { createBoxlayout } = require('../src/boxlayout');

// Minimal jQuery-like mock for testing
function createMockElement(selector) {
  const dataStore = {};
  const el = {
    selector,
    classes: new Set(),
    eventHandlers: {},
    _eqElements: {},
    _items: null,
    _domElement: document.createElement('section'),
    length: 0,
    addClass(cls) {
      cls.split(' ').forEach(c => this.classes.add(c));
      return this;
    },
    removeClass(cls) {
      cls.split(' ').forEach(c => this.classes.delete(c));
      return this;
    },
    hasClass(cls) {
      return this.classes.has(cls);
    },
    on(event, handler) {
      if (!this.eventHandlers[event]) this.eventHandlers[event] = [];
      this.eventHandlers[event].push(handler);
      return this;
    },
    off(event) {
      delete this.eventHandlers[event];
      return this;
    },
    trigger(event, extraData) {
      const handlers = this.eventHandlers[event] || [];
      handlers.forEach(h => h.call(this, extraData || { target: this._domElement }));
      return this;
    },
    find(sel) {
      if (!this._findCache) this._findCache = {};
      if (!this._findCache[sel]) {
        this._findCache[sel] = createMockElement(sel);
        this._findCache[sel]._parent = this;
      }
      return this._findCache[sel];
    },
    eq(index) {
      if (!this._eqElements[index]) {
        this._eqElements[index] = createMockElement(`${this.selector}:eq(${index})`);
        this._eqElements[index]._index = index;
      }
      return this._eqElements[index];
    },
    index() {
      return this._index || 0;
    },
    each(fn) {
      if (this._items) {
        this._items.forEach((item, i) => fn.call(item, i, item));
      }
      return this;
    },
    children() {
      return this;
    },
    data(key, val) {
      if (val === undefined) return dataStore[key];
      dataStore[key] = val;
      return this;
    },
    is(sel) {
      return this._domElement && this._domElement.tagName.toLowerCase() === sel;
    },
  };
  return el;
}

describe('Boxlayout', () => {
  let $el, $sections, $sectionWork, $workItems, $workPanelsContainer, $workPanels, $nextWorkItem, $closeWorkItem;
  let sectionElements;

  beforeEach(() => {
    $el = createMockElement('#bl-main');
    $sections = createMockElement('sections');
    $sectionWork = createMockElement('#bl-work-section');
    $workItems = createMockElement('#bl-work-items > li');
    $workPanelsContainer = createMockElement('#bl-panel-work-items');
    $workPanels = createMockElement('.bl-panel');
    $workPanels.length = 3;
    $nextWorkItem = createMockElement('nav > span.bl-next-work');
    $closeWorkItem = createMockElement('nav > span.bl-icon-close');

    // Create mock section items that will be iterated via each()
    sectionElements = [createMockElement('section-0'), createMockElement('section-1')];
    $sections._items = sectionElements;

    // Global $ mock - returns the element itself (simulates $(this))
    global.$ = jest.fn((arg) => {
      if (typeof arg === 'object' && arg.selector) return arg;
      if (typeof arg === 'object') {
        // Wrapping a raw DOM element or mock - return it as is
        const wrapped = createMockElement('wrapped');
        wrapped._domElement = arg;
        wrapped.is = (sel) => {
          if (arg.tagName) return arg.tagName.toLowerCase() === sel;
          if (arg._domElement) return arg._domElement.tagName.toLowerCase() === sel;
          return false;
        };
        return wrapped;
      }
      return createMockElement(arg);
    });
  });

  afterEach(() => {
    delete global.$;
  });

  describe('createBoxlayout', () => {
    test('should create a boxlayout instance with init method', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      expect(boxlayout).toHaveProperty('init');
      expect(typeof boxlayout.init).toBe('function');
    });

    test('should expose state via getState', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      const state = boxlayout.getState();
      expect(state.isAnimating).toBe(false);
      expect(state.currentWorkPanel).toBe(0);
      expect(state.totalWorkPanels).toBe(3);
    });

    test('should register event handlers on init', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      boxlayout.init();

      // Verify that click handlers were registered on work items
      expect($workItems.eventHandlers['click']).toBeDefined();
      expect($workItems.eventHandlers['click'].length).toBe(1);
      expect($nextWorkItem.eventHandlers['click']).toBeDefined();
      expect($closeWorkItem.eventHandlers['click']).toBeDefined();
    });

    test('section click should expand section and add classes', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      boxlayout.init();

      // Get the section and simulate click
      const section = sectionElements[0];
      const clickHandler = section.eventHandlers['click'][0];
      clickHandler.call(section);

      expect(section.data('open')).toBe(true);
      expect(section.hasClass('bl-expand')).toBe(true);
      expect(section.hasClass('bl-expand-top')).toBe(true);
      expect($el.hasClass('bl-expand-item')).toBe(true);
    });

    test('section click should not re-expand if already open', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      boxlayout.init();

      const section = sectionElements[0];
      const clickHandler = section.eventHandlers['click'][0];

      // First click - expand
      clickHandler.call(section);
      expect(section.data('open')).toBe(true);

      // Clear classes to verify second click doesn't re-add them
      section.classes.clear();
      $el.classes.clear();

      // Second click - should not re-expand (data('open') is already true)
      clickHandler.call(section);
      expect(section.hasClass('bl-expand')).toBe(false);
    });

    test('work item click should show panel and scale down section', () => {
      const mockPanel = createMockElement('.panel');
      mockPanel._index = 2;
      mockPanel.index = () => 2;
      $workPanelsContainer.find = jest.fn().mockReturnValue(mockPanel);

      // Mock $(this).data('panel') for work item
      const workItemEl = createMockElement('li');
      workItemEl.data = (key) => 'panel-1';
      global.$ = jest.fn((arg) => {
        if (arg === workItemEl || arg === workItemEl._domElement) return workItemEl;
        return createMockElement('any');
      });

      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      boxlayout.init();

      // Simulate work item click
      const clickHandler = $workItems.eventHandlers['click'][0];
      const result = clickHandler.call(workItemEl, {});

      expect($sectionWork.hasClass('bl-scale-down')).toBe(true);
      expect($workPanelsContainer.hasClass('bl-panel-items-show')).toBe(true);
      expect(mockPanel.hasClass('bl-show-work')).toBe(true);
      expect(result).toBe(false);
    });

    test('next work item click should navigate to next panel', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: false,
      });

      boxlayout.init();

      const clickHandler = $nextWorkItem.eventHandlers['click'][0];
      const result = clickHandler.call($nextWorkItem, {});

      expect(result).toBe(false);
      const state = boxlayout.getState();
      expect(state.currentWorkPanel).toBe(1);
      // Without transitions, isAnimating should be reset
      expect(state.isAnimating).toBe(false);
    });

    test('next work item should wrap around to first panel', () => {
      $workPanels.length = 2;

      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: false,
      });

      boxlayout.init();

      const clickHandler = $nextWorkItem.eventHandlers['click'][0];

      // Navigate to panel 1
      clickHandler.call($nextWorkItem, {});
      expect(boxlayout.getState().currentWorkPanel).toBe(1);

      // Navigate wraps back to panel 0
      clickHandler.call($nextWorkItem, {});
      expect(boxlayout.getState().currentWorkPanel).toBe(0);
    });

    test('next work item should not navigate while animating (with transitions)', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      boxlayout.init();

      const clickHandler = $nextWorkItem.eventHandlers['click'][0];

      // First click starts animation
      clickHandler.call($nextWorkItem, {});
      expect(boxlayout.getState().isAnimating).toBe(true);
      expect(boxlayout.getState().currentWorkPanel).toBe(1);

      // Second click should be blocked because isAnimating is true
      clickHandler.call($nextWorkItem, {});
      expect(boxlayout.getState().currentWorkPanel).toBe(1);
    });

    test('close work panel should clean up classes', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      boxlayout.init();

      // Set up initial state as if a work panel is open
      $sectionWork.addClass('bl-scale-down');
      $workPanelsContainer.addClass('bl-panel-items-show');

      const clickHandler = $closeWorkItem.eventHandlers['click'][0];
      const result = clickHandler.call($closeWorkItem, {});

      expect($sectionWork.hasClass('bl-scale-down')).toBe(false);
      expect($workPanelsContainer.hasClass('bl-panel-items-show')).toBe(false);
      expect(result).toBe(false);
    });

    test('close section without transitions removes bl-expand-top immediately', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: false,
      });

      boxlayout.init();

      const section = sectionElements[0];

      // Expand section first
      const clickHandler = section.eventHandlers['click'][0];
      clickHandler.call(section);
      expect(section.hasClass('bl-expand-top')).toBe(true);
      expect($el.hasClass('bl-expand-item')).toBe(true);

      // The close handler was registered on section.find('span.bl-icon-close')
      // Since find() now caches, we can retrieve the same element
      const closeBtn = section.find('span.bl-icon-close');
      const closeHandler = closeBtn.eventHandlers['click'][0];
      closeHandler.call(closeBtn);

      // Without transitions, bl-expand-top should be removed immediately
      expect(section.hasClass('bl-expand-top')).toBe(false);
      expect(section.hasClass('bl-expand')).toBe(false);
      expect($el.hasClass('bl-expand-item')).toBe(false);
    });

    test('close section with transitions registers transitionend handler', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      boxlayout.init();

      const section = sectionElements[0];

      // Expand section first
      const clickHandler = section.eventHandlers['click'][0];
      clickHandler.call(section);
      expect(section.hasClass('bl-expand-top')).toBe(true);

      // Close section
      const closeBtn = section.find('span.bl-icon-close');
      const closeHandler = closeBtn.eventHandlers['click'][0];
      const result = closeHandler.call(closeBtn);

      // bl-expand removed immediately
      expect(section.hasClass('bl-expand')).toBe(false);
      expect($el.hasClass('bl-expand-item')).toBe(false);
      expect(result).toBe(false);

      // transitionend handler should be registered
      expect(section.eventHandlers['transitionend']).toBeDefined();

      // Simulate transitionend with a section target
      section._domElement = document.createElement('section');
      const transHandler = section.eventHandlers['transitionend'][0];
      transHandler.call(section, { target: section._domElement });

      // After transition end, bl-expand-top removed
      expect(section.hasClass('bl-expand-top')).toBe(false);
    });

    test('close section transition handler ignores non-section targets', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      boxlayout.init();

      const section = sectionElements[0];

      // Expand then close
      const clickHandler = section.eventHandlers['click'][0];
      clickHandler.call(section);
      const closeBtn = section.find('span.bl-icon-close');
      closeBtn.eventHandlers['click'][0].call(closeBtn);

      // Simulate transitionend with a non-section target (e.g., a div)
      const transHandler = section.eventHandlers['transitionend'][0];

      // Mock $(event.target).is('section') to return false
      global.$ = jest.fn(() => ({
        is: () => false,
        off: jest.fn().mockReturnThis(),
        removeClass: jest.fn().mockReturnThis(),
      }));

      const result = transHandler.call(section, { target: document.createElement('div') });
      expect(result).toBe(false);
    });

    test('transition end callback removes bl-expand-top class', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      boxlayout.init();

      // Navigate next - triggers transition on current panel
      const clickHandler = $nextWorkItem.eventHandlers['click'][0];
      clickHandler.call($nextWorkItem, {});

      // After transition ends on the panel, isAnimating should be reset
      const panel0 = $workPanels.eq(0);
      expect(panel0.hasClass('bl-hide-current-work')).toBe(true);

      // Simulate transition end event
      if (panel0.eventHandlers['transitionend']) {
        const transHandler = panel0.eventHandlers['transitionend'][0];
        const mockEvent = { target: document.createElement('div') };
        transHandler.call(panel0, mockEvent);
        expect(panel0.hasClass('bl-hide-current-work')).toBe(false);
        expect(boxlayout.getState().isAnimating).toBe(false);
      }
    });

    test('next panel should add bl-show-work class', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: false,
      });

      boxlayout.init();

      const clickHandler = $nextWorkItem.eventHandlers['click'][0];
      clickHandler.call($nextWorkItem, {});

      const panel1 = $workPanels.eq(1);
      expect(panel1.hasClass('bl-show-work')).toBe(true);
    });

    test('current panel should have bl-hide-current-work removed without transitions', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: false,
      });

      boxlayout.init();

      const clickHandler = $nextWorkItem.eventHandlers['click'][0];
      clickHandler.call($nextWorkItem, {});

      const panel0 = $workPanels.eq(0);
      // Without transitions, bl-hide-current-work should be removed immediately
      expect(panel0.hasClass('bl-hide-current-work')).toBe(false);
    });

    test('next panel transition handler ignores non-div targets', () => {
      const boxlayout = createBoxlayout({
        $el, $sections, $sectionWork, $workItems, $workPanelsContainer,
        $workPanels, $nextWorkItem, $closeWorkItem,
        transEndEventName: 'transitionend',
        supportTransitions: true,
      });

      boxlayout.init();

      const clickHandler = $nextWorkItem.eventHandlers['click'][0];
      clickHandler.call($nextWorkItem, {});

      const panel0 = $workPanels.eq(0);

      // Mock $(event.target).is('div') to return false (e.g., a span triggered the event)
      global.$ = jest.fn(() => ({
        is: () => false,
        off: jest.fn().mockReturnThis(),
        removeClass: jest.fn().mockReturnThis(),
      }));

      const transHandler = panel0.eventHandlers['transitionend'][0];
      const result = transHandler.call(panel0, { target: document.createElement('span') });
      expect(result).toBe(false);
      // isAnimating should still be true since the handler returned early
      expect(boxlayout.getState().isAnimating).toBe(true);
    });
  });
});
