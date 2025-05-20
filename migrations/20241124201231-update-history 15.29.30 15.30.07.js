'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Histories', 'specialtyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('Histories', 'teethExamined', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Histories', 'bills', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Histories', 'examinationFee', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Histories', 'additionalFee', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Histories', 'totalFee', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Histories', 'specialtyId');
    await queryInterface.removeColumn('Histories', 'teethExamined');
    await queryInterface.removeColumn('Histories', 'bills');
    await queryInterface.removeColumn('Histories', 'examinationFee');
    await queryInterface.removeColumn('Histories', 'additionalFee');
    await queryInterface.removeColumn('Histories', 'totalFee');
  },
};
