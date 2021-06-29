const Handlebars = require('handlebars');

module.exports = {
    sum: (a,b) => a + b,

    sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : 'default';
        const icons = {
            
            default : 'fas fa-sort',
            asc:'fas fa-sort-amount-up',
            desc:'fas fa-sort-amount-down'

        };
        const types = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc',
        }
        
        const icon = icons[sortType];
        const type = types[sortType];
        const href = Handlebars.escapeExpression(`./admin?_sort&column=${field}&type=${type}`);
      
        const output = `<a href="${href}">
        <span class="${icon}"></span>
      </a>`;
      return new Handlebars.SafeString(output);
    },

    disableSize: numberOfProductInSize => {
        let status = "";
        if (numberOfProductInSize == 0)
            status = 'disabled';
        return status;
    },

    initSize: (productId, session, currentValue) => {
        let status = "";
        productId = productId.toString();
        if (session.size.get(productId) == currentValue) 
            status = 'selected';
        return status;
    },

    /* checkOutStock: (quantityOfSizeS, quantityOfSizeM, quantityOfSizeL) => {
        let status = "";
        if (quantityOfSizeS == 0 && quantityOfSizeM == 0 && quantityOfSizeL == 0) {
            status = ""
        }
        return status;
    } */

    priceOfProduct: (productId, session, unitPrice) => {
        productId = productId.toString();
        let quantity = session.cart.get(productId);
        return quantity * unitPrice;
    },
}