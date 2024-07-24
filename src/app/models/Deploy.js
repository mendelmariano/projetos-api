// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize, { Model } from 'sequelize';
// eslint-disable-next-line import/no-extraneous-dependencies

class Deploy extends Model {
    static init(sequelize) {
        super.init(
            {
                versao: Sequelize.STRING,
                data: Sequelize.STRING,
            },
            {
                sequelize,
                timestamps: true,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Project, {
            foreignKey: 'project_id',
            targetKey: 'id',
            as: 'project',
        });

        this.belongsTo(models.Ambiente, {
            foreignKey: 'ambiente_id',
            targetKey: 'id',
            as: 'ambiente',
        });

        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'id',
            as: 'user',
        });
    }
}

export default Deploy;
