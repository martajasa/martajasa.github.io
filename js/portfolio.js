/**
 * Portfolio Renderer
 * Generates work-item thumbnails and detail panels from a data array,
 * eliminating the repeated markup in both index.html and index.php.
 *
 * Usage:
 *   Portfolio.renderWorkItems('bl-work-items', portfolioData);
 *   Portfolio.renderPanelItems('bl-panel-work-items', portfolioData);
 */
var Portfolio = (function () {
    'use strict';

    /**
     * Render thumbnail list items into the <ul id="bl-work-items"> element.
     * @param {string} containerId  - id of the <ul> element
     * @param {Array}  items        - array of { panel, image, title, description }
     */
    function renderWorkItems(containerId, items) {
        var ul = document.getElementById(containerId);
        if (!ul) return;

        items.forEach(function (item) {
            var li = document.createElement('li');
            li.setAttribute('data-panel', item.panel);

            var a = document.createElement('a');
            a.href = '#';

            var img = document.createElement('img');
            img.src = item.image;

            a.appendChild(img);
            li.appendChild(a);
            ul.appendChild(li);
        });
    }

    /**
     * Render detail panels inside <div id="bl-panel-work-items">.
     * Inserts panels before the existing <nav> element.
     * @param {string} containerId  - id of the panel container
     * @param {Array}  items        - array of { panel, image, title, description }
     */
    function renderPanelItems(containerId, items) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var nav = container.querySelector('nav');

        items.forEach(function (item) {
            var outer = document.createElement('div');
            outer.setAttribute('data-panel', item.panel);

            var inner = document.createElement('div');

            var img = document.createElement('img');
            img.src = item.image;
            inner.appendChild(img);

            var h3 = document.createElement('h3');
            h3.textContent = item.title;
            inner.appendChild(h3);

            var p = document.createElement('p');
            p.textContent = item.description;
            inner.appendChild(p);

            outer.appendChild(inner);

            if (nav) {
                container.insertBefore(outer, nav);
            } else {
                container.appendChild(outer);
            }
        });
    }

    return {
        renderWorkItems: renderWorkItems,
        renderPanelItems: renderPanelItems
    };
})();
