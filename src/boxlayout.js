/**
 * Boxlayout module
 * Handles expanding/collapsing sections and work panel navigation.
 * Based on: https://tympanus.net/codrops/2013/04/23/fullscreen-layout-with-page-transitions/
 */

function createBoxlayout({ $el, $sections, $sectionWork, $workItems, $workPanelsContainer, $workPanels, $nextWorkItem, $closeWorkItem, transEndEventName, supportTransitions }) {
  let isAnimating = false;
  let currentWorkPanel = 0;
  const totalWorkPanels = $workPanels.length;

  function init() {
    initEvents();
  }

  function initEvents() {
    $sections.each(function () {
      const $section = $(this);

      $section.on('click', function () {
        if (!$section.data('open')) {
          $section.data('open', true).addClass('bl-expand bl-expand-top');
          $el.addClass('bl-expand-item');
        }
      }).find('span.bl-icon-close').on('click', function () {
        $section.data('open', false).removeClass('bl-expand').on(transEndEventName, function (event) {
          if (!$(event.target).is('section')) return false;
          $(this).off(transEndEventName).removeClass('bl-expand-top');
        });

        if (!supportTransitions) {
          $section.removeClass('bl-expand-top');
        }

        $el.removeClass('bl-expand-item');
        return false;
      });
    });

    $workItems.on('click', function (event) {
      $sectionWork.addClass('bl-scale-down');
      $workPanelsContainer.addClass('bl-panel-items-show');

      const $panel = $workPanelsContainer.find("[data-panel='" + $(this).data('panel') + "']");
      currentWorkPanel = $panel.index();
      $panel.addClass('bl-show-work');

      return false;
    });

    $nextWorkItem.on('click', function (event) {
      if (isAnimating) {
        return false;
      }
      isAnimating = true;

      const $currentPanel = $workPanels.eq(currentWorkPanel);
      currentWorkPanel = currentWorkPanel < totalWorkPanels - 1 ? currentWorkPanel + 1 : 0;
      const $nextPanel = $workPanels.eq(currentWorkPanel);

      $currentPanel.removeClass('bl-show-work').addClass('bl-hide-current-work').on(transEndEventName, function (event) {
        if (!$(event.target).is('div')) return false;
        $(this).off(transEndEventName).removeClass('bl-hide-current-work');
        isAnimating = false;
      });

      if (!supportTransitions) {
        $currentPanel.removeClass('bl-hide-current-work');
        isAnimating = false;
      }

      $nextPanel.addClass('bl-show-work');
      return false;
    });

    $closeWorkItem.on('click', function (event) {
      $sectionWork.removeClass('bl-scale-down');
      $workPanelsContainer.removeClass('bl-panel-items-show');
      $workPanels.eq(currentWorkPanel).removeClass('bl-show-work');
      return false;
    });
  }

  return {
    init,
    // Expose state for testing
    getState: () => ({ isAnimating, currentWorkPanel, totalWorkPanels }),
  };
}

module.exports = { createBoxlayout };
