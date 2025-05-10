module.exports = (sequelize, DataTypes) => {
  const Curso = sequelize.define('Curso', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    carga_horaria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  Curso.associate = (models) => {
    Curso.belongsToMany(models.Aluno, {
      through: 'AlunoCursos',
      as: 'Alunos',
      foreignKey: 'cursoId'
    });
  };

  return Curso;
};