'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',[
      {
        first_name:'John',
        last_name: 'Doe',
        email:'admin@test.com',
        role:'admin',
        password: '$2a$10$iyFH3/jgULgC0sMJ/VST1uR/.GKnx5IGtVIPsbhpsoz.pxe2yWnL6',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name:'Joanna',
        last_name: 'Doe',
        email:'seller@test.com',
        role:'seller',
        password: '$2a$10$iyFH3/jgULgC0sMJ/VST1uR/.GKnx5IGtVIPsbhpsoz.pxe2yWnL6',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name:'Mike',
        last_name: 'Doe',
        email:'buyer@test.com',
        role:'buyer',
        password: '$2a$10$iyFH3/jgULgC0sMJ/VST1uR/.GKnx5IGtVIPsbhpsoz.pxe2yWnL6',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
