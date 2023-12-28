const fs = require('fs/promises');

class ProductManager {
  constructor() {
    this.path = "./productos.json";
    this.idCounter = 0;
    this.products = [];
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      this.idCounter = Math.max(...this.products.map((product) => product.id), 0);
    } catch (error) {
      this.products = [];
    }
  }

  generateProductId() {
    return ++this.idCounter;
  }

  async saveProductsToFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son obligatorios");
        return;
      }
      if (!this.products.some((p) => p.code === code)) {
        const newProduct = {
          id: this.generateProductId(),
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        this.products.push(newProduct);
        await this.saveProductsToFile();

        console.log(`Se ha agregado el producto: ${title} con éxito`);
      } else {
        console.log(`El código: ${code} se encuentra duplicado, verificar y reemplazar por favor`);
      }
    } catch (error) {
      console.error('Error no se pudo guardar el producto:', error.message);
    }
  }
  async updateProduct(id, updatedProduct) {
    try {
      const index = this.products.findIndex((product) => product.id === id);

      if (index !== -1) {

        Object.assign(this.products[index], updatedProduct);


        await this.saveProductsToFile();

        console.log(`Producto con ID ${id} actualizado con éxito`);
      } else {
        console.log(`Producto con ID ${id} no encontrado`);
      }
    } catch (error) {
      console.error('Error no se pudo actualizar el producto:', error.message);
    }
  }
  async deleteProduct(id) {
    try {
      const index = this.products.findIndex((product) => product.id === id);

      if (index !== -1) {
        this.products.splice(index, 1); 

        await this.saveProductsToFile();

        console.log(`Producto con ID ${id} eliminado con éxito`);
      } else {
        console.log(`Producto con ID ${id} no encontrado`);
      }
    } catch (error) {
      console.error('Error no se pudo borrar el producto:', error.message);
    }
  }

  getProducts() {
    console.log(this.products);
  }

  async getProductById(id) {
    const okProduct = this.products.find((product) => product.id === id);

    if (okProduct) {
      console.log("Producto encontrado:");
      console.log(okProduct);
    } else {
      console.log(`Producto con el id ${id} no existe`);
    }
  }
}


async function run() {
  const productManager = new ProductManager();
  await productManager.init();

  console.log("---------Carga de productos-----------");
  await productManager.addProduct('remera', 'remera talle 4', 3500, 'renera1.jpg', 'cod1', 10);
  await productManager.addProduct('pantalon', 'pantalon jean', 40000, 'pantalon1.jpg', 'cod2', 5);
  await productManager.addProduct('corbata', 'negra', 10000, 'corbata1.jpg', 'cod3', 7);

  console.log("---------Carga de productos con cod repetido-----------");
  await productManager.addProduct('camiza', 'camiza a cuadros', 25000, 'camiza2.jpg', 'cod2', 5);

  console.log("---------Carga de productos con campos vacíos-----------");
  await productManager.addProduct('corbata', '', 3000, 'corbata3.jpg', 'cod5', 10);

  console.log("---------Mostrar productos-----------");
  productManager.getProducts();

  console.log("---------busqueda por id-----------");
  await productManager.getProductById(1);

  console.log("---------busqueda por id inexistente-----------");
  await productManager.getProductById(6);

  console.log("---------Modificacion de productos-----------");
  await productManager.updateProduct(1, {
    title: 'remera2',
    description: 'mangas largas',
    price: 500,
    thumbnail: 'nueva_imagen.jpg',
    code: 'cod1',
    stock: 8,
  });

  console.log("---------Mostrar productos actualizados-----------");
  await productManager.getProducts();

  console.log("---------eliminar producto-----------");
  await productManager.deleteProduct(1);

  console.log("---------Mostrar productos después de eliminar-----------");
  await productManager.getProducts();
}

run();