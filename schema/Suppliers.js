cube(`Suppliers`, {
  sql: `SELECT * FROM public.suppliers`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [id, createdAt]
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    email: {
      sql: `email`,
      type: `string`
    },
    
    address: {
      sql: `address`,
      type: `string`
    },
    
    company: {
      sql: `company`,
      type: `string`
    },
    
    createdAt: {
      sql: `created_at`,
      type: `time`
    }
  }
});
