import { Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { promises as fs } from 'fs';
import { join } from 'path';

@Controller('products')
export class ProductsImportController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('import')
  async importFromFile(): Promise<{ imported: number }> {
    const filePath = join(process.cwd(), 'public', 'generated_parts.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(file);

    let imported = 0;

    for (const item of data) {
      const {
        title,
        brand,
        model,
        year,
        body,
        engine,
        modification,
        price,
        image,
      } = item;

      const name = `${title} ${brand} ${model}`;
      const description = `Модель: ${model}, Год: ${year}, Кузов: ${body}, Двигатель: ${engine}, Модификация: ${modification}`;
      const categoryName = title;

      await this.productsService.createFromImport({
        name,
        description,
        brand,
        price,
        image,
        categoryName,
      });

      imported++;
    }

    return { imported };
  }
}