import BaseServices from "./base.services";

class QuotationServices extends BaseServices {
  constructor() {
    super(`${process.env.REACT_APP_BACKEND_URL}/api/quotation`);
  }

  async getQuotation(id) {
    return await this.get('/' + id, 'getQuotation', "quotation");
  }

  async createQuotation(data) {
    return await this.post("", "create", 'getQuotation', data);
  }
}

const MyServices = new QuotationServices();
export default MyServices;