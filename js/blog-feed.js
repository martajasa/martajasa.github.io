/**
 * Blog Feed Renderer
 * Fetches posts from the Blogger API and renders them as cards.
 *
 * Usage:
 *   BlogFeed.render('blog-feed', { apiKey: '...', blogId: '...', maxResults: 10 });
 */
var BlogFeed = (function () {
    'use strict';

    function extractThumbnail(html) {
        var match = html.match(/<img[^>]+src="([^">]+)"/);
        return match ? match[1] : '';
    }

    function extractDescription(html, maxLen) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        var text = tmp.textContent || tmp.innerText || '';
        return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
    }

    function buildCard(title, link, thumbnail, description) {
        var card = document.createElement('article');
        card.className = 'blog-card';

        var html = '';
        if (thumbnail) {
            html += '<div class="blog-card__thumbnail">' +
                '<img src="' + thumbnail + '" alt="' + title + '">' +
                '</div>';
        }
        html += '<div class="blog-card__body">' +
            '<h4 class="blog-card__title">' + title + '</h4>' +
            '<p class="blog-card__description">' + description + '</p>' +
            '<a href="' + link + '" target="_blank" class="blog-card__link">Read Article &rarr;</a>' +
            '</div>';

        card.innerHTML = html;
        return card;
    }

    function render(containerId, opts) {
        var apiKey = opts.apiKey;
        var blogId = opts.blogId;
        var maxResults = opts.maxResults || 10;
        var descriptionLen = opts.descriptionLen || 120;

        var url = 'https://www.googleapis.com/blogger/v3/blogs/' + blogId +
            '/posts?key=' + apiKey + '&maxResults=' + maxResults;

        fetch(url)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                var container = document.getElementById(containerId);
                container.className = 'blog-feed-grid';

                if (data.items && data.items.length > 0) {
                    data.items.forEach(function (item) {
                        var thumbnail = item.content ? extractThumbnail(item.content) : '';
                        var description = item.content ? extractDescription(item.content, descriptionLen) : '';
                        container.appendChild(buildCard(item.title, item.url, thumbnail, description));
                    });
                } else {
                    container.innerHTML = '<p class="blog-feed-empty">No blog posts available at this time.</p>';
                }
            })
            .catch(function () {
                document.getElementById(containerId).innerHTML =
                    '<p class="blog-feed-empty">Unable to load blog posts. Please try again later.</p>';
            });
    }

    return { render: render };
})();
