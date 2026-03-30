import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import slugify from 'slugify';
import { CreateProductDto } from './dto/create-product.dto';
import { AuditLogService } from '../audit/audit-log.service';
import { ProductStatus, VisibilityStatus, UserRole } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createProductDto: CreateProductDto, adminId?: string): Promise<any> {
    const { 
      name, description, price, discount_price, currency, 
      categories: categoryNames, stock, stock_status, status, 
      visibility, featured, imageUrl, images, video_url, 
      tags, publish_date, sale_start, sale_end 
    } = createProductDto;

    const slug = slugify(name, { lower: true, strict: true });
    
    // Check if product already exists
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`A product with the name "${name}" already exists.`);
    }

    // Ensure categories exist or create them
    const categoryConnect = await Promise.all(
      categoryNames.map(async (catName) => {
        let category = await this.prisma.category.findUnique({ where: { slug: slugify(catName, { lower: true, strict: true }) } });
        if (!category) {
          category = await this.prisma.category.create({
            data: {
              name: catName,
              slug: slugify(catName, { lower: true, strict: true }),
            }
          });
        }
        return { id: category.id };
      })
    );

    const product = await this.prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        discount_price,
        currency: currency || 'USD',
        stock,
        stock_status,
        status: status || 'draft',
        visibility: visibility || 'public',
        featured: featured || false,
        image: imageUrl,
        images: images || [],
        video_url,
        tags: tags || [],
        publish_date: publish_date ? new Date(publish_date) : null,
        sale_start: sale_start ? new Date(sale_start) : null,
        sale_end: sale_end ? new Date(sale_end) : null,
        categories: {
          connect: categoryConnect
        },
        analytics: {
          create: {} // Initial empty analytics
        }
      },
      include: {
        categories: true,
        analytics: true
      }
    });
    
    // Audit Log
    await this.auditLogService.log({
      action: 'CREATE_PRODUCT',
      target: 'Product',
      targetId: product.id,
      adminId,
      metadata: { name: product.name, price: product.price, stock: product.stock },
    });

    return product;
  }

  async findAll(query: {
    category?: string;
    status?: ProductStatus;
    featured?: boolean;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    isAdmin?: boolean;
    userRole?: UserRole;
  }): Promise<any[]> {
    const { category, status, featured, search, sort, minPrice, maxPrice, isAdmin, userRole } = query;

    const where: any = {};
    const andConditions: any[] = [];

    // 1. Visibility & Status Logic
    if (!isAdmin) {
      // Public view: only published or scheduled (if date is past)
      andConditions.push({
        OR: [
          { status: 'published' },
          { 
            status: 'scheduled',
            publish_date: { lte: new Date() }
          }
        ]
      });
      where.visibility = 'public';
    } else if (status) {
      where.status = status;
    }

    // 2. Category Filter
    if (category) {
      where.categories = {
        some: {
          OR: [
            { name: { contains: category, mode: 'insensitive' } },
            { slug: category }
          ]
        }
      };
    }

    // 3. Featured Filter
    if (featured !== undefined) {
      where.featured = featured;
    }

    // 4. Search Logic
    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search] } }
        ]
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }


    // 5. Price Range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    // 6. Sorting
    let orderBy: any = { created_at: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'name') orderBy = { name: 'asc' };

    const products = await this.prisma.product.findMany({
      where,
      include: {
        categories: true,
        analytics: true
      },
      orderBy
    });

    // 7. Dynamic Pricing & Post-fetch logic
    return products.map(product => this.applyDynamicPricing(product));
  }

  async findOne(idOrSlug: string, trackView = false): Promise<any> {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }]
      },
      include: {
        categories: true,
        analytics: true
      }
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    if (trackView) {
      await this.prisma.productAnalytics.update({
        where: { productId: product.id },
        data: { views: { increment: 1 } }
      });
    }

    return this.applyDynamicPricing(product);
  }

  private applyDynamicPricing(product: any) {
    const now = new Date();
    let effective_price = Number(product.price);
    let on_sale = false;

    if (
      product.discount_price &&
      product.sale_start && product.sale_end &&
      now >= product.sale_start && now <= product.sale_end
    ) {
      effective_price = Number(product.discount_price);
      on_sale = true;
    }

    return {
      ...product,
      effective_price,
      on_sale,
      discount_percentage: on_sale ? Math.round((1 - (effective_price / Number(product.price))) * 100) : 0
    };
  }

  async update(id: string, data: any, adminId?: string): Promise<any> {
    const { name, categories, imageUrl, images, tags, publish_date, sale_start, sale_end, ...rest } = data;
    const updateData: any = { ...rest };
    
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }

    if (imageUrl) updateData.image = imageUrl;
    if (images) updateData.images = images;
    if (tags) updateData.tags = tags;
    if (publish_date) updateData.publish_date = new Date(publish_date);
    if (sale_start) updateData.sale_start = new Date(sale_start);
    if (sale_end) updateData.sale_end = new Date(sale_end);

    if (categories && Array.isArray(categories)) {
      updateData.categories = {
        set: [], // Clear existing
        connectOrCreate: await Promise.all(categories.map(async (catName: string) => ({
          where: { slug: slugify(catName, { lower: true, strict: true }) },
          create: { name: catName, slug: slugify(catName, { lower: true, strict: true }) }
        })))
      };
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { categories: true, analytics: true }
    });

    // Audit Log
    await this.auditLogService.log({
      action: 'UPDATE_PRODUCT',
      target: 'Product',
      targetId: product.id,
      adminId,
      metadata: { changes: data },
    });

    return this.applyDynamicPricing(product);
  }

  async bulkAction(ids: string[], action: string, data?: any, adminId?: string): Promise<any> {
    switch (action) {
      case 'publish':
        return this.prisma.product.updateMany({
          where: { id: { in: ids } },
          data: { status: 'published' }
        });
      case 'delete':
        return this.prisma.product.deleteMany({
          where: { id: { in: ids } }
        });
      case 'mark_featured':
        return this.prisma.product.updateMany({
          where: { id: { in: ids } },
          data: { featured: true }
        });
      default:
        throw new ConflictException('Invalid bulk action');
    }
  }

  async remove(id: string, adminId?: string): Promise<void> {
    const product = await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });

    // Audit Log
    await this.auditLogService.log({
      action: 'DELETE_PRODUCT',
      target: 'Product',
      targetId: id,
      adminId,
      metadata: { name: product.name },
    });
  }

  async count(): Promise<number> {
    return await this.prisma.product.count();
  }
}
