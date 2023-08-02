const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const createError = require('http-errors')

exports.createNewPost = async (req, res, next) => {
  const { title, cover, slug, content, published, categories, tags, authorId } = req.body;
  try {
    const post = await prisma.post.findFirst({ 
      where: {OR: [{title},{slug}]},
    })
    console.log("🚀 ~ file: postsController.js:11 ~ exports.createNewPost= ~ post:", post)
    if (post)
      return next(createError.NotFound('Post with this title or slug already exists'));
    
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
          create: categories.map((categoryId) => ({
            category: {
              connect: {
                id: categoryId
              }
            }
          })),
        },
        tags: {
          create: tags.map((tagId) => ({
            tag: {
              connect: {
                id: tagId
              }
            }
          })),
        },
      },
    });
    res.status(200).json({
      status: true,
      message: 'Post created successful',
      data: newPost
    });
  } catch (error) {
    next(createError(error))
  }
}

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
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
    });

    const processedPosts = posts.map(post => {
      const categories = post.categories.map(categoryOnPost => categoryOnPost.category.name);
      const tags = post.tags.map(tagOnPost => tagOnPost.tag.name);

      return {
        ...post,
        categories,
        tags,
      }
    });

    res.status(200).json({
      status: true,
      message: 'All posts retrieved successful',
      data: processedPosts
    });
  } catch (error) {
    next(createError(error.message))
  }
}

exports.getPostById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true, categories: true, tags: true },
    });
    if (!post) {
      return next(createError.NotFound('Post already exists'));
    }
    res.json(post);
  } catch (error) {
    next(createError(error))
  }
}

exports.getPostsByCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        categories: {
          some: {
            id: categoryId,
          },
        },
      },
    });
    res.json(posts);
  } catch (error) {
    next(createError(error))
  }
}

exports.getPostsByTag = async (req, res, next) => {
  const { tagId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        tags: {
          some: {
            id: tagId,
          },
        },
      },
    });
    res.json(posts);
  } catch (error) {
    next(createError(error))
  }
}

exports.getPostsByAuthor = async (req, res, next) => {
  const { authorId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        author: {
          some: {
            id: authorId,
          },
        },
      },
    });
    res.json(posts);
  } catch (error) {
    next(createError(error))
  }
}

exports.updatePost = async (req, res, next) => {
  const { id } = req.params;
  const { title, subtitle, cover, slug, content, published, authorId, categories, tags } = req.body.data;
  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        subtitle,
        cover,
        slug,
        content,
        published,
        author: { connect: { id: authorId } },
        categories: {
          connect: categories.map((categoryId) => ({ id: categoryId })),
        },
        tags: {
          connect: tags.map((tagId) => ({ id: tagId })),
        },
      },
    });
    res.status(200).json({
      status: true,
      message: 'Post updated successful',
      data: updatedPost
    });
  } catch (error) {
    next(createError(error))
  }
}

exports.deletePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id },
    });
    res.status(200).json({ status: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(createError(error))
  }
}