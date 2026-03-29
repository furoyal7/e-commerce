import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, slug, description, image, parentId } = createCategoryDto;

    // Check if slug already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    // If parentId is provided, check if parent exists
    if (parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }

    return this.prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        parentId,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findRootCategories() {
    return this.prisma.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: {
          include: {
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          include: {
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        products: {
          where: {
            status: 'published',
          },
          include: {
            _count: {
              select: {
                cartItems: true,
                orderItems: true,
                reviews: true,
              },
            },
          },
          take: 10, // Limit to 10 products for preview
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { name, slug, description, image, parentId } = updateCategoryDto;

    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    // If slug is being updated, check if new slug already exists
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await this.prisma.category.findUnique({
        where: { slug },
      });

      if (slugExists) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // If parentId is being updated, check if parent exists and prevent circular references
    if (parentId !== undefined) {
      if (parentId) {
        const parentCategory = await this.prisma.category.findUnique({
          where: { id: parentId },
        });

        if (!parentCategory) {
          throw new NotFoundException('Parent category not found');
        }

        // Prevent circular reference
        if (parentId === id) {
          throw new ConflictException('Category cannot be its own parent');
        }

        // Check if this would create a circular reference
        const isDescendant = await this.isDescendant(parentId, id);
        if (isDescendant) {
          throw new ConflictException('Cannot create circular reference in category hierarchy');
        }
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        image,
        parentId,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if category has products or children
    if (category._count.products > 0) {
      throw new ConflictException('Cannot delete category with associated products');
    }

    if (category._count.children > 0) {
      throw new ConflictException('Cannot delete category with child categories');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  private async isDescendant(ancestorId: string, categoryId: string): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { parentId: true },
    });

    if (!category || !category.parentId) {
      return false;
    }

    if (category.parentId === ancestorId) {
      return true;
    }

    return this.isDescendant(ancestorId, category.parentId);
  }
}
