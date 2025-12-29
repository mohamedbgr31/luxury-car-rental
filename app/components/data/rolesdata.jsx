// data/rolesData.js

const roles = [
    {
      id: 1,
      name: "Admin",
      description: "Full access to all settings and data.",
      permissions: ["manage_users", "manage_cars", "view_reports", "delete_data"]
    },
    {
      id: 2,
      name: "Manager",
      description: "Can manage cars and view requests.",
      permissions: ["manage_cars", "view_requests"]
    },
    {
      id: 3,
      name: "Agent",
      description: "View-only access to system data and reports.",
      permissions: ["view_requests", "view_cars", "view_contacts", "view_faq"]
    }
  ];
  
  export default roles;
  