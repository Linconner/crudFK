module.exports = (sequelize, DataTypes) => {
  const Aluno = sequelize.define('Aluno', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    idade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    }
  });

  Aluno.associate = (models) => {
    Aluno.belongsToMany(models.Curso, {
      through: 'AlunoCursos',
      as: 'Cursos',
      foreignKey: 'alunoId'
    });
  };

  return Aluno;
};