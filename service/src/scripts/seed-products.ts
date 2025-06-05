import { Command } from 'commander';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

program
  .name('seed-products')
  .description('Импортирует продукты из JSON в базу данных')
  .action(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);
    const productsService = app.get(ProductsService);

    const filePath = path.join(__dirname, '../../public/generated_parts.json');

    if (!fs.existsSync(filePath)) {
      console.error('❌ Файл не найден:', filePath);
      process.exit(1);
    }

    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const parts = JSON.parse(jsonData);

    console.log(`🔄 Импорт ${parts.length} запчастей...`);

    for (const part of parts) {
      try {
        await productsService.create({
          name: part.title,
          description: part.description || '',
          price: part.price || 0,
          brand: part.brand || 'Без бренда',
          sku: part.sku || `SKU-${Math.random().toString(36).substring(2, 8)}`,
          stock: part.stock || 10,
          images: part.image ? [part.image] : [],
          specifications: {
            model: part.model,
            year: part.year,
            engine: part.engine,
            body: part.body,
            modification: part.modification,
          },
        });
      } catch (error) {
        console.error('Ошибка при импорте:', part.title, error.message);
      }
    }

    console.log('✅ Импорт завершен.');
    await app.close();
  });

program.parseAsync(process.argv);
