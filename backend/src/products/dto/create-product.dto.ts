import { IsString, IsNotEmpty, IsNumber, IsUrl, Min, IsInt, IsOptional, IsArray, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ProductStatus, VisibilityStatus, StockStatus } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @IsNumber({}, { message: 'Discount price must be a valid number' })
  @Min(0, { message: 'Discount price cannot be negative' })
  @IsOptional()
  discount_price?: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: 'At least one category is required' })
  categories: string[];

  @IsInt({ message: 'Stock must be an integer' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;

  @IsEnum(StockStatus)
  @IsOptional()
  stock_status?: StockStatus;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsEnum(VisibilityStatus)
  @IsOptional()
  visibility?: VisibilityStatus;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsUrl({}, { message: 'Please provide a valid image URL' })
  imageUrl: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];

  @IsUrl({}, { message: 'Please provide a valid video URL' })
  @IsOptional()
  video_url?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsDateString({}, { message: 'Invalid publish date' })
  @IsOptional()
  publish_date?: string;

  @IsDateString({}, { message: 'Invalid sale start date' })
  @IsOptional()
  sale_start?: string;

  @IsDateString({}, { message: 'Invalid sale end date' })
  @IsOptional()
  sale_end?: string;
}
