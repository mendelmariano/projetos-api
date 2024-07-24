import Sequelize from 'sequelize';
import Ambiente from '../app/models/Ambiente';
import Deploy from '../app/models/Deploy';
import Funcionalidade from '../app/models/Funcionalidade';
import Profile from '../app/models/Profile';
import Project from '../app/models/Project';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [Profile, User, Project, Ambiente, Funcionalidade, Deploy];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
