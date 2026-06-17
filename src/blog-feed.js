/**
 * Blog Feed module
 * Fetches blog posts from the Blogger API and renders them as cards.
 */

/**
 * Extract the first image URL from HTML content.
 * @param {string} htmlContent - HTML string to parse
 * @returns {string} First image URL found, or empty string
 */
function extractThumbnail(htmlContent) {
  if (!htmlContent) return '';
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = htmlContent.match(imgRegex);
  return match ? match[1] : '';
}

/**
 * Extract plain text description from HTML content, limited to maxLength chars.
 * @param {string} htmlContent - HTML string to parse
 * @param {number} maxLength - Max characters for description
 * @returns {string} Truncated plain text
 */
function extractDescription(htmlContent, maxLength = 120) {
  if (!htmlContent) return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const text = tempDiv.textContent || tempDiv.innerText || '';
  return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
}

/**
 * Build the HTML string for a blog article card.
 * @param {object} item - Blog post object with title, url, content
 * @returns {string} HTML string for the card inner content
 */
function buildCardHTML(item) {
  const title = item.title || '';
  const link = item.url || '#';
  const thumbnail = extractThumbnail(item.content);
  const description = extractDescription(item.content);

  let cardHTML = '';

  if (thumbnail) {
    cardHTML += `<div style="width: 100%; height: 180px; overflow: hidden; background: #f8f8f8;">
                <img src="${thumbnail}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
            </div>`;
  }

  cardHTML += `
            <div style="padding: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #808080; font-size: 1.1em; font-weight: 600; line-height: 1.4;">${title}</h4>
                <p style="margin: 0 0 12px 0; color: #808080; font-size: 0.95em; line-height: 1.5;">${description}</p>
                <a href="${link}" target="_blank" style="display: inline-block; color: #808080; text-decoration: none; font-size: 0.85em; font-weight: 600; padding-top: 5px;">Read Article →</a>
            </div>
        `;

  return cardHTML;
}

/**
 * Create a styled article card element.
 * @returns {HTMLElement} Styled article element
 */
function createArticleCard() {
  const articleCard = document.createElement('article');
  articleCard.style.backgroundColor = '#ffffff';
  articleCard.style.borderRadius = '8px';
  articleCard.style.overflow = 'hidden';
  articleCard.style.transition = 'all 0.3s ease';
  articleCard.style.cursor = 'pointer';
  articleCard.style.border = '1px solid #eeeeee';
  articleCard.style.padding = '0px';

  articleCard.onmouseover = function () {
    this.style.backgroundColor = '#fafafa';
    this.style.transform = 'translateY(-5px)';
    this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
  };

  articleCard.onmouseout = function () {
    this.style.backgroundColor = '#ffffff';
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = 'none';
  };

  return articleCard;
}

/**
 * Render blog posts into the container element.
 * @param {HTMLElement} container - DOM element to render posts into
 * @param {Array} items - Array of blog post items
 */
function renderBlogPosts(container, items) {
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
  container.style.gap = '20px';
  container.style.marginTop = '20px';

  if (items && items.length > 0) {
    items.forEach((item) => {
      const articleCard = createArticleCard();
      articleCard.innerHTML = buildCardHTML(item);
      container.appendChild(articleCard);
    });
  } else {
    container.innerHTML = '<p style="color: #808080; padding: 20px; text-align: center;">No blog posts available at this time.</p>';
  }
}

/**
 * Fetch blog posts from the Blogger API.
 * @param {string} apiKey - Google API key
 * @param {string} blogId - Blogger blog ID
 * @param {number} maxResults - Max posts to fetch
 * @returns {Promise<Array>} Array of blog post items
 */
async function fetchBlogPosts(apiKey, blogId, maxResults = 10) {
  const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=${maxResults}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items || [];
}

module.exports = {
  extractThumbnail,
  extractDescription,
  buildCardHTML,
  createArticleCard,
  renderBlogPosts,
  fetchBlogPosts,
};
