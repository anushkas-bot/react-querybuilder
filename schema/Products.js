cube(`Products`, {
  sql: `SELECT * FROM public.products`,
  
  joins: {
    ProductCategories: {
      sql: `${CUBE}.product_category_id = ${ProductCategories}.id`,
      relationship: `belongsTo`
    },
    
    Suppliers: {
      sql: `${CUBE}.supplier_id = ${Suppliers}.id`,
      relationship: `belongsTo`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [name, id, createdAt]
    }
  },
  
  dimensions: {
    name: {
      sql: `name`,
      type: `string`
    },
    
    description: {
      sql: `description`,
      type: `string`
    },
    
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    createdAt: {
      sql: `created_at`,
      type: `time`
    }
  }
});
