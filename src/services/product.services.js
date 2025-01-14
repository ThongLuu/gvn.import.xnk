import BaseServices from "./base.services";

class ProductServices extends BaseServices {
  constructor() {
    super(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
  }

  async getProduct({ page = 1, limit = 20, sort = 'default', name, category_id, price_from, price_to, filterAttributes = {} }) {
    return await this.get('', 'getProduct', "product", {
      page,
      limit,
      sort,
      name,
      category_id,
      filterAttributes,
      price_from, 
      price_to
    });
  }
}

const MyServices = new ProductServices();
export default MyServices;