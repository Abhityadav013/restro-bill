const moment = require("moment");
 
 const searchCommands = {
  paymentMethod:{
    filterName:"paymentMethod",
    conditions: (value) => new RegExp(value, 'i'),
  },
  orderType: {
    filterName: "orderType",
    conditions: (value) => value
  },
  orderDate: {
    filterName: "orderDate",
    conditions: (value) => value
  },

  today: {
    filterName: "orderDate",
    conditions: (value) => value
  },

  currentWeek: {
    filterName: "orderDate",
    conditions: (value) => {
      const startOfWeek = moment(value).startOf("week").format("YYYY-MM-DD");
      const endOfWeek = moment(value).endOf("week").format("YYYY-MM-DD");
      return { $gte: startOfWeek, $lte: endOfWeek };
    },
  },

  currentMonth: {
    filterName: "orderDate",
    conditions: (value) => {
      const startOfMonth = moment(value).startOf("month").format("YYYY-MM-DD");
      const endOfMonth = moment(value).endOf("month").format("YYYY-MM-DD");
      return { $gte: startOfMonth, $lte: endOfMonth };
    },
  },

  currentYear: {
    filterName: "orderDate",
    conditions: (value) => {
      const startOfYear = moment(value).startOf("year").format("YYYY-MM-DD");
      const endOfYear = moment(value).endOf("year").format("YYYY-MM-DD");
      return { $gte: startOfYear, $lte: endOfYear };
    },
  },

  dateRange: {
    filterName: "orderDate",
    conditions: (value) => {
 
      // Split the value to get start and end date parts
      const [startDate, endDate] = value.split(" TO ");
    
      const start = moment(startDate).format("YYYY-MM-DD"); 
      const end = moment(endDate).format("YYYY-MM-DD"); 
      
      // Return the MongoDB query using $gte and $lte for the range
      return { $gte: start, $lte: end };
    },
  },

};


module.exports = { searchCommands };