cube(`Users`, {
  sql: `SELECT * FROM public.users`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: [city, id, lastName, firstName, createdAt]
    }
  },
  
  dimensions: {
    city: {
      sql: `city`,
      type: `string`
    },
    
    gender: {
      sql: `gender`,
      type: `string`
    },
    
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    company: {
      sql: `company`,
      type: `string`
    },
    
    lastName: {
      sql: `last_name`,
      type: `string`
    },
    
    firstName: {
      sql: `first_name`,
      type: `string`
    },
    
    createdAt: {
      sql: `created_at`,
      type: `time`
    }
  }
});
