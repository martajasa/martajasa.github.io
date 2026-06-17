/**
 * @jest-environment jsdom
 */

const {
  extractThumbnail,
  extractDescription,
  buildCardHTML,
  createArticleCard,
  renderBlogPosts,
  fetchBlogPosts,
} = require('../src/blog-feed');

describe('Blog Feed Module', () => {

  describe('extractThumbnail', () => {
    test('should extract image URL from HTML content', () => {
      const html = '<p>Some text</p><img src="https://example.com/image.jpg" alt="Test">';
      expect(extractThumbnail(html)).toBe('https://example.com/image.jpg');
    });

    test('should return first image when multiple images exist', () => {
      const html = '<img src="https://first.com/1.png"><img src="https://second.com/2.png">';
      expect(extractThumbnail(html)).toBe('https://first.com/1.png');
    });

    test('should return empty string when no image exists', () => {
      const html = '<p>No images here</p>';
      expect(extractThumbnail(html)).toBe('');
    });

    test('should return empty string for null/undefined input', () => {
      expect(extractThumbnail(null)).toBe('');
      expect(extractThumbnail(undefined)).toBe('');
      expect(extractThumbnail('')).toBe('');
    });

    test('should handle image with complex attributes', () => {
      const html = '<img class="photo" width="600" src="https://cdn.example.com/photo.webp" loading="lazy">';
      expect(extractThumbnail(html)).toBe('https://cdn.example.com/photo.webp');
    });
  });

  describe('extractDescription', () => {
    test('should extract plain text from HTML', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      expect(extractDescription(html)).toBe('Hello World');
    });

    test('should truncate text exceeding maxLength with ellipsis', () => {
      const html = '<p>' + 'A'.repeat(200) + '</p>';
      const result = extractDescription(html, 120);
      expect(result.length).toBe(123); // 120 + '...'
      expect(result.endsWith('...')).toBe(true);
    });

    test('should not add ellipsis for short text', () => {
      const html = '<p>Short text</p>';
      const result = extractDescription(html, 120);
      expect(result).toBe('Short text');
      expect(result.endsWith('...')).toBe(false);
    });

    test('should return empty string for null/undefined input', () => {
      expect(extractDescription(null)).toBe('');
      expect(extractDescription(undefined)).toBe('');
      expect(extractDescription('')).toBe('');
    });

    test('should respect custom maxLength parameter', () => {
      const html = '<p>This is a test paragraph with some content</p>';
      const result = extractDescription(html, 10);
      expect(result).toBe('This is a ...');
    });

    test('should handle nested HTML tags', () => {
      const html = '<div><ul><li>Item 1</li><li>Item 2</li></ul></div>';
      const result = extractDescription(html);
      expect(result).toContain('Item 1');
      expect(result).toContain('Item 2');
    });

    test('should handle text exactly at maxLength boundary', () => {
      const html = '<p>' + 'X'.repeat(120) + '</p>';
      const result = extractDescription(html, 120);
      // Exactly 120 chars - no ellipsis needed
      expect(result).toBe('X'.repeat(120));
      expect(result.endsWith('...')).toBe(false);
    });
  });

  describe('buildCardHTML', () => {
    test('should build card HTML with thumbnail when image exists', () => {
      const item = {
        title: 'Test Post',
        url: 'https://example.com/post',
        content: '<img src="https://img.com/thumb.jpg"><p>Description text here</p>',
      };

      const html = buildCardHTML(item);
      expect(html).toContain('https://img.com/thumb.jpg');
      expect(html).toContain('Test Post');
      expect(html).toContain('https://example.com/post');
      expect(html).toContain('Read Article →');
    });

    test('should build card HTML without thumbnail when no image exists', () => {
      const item = {
        title: 'No Image Post',
        url: 'https://example.com/post2',
        content: '<p>Just text content</p>',
      };

      const html = buildCardHTML(item);
      expect(html).not.toContain('object-fit: cover');
      expect(html).toContain('No Image Post');
      expect(html).toContain('https://example.com/post2');
    });

    test('should handle missing title and url', () => {
      const item = { content: '<p>Content only</p>' };
      const html = buildCardHTML(item);
      expect(html).toContain('href="#"');
      expect(html).toContain('Read Article →');
    });

    test('should handle empty item', () => {
      const html = buildCardHTML({});
      expect(html).toContain('Read Article →');
      expect(html).toContain('href="#"');
    });
  });

  describe('createArticleCard', () => {
    test('should create an article element', () => {
      const card = createArticleCard();
      expect(card.tagName).toBe('ARTICLE');
    });

    test('should have correct initial styles', () => {
      const card = createArticleCard();
      expect(card.style.backgroundColor).toBe('rgb(255, 255, 255)');
      expect(card.style.borderRadius).toBe('8px');
      expect(card.style.overflow).toBe('hidden');
      expect(card.style.cursor).toBe('pointer');
      expect(card.style.border).toBe('1px solid rgb(238, 238, 238)');
    });

    test('should change styles on mouseover', () => {
      const card = createArticleCard();
      card.onmouseover.call(card);
      expect(card.style.backgroundColor).toBe('rgb(250, 250, 250)');
      expect(card.style.transform).toBe('translateY(-5px)');
      expect(card.style.boxShadow).toBe('0 8px 20px rgba(0, 0, 0, 0.08)');
    });

    test('should reset styles on mouseout', () => {
      const card = createArticleCard();
      // First hover
      card.onmouseover.call(card);
      // Then mouseout
      card.onmouseout.call(card);
      expect(card.style.backgroundColor).toBe('rgb(255, 255, 255)');
      expect(card.style.transform).toBe('translateY(0)');
      expect(card.style.boxShadow).toBe('none');
    });
  });

  describe('renderBlogPosts', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
    });

    test('should render posts as a grid', () => {
      const items = [
        { title: 'Post 1', url: 'https://example.com/1', content: '<p>Content 1</p>' },
        { title: 'Post 2', url: 'https://example.com/2', content: '<p>Content 2</p>' },
      ];

      renderBlogPosts(container, items);

      expect(container.style.display).toBe('grid');
      expect(container.style.gap).toBe('20px');
      expect(container.children.length).toBe(2);
      expect(container.children[0].tagName).toBe('ARTICLE');
    });

    test('should show "no posts" message when items array is empty', () => {
      renderBlogPosts(container, []);
      expect(container.innerHTML).toContain('No blog posts available at this time.');
    });

    test('should show "no posts" message when items is null', () => {
      renderBlogPosts(container, null);
      expect(container.innerHTML).toContain('No blog posts available at this time.');
    });

    test('should render correct number of article cards', () => {
      const items = Array.from({ length: 5 }, (_, i) => ({
        title: `Post ${i + 1}`,
        url: `https://example.com/${i + 1}`,
        content: `<p>Content ${i + 1}</p>`,
      }));

      renderBlogPosts(container, items);
      expect(container.querySelectorAll('article').length).toBe(5);
    });

    test('should set grid template columns', () => {
      renderBlogPosts(container, [{ title: 'Test', url: '#', content: '' }]);
      expect(container.style.gridTemplateColumns).toBe('repeat(auto-fill, minmax(300px, 1fr))');
    });
  });

  describe('fetchBlogPosts', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      delete global.fetch;
    });

    test('should fetch posts from Blogger API with correct URL', async () => {
      const mockItems = [{ title: 'Post 1' }, { title: 'Post 2' }];
      global.fetch.mockResolvedValue({
        json: () => Promise.resolve({ items: mockItems }),
      });

      const result = await fetchBlogPosts('test-api-key', '12345', 5);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.googleapis.com/blogger/v3/blogs/12345/posts?key=test-api-key&maxResults=5'
      );
      expect(result).toEqual(mockItems);
    });

    test('should return empty array when no items in response', async () => {
      global.fetch.mockResolvedValue({
        json: () => Promise.resolve({}),
      });

      const result = await fetchBlogPosts('key', 'blog-id');
      expect(result).toEqual([]);
    });

    test('should use default maxResults of 10', async () => {
      global.fetch.mockResolvedValue({
        json: () => Promise.resolve({ items: [] }),
      });

      await fetchBlogPosts('key', 'blog-id');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('maxResults=10')
      );
    });

    test('should propagate fetch errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      await expect(fetchBlogPosts('key', 'id')).rejects.toThrow('Network error');
    });
  });
});
