import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';
const prisma = new PrismaClient();

export const createNewPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, cover, slug, content, published, categories, tags, authorId } =
    req.body;
  try {
    const post = await prisma.post.findFirst({
      where: { OR: [{ title }, { slug }] },
    });
    if (post) {
      return res.status(409).json({
        status: false,
        message: 'Post with this title or slug already exists',
      });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        subtitle: title,
        cover,
        slug,
        content,
        published,
        author: { connect: { id: authorId } },
        categories: {
          create: categories.map((categoryId: string) => ({
            category: {
              connect: {
                id: categoryId,
              },
            },
          })),
        },
        tags: {
          create: tags.map((tagId: string) => ({
            tag: {
              connect: {
                id: tagId,
              },
            },
          })),
        },
      },
    });
    res.status(200).json({
      status: true,
      message: 'Post created successful',
      data: newPost,
    });
  } catch (error: any) {
    return next(
      res.status(500).json({ status: 'error', message: error.message })
    );
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title, cover, slug, content, published, authorId, categories, tags } =
    req.body;
  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        cover,
        slug,
        content,
        published,
        author: { connect: { id: authorId } },
        // categories,
        // tags,
      },
    });
    res.status(200).json({
      status: true,
      message: 'Post updated successful',
      data: updatedPost,
    });
  } catch (error: any) {
    next(createError(error));
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageIndex = req.query.pageIndex
      ? parseInt(req.query.pageIndex as string)
      : 0; // Updated to start from 0
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 10;

    const totalPosts = await prisma.post.count();

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      skip: pageIndex * pageSize, // Updated to multiply by pageSize
      take: pageSize,
    });

    const processedPosts = posts.map(
      (post: { categories: any[]; tags: any[] }) => {
        const categories = post.categories.map(
          (categoryOnPost) => categoryOnPost.category.name
        );
        const tags = post.tags.map((tagOnPost) => tagOnPost.tag.name);

        return {
          ...post,
          categories,
          tags,
        };
      }
    );

    res.status(200).json({
      status: true,
      message: 'All posts retrieved successfully',
      data: processedPosts,
      pageInfo: {
        currentPage: pageIndex,
        pageSize,
        totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize),
      },
    });
  } catch (error: any) {
    next(createError(error.message));
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    if (!post) return res.status(404).json({ message: 'Post already exists' });

    const categoriesWithLabelValue = post.categories.map(
      ({ category }: any) => {
        return {
          label: category.name, // Assuming category has a 'name' field
          value: category.id, // Assuming category has an 'id' field
        };
      }
    );

    const tagsWithLabelValue = post.tags.map(({ tag }: any) => ({
      label: tag.name, // Assuming tag has a 'name' field
      value: tag.id, // Assuming tag has an 'id' field
    }));

    // Create a new object with categories in the desired format
    const postWithFormattedCategories = {
      ...post,
      categories: categoriesWithLabelValue,
      tags: tagsWithLabelValue,
    };
    res.json(postWithFormattedCategories);
  } catch (error: any) {
    next(createError(error));
  }
};

export const publishPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { published: true },
    });
    if (!post)
      return res.status(404).json({ message: 'Post id not in database' });

    res.status(200).json({
      status: 200,
      message: 'Post successfully published',
    });
  } catch (error: any) {
    next(res.status(500).json({ message: error.message }));
  }
};

export const unpublishPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { published: false },
    });
    if (!post)
      return res.status(404).json({ message: 'Post id not in database' });

    res.status(200).json({
      status: 200,
      message: 'Post successfully published',
      post,
    });
  } catch (error: any) {
    next(res.status(500).json({ message: error.message }));
  }
};

export const bulkUnpublish = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postIds } = req.body;

  if (!postIds || !Array.isArray(postIds) || postIds.length === 0)
    return res.status(400).json({ status: 400, message: 'Invalid postIds' });

  try {
    // Update the published status of posts with the specified IDs
    const publishedPosts = await prisma.post.updateMany({
      where: {
        id: {
          in: postIds,
        },
      },
      data: {
        published: false,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Posts published successfully',
      publishedPosts: publishedPosts,
    });
  } catch (error: any) {
    next(createError(error.message));
  }
};

export const bulkPublish = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postIds } = req.body;

  if (!postIds || !Array.isArray(postIds) || postIds.length === 0)
    return res.status(400).json({ status: 400, message: 'Invalid postIds' });

  try {
    // Update the published status of posts with the specified IDs
    const publishedPosts = await prisma.post.updateMany({
      where: {
        id: {
          in: postIds,
        },
      },
      data: {
        published: true,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Posts published successfully',
      publishedPosts: publishedPosts,
    });
  } catch (error: any) {
    next(createError(error.message));
  }
};

export const getPostsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        categories: {
          some: {
            id: categoryId,
          } as any,
        },
      },
    });
    res.json(posts);
  } catch (error: any) {
    next(createError(error));
  }
};

export const getPostsByTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tagId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        tags: {
          some: {
            id: tagId,
          } as any,
        },
      },
    });
    res.json(posts);
  } catch (error: any) {
    next(createError(error));
  }
};

export const getPostsByAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        author: {
          some: {
            id: authorId,
          },
        } as any,
      },
    });
    res.json(posts);
  } catch (error: any) {
    next(createError(error));
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    // First, delete related records in CategoryOnPosts table
    await prisma.categoryOnPosts.deleteMany({
      where: { postId: id },
    });

    await prisma.tagOnPosts.deleteMany({
      where: { postId: id },
    });

    // Then, delete the post
    await prisma.post.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ status: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    console.log('Error:', error.message);
    next(createError(error.message));
  }
};

export const bulkDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postIds } = req.body;

  if (!postIds || !Array.isArray(postIds) || postIds.length === 0)
    return res.status(400).json({ status: 400, message: 'Invalid postIds' });

  try {
    // Delete posts with the specified IDs
    const deletedPosts = await prisma.post.deleteMany({
      where: {
        id: {
          in: postIds,
        },
      },
    });

    res.status(200).json({
      status: true,
      message: 'Posts deleted successfully',
      deletedPosts: deletedPosts,
    });
  } catch (error: any) {
    next(createError(error.message));
  }
};
