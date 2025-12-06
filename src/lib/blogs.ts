import blogsData from '@/data/blogs.json';

export interface BlogAuthor {
  name: string;
  avatar: string;
  role: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
}

/**
 * Get all blogs
 */
export function getAllBlogs(): Blog[] {
  return blogsData as Blog[];
}

/**
 * Get featured blogs
 */
export function getFeaturedBlogs(): Blog[] {
  return (blogsData as Blog[]).filter(blog => blog.featured);
}

/**
 * Get blog by ID
 */
export function getBlogById(id: string): Blog | undefined {
  return (blogsData as Blog[]).find(blog => blog.id === id);
}

/**
 * Get blog by slug
 */
export function getBlogBySlug(slug: string): Blog | undefined {
  return (blogsData as Blog[]).find(blog => blog.slug === slug);
}

/**
 * Get blogs by category
 */
export function getBlogsByCategory(category: string): Blog[] {
  return (blogsData as Blog[]).filter(blog => blog.category === category);
}

